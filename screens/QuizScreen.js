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
  const { colors, spacing, radius } = useThemeColors();
  const { t, lang } = useI18n();

  const category = route?.params?.category ?? 'blandet';
  const dict = lang === 'en' ? questionsEN : questionsNO;

  //  Bygging av spørsmålsliste
  const questions = useMemo(() => {
    const all =
      category === 'blandet'
        ? Object.values(dict).flat()
        : dict[category] ?? [];
    return shuffle(all);
  }, [dict, category]);

  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  const q = questions[index];

  //  intro-detektering
  const isIntro = q?.isPhish === undefined;

  // finito med quiz
  if (!q) {
    navigation.replace('QuizResult', {
      score,
      total: questions.filter(q => q.isPhish !== undefined).length,
    });
    return null;
  }

  function answer(value) {
    if (answered) return;

    const correct = value === q.isPhish;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setAnswered(true);
  }

  function next() {
    setAnswered(false);
    setIsCorrect(null);
    setIndex(i => i + 1);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
      }}
    >
      {/* questions kort*/}
      <View
        style={{
          backgroundColor: colors.card,
          padding: spacing.lg,
          borderRadius: radius.lg,
          marginBottom: spacing.lg,
        }}
      >
        <Text
          style={{
            color: colors.heading,
            fontSize: 18,
            fontWeight: '700',
          }}
        >
          {q.prompt}
        </Text>
      </View>

      {/* INTRO */}
      {isIntro ? (
        <>
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
            <Text
              style={{
                color: colors.tint,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              ▶ {t('quiz.start')}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* hva som er PHISH */}
          <TouchableOpacity
            disabled={answered}
            onPress={() => answer(true)}
            style={{
              backgroundColor: colors.warning + '22',
              padding: spacing.md,
              borderRadius: radius.md,
              marginBottom: spacing.md,
              opacity: answered ? 0.6 : 1,
            }}
          >
            <Text style={{ color: colors.warning, fontWeight: '600' }}>
              🚨 {t('quiz.choicePhish')}
            </Text>
          </TouchableOpacity>

          {/* hva som er TRYGT */}
          <TouchableOpacity
            disabled={answered}
            onPress={() => answer(false)}
            style={{
              backgroundColor: colors.success + '22',
              padding: spacing.md,
              borderRadius: radius.md,
              marginBottom: spacing.lg,
              opacity: answered ? 0.6 : 1,
            }}
          >
            <Text style={{ color: colors.success, fontWeight: '600' }}>
              ✅ {t('quiz.choiceSafe')}
            </Text>
          </TouchableOpacity>

          {/* FEEDBACK/TILBAKEMELD */}
          {answered && (
            <View
              style={{
                backgroundColor: colors.card,
                padding: spacing.md,
                borderRadius: radius.md,
              }}
            >
              <Text
                style={{
                  color: isCorrect ? colors.success : colors.danger,
                  fontWeight: '700',
                  marginBottom: spacing.sm,
                }}
              >
                {isCorrect ? t('quiz.correct') : t('quiz.wrong')}
              </Text>

              {q.why && (
                <Text style={{ color: colors.textMuted }}>
                  {q.why}
                </Text>
              )}

              <TouchableOpacity onPress={next} style={{ marginTop: spacing.md }}>
                <Text style={{ color: colors.tint }}>
                  {t('quiz.next')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}