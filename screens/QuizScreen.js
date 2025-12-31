// screens/QuizScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const all = category === 'blandet'
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.tint }}>{t('quiz.backHome')}</Text>
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
    <View style={{ flex: 1, padding: spacing.lg, gap: spacing.md }}>
      <Text style={{ fontWeight: '700' }}>{q.prompt}</Text>

      <TouchableOpacity onPress={() => answer(true)}>
        <Text style={{ color: colors.warning }}>{t('quiz.choicePhish')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => answer(false)}>
        <Text style={{ color: colors.success }}>{t('quiz.choiceSafe')}</Text>
      </TouchableOpacity>

      {answered && (
        <TouchableOpacity onPress={() => {
          setAnswered(false);
          setI(i + 1);
        }}>
          <Text style={{ color: colors.tint }}>{t('quiz.next')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
