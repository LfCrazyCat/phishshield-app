// screens/QuizResultScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

export default function QuizResultScreen({ route, navigation }) {
  const { colors, spacing } = useThemeColors();
  const { t } = useI18n();

  const { score = 0, total = 0 } = route.params || {};
  const percent = total ? Math.round((score / total) * 100) : 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>
        {t('quiz.resultTitle')}
      </Text>

      <Text
        style={{
          fontSize: 18,
          color: colors.text,
          marginVertical: spacing.md,
        }}
      >
        {score} / {total} ({percent}%)
      </Text>

      <Text
        style={{
          color: colors.textMuted,
          textAlign: 'center',
          marginBottom: spacing.lg,
        }}
      >
        {percent >= 80
          ? t('quiz.resultGood')
          : percent >= 50
          ? t('quiz.resultOk')
          : t('quiz.resultPoor')}
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Quiz')}>
        <Text style={{ color: colors.tint, fontSize: 16 }}>
          {t('quiz.restart')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
