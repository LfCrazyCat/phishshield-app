import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

export default function QuizResultScreen({ route, navigation }) {
  const { colors, spacing, radius } = useThemeColors();
  const { t } = useI18n();

  const { score = 0, total = 0 } = route.params || {};
  const pct = total ? Math.round((score / total) * 100) : 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: spacing.sm }}>
        {t('quiz.resultTitle')}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: spacing.lg }}>
        {score} / {total} ({pct}%)
      </Text>

      {/* SPILL IGJEN */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Main', { screen: 'Quiz' })
        }
        style={{
          backgroundColor: colors.tint,
          padding: spacing.md,
          borderRadius: radius.md,
          marginBottom: spacing.md,
          minWidth: 200,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
          {t('quiz.replay')}
        </Text>
      </TouchableOpacity>

      {/* TIL HJEM */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Main', { screen: 'Home' })
        }
      >
        <Text style={{ color: colors.textMuted }}>
          {t('quiz.backHome')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
