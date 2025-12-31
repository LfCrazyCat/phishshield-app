// screens/QuizScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import questionsNO from '../data/questions.no.json';
import questionsEN from '../data/questions.en.json';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

/* ---------------- Utils ---------------- */

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- Screen ---------------- */

export default function QuizScreen({ route, navigation }) {
  const { colors, spacing, radius, font, scheme } = useThemeColors();
  const { t, lang } = useI18n();

  const category = route?.params?.category ?? 'blandet';

  /* ---------- Spørsmål ---------- */

  const dict = lang === 'en' ? questionsEN : questionsNO;

  // fallback: bruk norsk hvis engelsk kategori mangler
  const merged = useMemo(() => {
    const out = { ...dict };
    Object.keys(questionsNO).forEach(key => {
      if (!Array.isArray(out[key])) out[key] = questionsNO[key];
    });
    return out;
  }, [dict]);

  const questions = useMemo(() => {
    if (category === 'blandet') {
      return shuffle(Object.values(merged).flat());
    }
    return shuffle(merged[category] ?? []);
  }, [merged, category]);

  const introCard = questions.find(q => q.id?.startsWith('intro_'));
  const realQuestions = questions.filter(q => !q.id?.startsWith('intro_'));
  const total = realQuestions.length;

  /* ---------- State ---------- */

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [best, setBest] = useState(null);

  const q = realQuestions[idx];
  const bestKey = `phishshield_best_${category}`;

  /* ---------- Beste score ---------- */

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(bestKey);
      setBest(raw ? JSON.parse(raw) : null);
    })();
  }, [bestKey]);

  useEffect(() => {
    if (!showResult) return;

    (async () => {
      const cur = { score, total };
      const raw = await AsyncStorage.getItem(bestKey);

      if (!raw) {
        await AsyncStorage.setItem(bestKey, JSON.stringify(cur));
        setBest(cur);
        return;
      }

      const prev = JSON.parse(raw);
      const prevPct = Math.round((prev.score / prev.total) * 100);
      const curPct = Math.round((score / total) * 100);

      if (curPct > prevPct) {
        await AsyncStorage.setItem(bestKey, JSON.stringify(cur));
        setBest(cur);
      }
    })();
  }, [showResult, score, total, bestKey]);

  /* ---------- Handlers ---------- */

  function answer(userThinksPhish) {
    if (!q || answered) return;
    if (userThinksPhish === q.isPhish) setScore(s => s + 1);
    setAnswered(true);
  }

  function next() {
    if (idx + 1 < total) {
      setIdx(i => i + 1);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  }

  function restart() {
    setIdx(0);
    setScore(0);
    setAnswered(false);
    setShowResult(false);
  }

  async function shareResult() {
    const pct = Math.round((score / total) * 100);
    const categoryLabel = t(`home.categories.${category}`) ?? category;

    const msg = t('quiz.shareMsg', {
      category: categoryLabel,
      score,
      total,
      pct,
    });

    try {
      await Share.share({ message: msg });
    } catch {}
  }

  /* UI: ingen spørsmål */

  if (!q && !showResult) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.tint }}>{t('quiz.backHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*  UI: resultat  */

  if (showResult) {
    const pct = Math.round((score / total) * 100);

    return (
      <View style={{ flex: 1, padding: spacing.lg, gap: spacing.md }}>
        <Text style={{ fontSize: font.h1, fontWeight: '800', textAlign: 'center' }}>
          {t('quiz.resultTitle')}
        </Text>

        <Text style={{ fontSize: 24, textAlign: 'center' }}>
          {score} / {total} ({pct}%)
        </Text>

        {best && (
          <Text style={{ textAlign: 'center', color: colors.text }}>
            {t('quiz.bestText', {
              score: best.score,
              total: best.total,
              pct: Math.round((best.score / best.total) * 100),
            })}
          </Text>
        )}

        <TouchableOpacity onPress={restart}>
          <Text style={{ color: colors.tint, textAlign: 'center' }}>
            {t('quiz.replay')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={shareResult}>
          <Text style={{ color: colors.tint, textAlign: 'center' }}>
            {t('quiz.share')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={{ color: colors.tint, textAlign: 'center' }}>
            {t('quiz.backHome')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* UI: quiz  */

  return (
    <View style={{ flex: 1, padding: spacing.lg, gap: spacing.md }}>
      {introCard && (
        <View
          style={{
            padding: spacing.md,
            borderRadius: radius.md,
            backgroundColor: scheme === 'dark' ? '#1E293B' : '#F1F5F9',
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>
            {scheme === 'dark' ? 'ℹ️' : '🧠'} {introCard.prompt}
          </Text>
          <Text>{introCard.why}</Text>
        </View>
      )}

      <Text>{t('quiz.progress', { i: idx + 1, total })}</Text>
      <Text style={{ fontSize: font.body, fontWeight: '600' }}>{q.prompt}</Text>

      <TouchableOpacity onPress={() => answer(true)}>
        <Text style={{ color: colors.warning }}>{t('quiz.choicePhish')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => answer(false)}>
        <Text style={{ color: colors.success }}>{t('quiz.choiceSafe')}</Text>
      </TouchableOpacity>

      {answered && (
        <TouchableOpacity onPress={next}>
          <Text style={{ color: colors.tint }}>
            {idx + 1 < total ? t('quiz.next') : t('quiz.seeResult')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
