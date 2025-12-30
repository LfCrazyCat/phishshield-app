// screens/ChecklistScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native'; //rulling
import { useThemeColors } from '../constants/theme'; //farger, space og fonter
import { useI18n } from '../i18n/i18n'; //henter tekst fra spraakfilene

export default function ChecklistScreen() {
  const { colors, spacing, font } = useThemeColors();
  const { t } = useI18n();
  const items = t('checklist.items'); //returnerer array mned punkter

//layout, tittel
  return (
    <ScrollView 
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, backgroundColor: colors.success + '20' }}
    >
      <Text style={{ fontSize: font.h1, fontWeight: '800', color: colors.success, marginBottom: spacing.sm, textAlign: 'center' }}> 
        {t('checklist.title')}
      </Text>
      

      {items.map((line, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <Text style={{ fontSize: 20, lineHeight: 24, color: colors.success, marginTop: -2 }}>•</Text>
          <Text style={{ fontSize: font.body, color: colors.text, flex: 1 }}>{line}</Text>
        </View>
      ))}

      <Text style={{ marginTop: spacing.md, color: colors.text, textAlign: 'center' }}>
        {t('checklist.tip')}
      </Text>
    </ScrollView>
  );
}
