// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { View, TouchableOpacity, Text, Platform, useColorScheme } from 'react-native';
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

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

/* Root tabs  */

function RootTabs() {
  const { t } = useI18n();

  return (
    <Tabs.Navigator
      screenOptions={({ route, navigation }) => {
        let iconName = 'home-outline';
        let headerIcon = 'shield-checkmark-outline';
        let headerColor = '#003399';
        let activeColor = '#003399';
        let title = t('tabs.home');

        if (route.name === 'Checklist') {
          iconName = 'checkmark-done-outline';
          headerIcon = 'list-outline';
          headerColor = '#009933';
          activeColor = '#009933';
          title = t('tabs.checklist');
        }

        if (route.name === 'Quiz') {
          iconName = 'help-circle-outline';
          headerIcon = 'help-buoy-outline';
          headerColor = '#FF6600';
          activeColor = '#FF6600';
          title = t('tabs.quiz');
        }

        if (route.name === 'Learn') {
          iconName = 'book-outline';
          headerIcon = 'book-outline';
          headerColor = '#6A00FF';
          activeColor = '#6A00FF';
          title = t('tabs.learn');
        }

        return {
          headerStyle: { backgroundColor: headerColor },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: '700' },
          headerTitle: title,

          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Ionicons name={headerIcon} size={24} color="#fff" />
            </View>
          ),

          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <LanguageSwitch compact />
            </View>
          ),

          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: '#7a7a7a',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarLabel: title,
          tabBarStyle: Platform.select({
            android: { paddingBottom: 4, height: 58 },
            default: {},
          }),
        };
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Checklist" component={ChecklistScreen} />

      <Tabs.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
              accessibilityRole="button"
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 4 }}>
                {t('actions.back')}
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Tabs.Screen name="Learn" component={LearnScreen} />
    </Tabs.Navigator>
  );
}

/* Deep linking  */

const linking = {
  prefixes: ['phishshield://', 'https://phishshield.local'],
  config: {
    screens: {
      Root: {
        screens: {
          Home: 'home',
          Checklist: 'checklist',
          Quiz: 'quiz/:category',
          Learn: 'learn',
        },
      },
    },
  },
};

/* App root  */

function AppRoot() {
  const [ready, setReady] = React.useState(false);
  const [firstRun, setFirstRun] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const onboarded = await AsyncStorage.getItem('phishshield_onboarded');
      setFirstRun(!onboarded);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {firstRun && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
      <Stack.Screen name="Root" component={RootTabs} />
    </Stack.Navigator>
  );
}

/* App */

export default function App() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <I18nProvider defaultLang="no">
        <NavigationContainer
          linking={linking}
          theme={scheme === 'dark' ? navDark : navLight}
        >
          <AppRoot />
        </NavigationContainer>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
