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
  const { colors, spacing, radius, font } = useThemeColors();
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

  const q = questions[i];

  if (!q) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.tint, fontSize: 18 }}>
            {t('quiz.backHome')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function answer(v) {
    if (answered) return;
    if (v === q.isPhish) setScore(s => s + 1);
    setAnswered(true);
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

      {/* Valg */}
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

      {/* Neste */}
      {answered && (
        <TouchableOpacity
          onPress={() => {
            setAnswered(false);
            setI(i + 1);
          }}
        >
          <Text style={{ color: colors.tint, fontSize: 16 }}>
            {t('quiz.next')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
