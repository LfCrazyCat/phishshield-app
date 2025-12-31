// screens/ChecklistScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

export default function ChecklistScreen() {
  const { colors, spacing, font } = useThemeColors();
  const { t } = useI18n();
  const items = t('checklist.items') || [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
    >
      {/* Tittel */}
      <Text
        style={{
          fontSize: font.h1,
          fontWeight: '800',
          color: colors.heading,
          textAlign: 'center',
          marginBottom: spacing.sm,
        }}
      >
        {t('checklist.title')}
      </Text>

      {/* Punkter */}
      {items.map((line, i) => (
        <View
          key={i}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}
        >
          <Text style={{ fontSize: 18, lineHeight: 24, color: colors.tint }}>
            •
          </Text>
          <Text
            style={{
              fontSize: font.body,
              color: colors.text,
              flex: 1,
              lineHeight: 22,
            }}
          >
            {line}
          </Text>
        </View>
      ))}

      {/* Tips */}
      <Text
        style={{
          marginTop: spacing.md,
          color: colors.textMuted,
          textAlign: 'center',
        }}
      >
        {t('checklist.tip')}
      </Text>
    </ScrollView>
  );
}
