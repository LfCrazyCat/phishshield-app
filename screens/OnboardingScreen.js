// screens/OnboardingScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const { colors, spacing, radius, font } = useThemeColors();
  const { t } = useI18n();
  const [index, setIndex] = useState(0);

  const slides = t('onboarding.slides') ?? [];

  async function done() {
    await AsyncStorage.setItem('phishshield_onboarded', '1');
    navigation.replace('Root');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              padding: spacing.lg,
              justifyContent: 'center',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: font.h1,
                fontWeight: '800',
                color: colors.tint,
                textAlign: 'center',
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: font.body,
                color: colors.text,
                textAlign: 'center',
              }}
            >
              {item.body}
            </Text>
          </View>
        )}
      />

      {/* indikator-prikker */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
          marginBottom: spacing.md,
        }}
      >
        {slides.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === index ? colors.tint : colors.border,
            }}
          />
        ))}
      </View>

      {/* knapp */}
      <View style={{ padding: spacing.lg }}>
        <TouchableOpacity
          onPress={index === slides.length - 1 ? done : () => setIndex(index + 1)}
          style={{
            backgroundColor: colors.tint,
            padding: spacing.md,
            borderRadius: radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            {index === slides.length - 1
              ? t('onboarding.start')
              : t('onboarding.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
