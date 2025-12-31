// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { Platform, View, TouchableOpacity, Text, useColorScheme } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { navLight, navDark } from './constants/theme';
import { I18nProvider, useI18n } from './i18n/i18n';
import LanguageSwitch from './components/LanguageSwitch';

import HomeScreen from './screens/HomeScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import QuizScreen from './screens/QuizScreen';
import LearnScreen from './screens/LearnScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import QuizResultScreen from './screens/QuizResultScreen';


const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

/* ---------------- Tabs ---------------- */

function RootTabs() {
  const { t } = useI18n();

  return (
    <Tabs.Navigator
      screenOptions={({ route, navigation }) => {
        const map = {
          Home:        { icon: 'home-outline', color: '#003399', title: t('tabs.home') },
          Checklist:   { icon: 'checkmark-done-outline', color: '#009933', title: t('tabs.checklist') },
          Quiz:        { icon: 'help-circle-outline', color: '#FF6600', title: t('tabs.quiz') },
          Learn:       { icon: 'book-outline', color: '#6A00FF', title: t('tabs.learn') },
        };

        const cfg = map[route.name];

        return {
          headerStyle: { backgroundColor: cfg.color },
          headerTintColor: '#fff',
          headerTitle: cfg.title,
          headerTitleAlign: 'center',

          headerLeft: route.name !== 'Home'
            ? () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'center' }}
                >
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                  <Text style={{ color: '#fff', marginLeft: 4 }}>
                    {t('actions.back')}
                  </Text>
                </TouchableOpacity>
              )
            : undefined,

          headerRight: () => (
            <View style={{ marginRight: 12 }}>
              <LanguageSwitch compact />
            </View>
          ),

          tabBarIcon: ({ color, size }) => (
            <Ionicons name={cfg.icon} size={size} color={color} />
          ),
          tabBarActiveTintColor: cfg.color,
        };
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Checklist" component={ChecklistScreen} />
      <Tabs.Screen name="Quiz" component={QuizScreen} />
      <Tabs.Screen name="Learn" component={LearnScreen} />
    </Tabs.Navigator>
  );
}

/* ---------------- Root ---------------- */

function AppRoot() {
  const [ready, setReady] = React.useState(false);
  const [firstRun, setFirstRun] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem('phishshield_onboarded');
      setFirstRun(!done);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {firstRun && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
      <Stack.Screen name="Main" component={RootTabs} />
    </Stack.Navigator>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider defaultLang="no">
          <NavigationContainer theme={scheme === 'dark' ? navDark : navLight}>
            <AppRoot />
          </NavigationContainer>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
