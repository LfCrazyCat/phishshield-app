// screens/PrivacyScreen.js
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

export default function PrivacyScreen() {
  const { colors, spacing, font } = useThemeColors();
  const { t } = useI18n();

  const Section = ({ title, text }) => (
    <View style={{ marginBottom: spacing.sm }}>
      <Text style={{ fontWeight: '700', color: colors.heading }}>
        {title}
      </Text>
      <Text style={{ fontSize: font.body, color: colors.text }}>
        {text}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <Text
        style={{
          fontSize: font.h1,
          fontWeight: '800',
          color: colors.tint,
          marginBottom: spacing.md,
        }}
      >
        {t('learn.privacyTitle')}
      </Text>

      <Section
        title={t('learn.privacy.noAccountTitle')}
        text={t('learn.privacy.noAccountText')}
      />

      <Section
        title={t('learn.privacy.localTitle')}
        text={t('learn.privacy.localText')}
      />

      <Section
        title={t('learn.privacy.noNetworkTitle')}
        text={t('learn.privacy.noNetworkText')}
      />

      <Section
        title={t('learn.privacy.noTrackingTitle')}
        text={t('learn.privacy.noTrackingText')}
      />

      <Section
        title={t('learn.privacy.permissionsTitle')}
        text={t('learn.privacy.permissionsText')}
      />

      <Section
        title={t('learn.privacy.howSafeTitle')}
        text={t('learn.privacy.howSafeText')}
      />

      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginVertical: spacing.md,
        }}
      />

      <Text style={{ fontWeight: '700', color: colors.heading, marginBottom: spacing.xs }}>
        {t('learn.privacy.improveTitle')}
      </Text>

      {(t('learn.privacy.improve') || []).map((line, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs }}>
          <Text style={{ color: colors.tint, fontSize: 18 }}>•</Text>
          <Text style={{ color: colors.text, fontSize: font.body, flex: 1 }}>
            {line}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
