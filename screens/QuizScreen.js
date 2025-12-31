// screens/QuizScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import questionsNO from '../data/questions.no.json';
import questionsEN from '../data/questions.en.json';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizScreen({ route, navigation }) {
  const { colors, spacing } = useThemeColors();
  const { t, lang } = useI18n();

  const category = route?.params?.category ?? 'blandet';
  const dict = lang === 'en' ? questionsEN : questionsNO;

  const questions = useMemo(() => {
    const all =
      category === 'blandet'
        ? Object.values(dict).flat()
        : dict[category] ?? [];
    return shuffle(all);
  }, [dict, category]);

  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);

  const q = questions[i];
  const isIntro = q?.type === 'intro';

  if (!q) {
    navigation.replace('QuizResult', {
      score,
      total: questions.filter(x => x.isPhish !== undefined).length,
    });
    return null;
  }

  function answer(v) {
    if (answered) return;
    const correct = v === q.isPhish;
    if (correct) setScore(s => s + 1);
    setLastCorrect(correct);
    setAnswered(true);
  }

  function next() {
    setAnswered(false);
    setLastCorrect(null);
    setI(i + 1);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
      }}
    >
      {/* Spørsmål */}
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: '700',
          marginBottom: spacing.lg,
        }}
      >
        {q.prompt}
      </Text>

      {/* INTRO */}
      {isIntro ? (
        <>
          <Text
            style={{
              color: colors.textMuted,
              marginBottom: spacing.lg,
            }}
          >
            {q.why}
          </Text>

          <TouchableOpacity onPress={next}>
            <Text style={{ color: colors.tint, fontSize: 16 }}>
              {t('quiz.start')}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* SVAR */}
          <TouchableOpacity
            onPress={() => answer(true)}
            style={{ marginBottom: spacing.md }}
          >
            <Text style={{ color: colors.warning, fontSize: 16 }}>
              {t('quiz.choicePhish')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => answer(false)}
            style={{ marginBottom: spacing.lg }}
          >
            <Text style={{ color: colors.success, fontSize: 16 }}>
              {t('quiz.choiceSafe')}
            </Text>
          </TouchableOpacity>

          {/* FEEDBACK */}
          {answered && (
            <>
              <Text
                style={{
                  color: lastCorrect ? colors.success : colors.danger,
                  marginBottom: spacing.sm,
                  fontWeight: '600',
                }}
              >
                {lastCorrect ? t('quiz.correct') : t('quiz.wrong')}
              </Text>

              {q.why && (
                <Text
                  style={{
                    color: colors.textMuted,
                    marginBottom: spacing.lg,
                  }}
                >
                  {q.why}
                </Text>
              )}

              <TouchableOpacity onPress={next}>
                <Text style={{ color: colors.tint, fontSize: 16 }}>
                  {t('quiz.next')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
}
