// screens/QuizScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import questionsNO from '../data/questions.no.json';
import questionsEN from '../data/questions.en.json';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

// Enkel shuffle-funksjon
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizScreen({ route, navigation }) {
  const { colors, spacing, radius, font, scheme } = useThemeColors();
  const { t, lang } = useI18n();
  const category = route?.params?.category ?? 'blandet';

  // Velg spørsmålsbank etter språk
  const dict = lang === 'en' ? questionsEN : questionsNO;

  // Fallback per kategori – bruker norsk hvis engelsk mangler
  const merged = useMemo(() => {
    const out = { ...dict };
    for (const key of Object.keys(questionsNO)) {
      if (!out[key] || !Array.isArray(out[key])) out[key] = questionsNO[key];
    }
    return out;
  }, [dict]);

  const questions = useMemo(() => {
    if (category === 'blandet') {
      return shuffle(Object.values(merged).flat());
    }
    return shuffle(merged[category] ?? []);
  }, [merged, category]);

  const realQuestions = questions.filter(q => !q.id.startsWith('intro_'));
  const introCard = questions.find(q => q.id.startsWith('intro_'));
  const total = realQuestions.length;

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [best, setBest] = useState(null);

  const q = realQuestions[idx];
  const bestKey = `phishshield_best_${category}`;

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(bestKey);
      setBest(raw ? JSON.parse(raw) : null);
    })();
  }, [bestKey]);

  function answer(userThinksPhish) {
    if (answered || !q) return;
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

  // ✅ FORBEDRET: Deling med oversatt kategorinavn
  async function shareResult() {
    const pct = Math.round((score / total) * 100);
    const categoryLabel = t(`home.categories.${category}`);
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

  function restart() {
    setIdx(0);
    setScore(0);
    setAnswered(false);
    setShowResult(false);
  }

  // ---------- UI ----------
  if (!q) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>{t('quiz.backHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showResult) {
    const pct = Math.round((score / total) * 100);
    return (
      <View style={{ padding: spacing.lg }}>
        <Text style={{ fontSize: font.h1 }}>{t('quiz.resultTitle')}</Text>
        <Text>{score} / {total} ({pct}%)</Text>

        <TouchableOpacity onPress={restart}>
          <Text>{t('quiz.replay')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={shareResult}>
          <Text>{t('quiz.share')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text>{t('quiz.backHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ padding: spacing.lg }}>
      {introCard && (
        <View style={{ marginBottom: spacing.md }}>
          <Text style={{ fontWeight: '700' }}>
            {scheme === 'dark' ? 'ℹ️' : '🧠'} {introCard.prompt}
          </Text>
          <Text>{introCard.why}</Text>
        </View>
      )}

      <Text>{t('quiz.progress', { i: idx + 1, total })}</Text>
      <Text>{q.prompt}</Text>

      <TouchableOpacity onPress={() => answer(true)}>
        <Text>{t('quiz.choicePhish')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => answer(false)}>
        <Text>{t('quiz.choiceSafe')}</Text>
      </TouchableOpacity>

      {answered && (
        <TouchableOpacity onPress={next}>
          <Text>{idx + 1 < total ? t('quiz.next') : t('quiz.seeResult')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
