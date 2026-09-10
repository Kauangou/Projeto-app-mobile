import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackNavigator } from './HomeStackNavigator';
import { SearchStackNavigator } from './SearchStackNavigator';
import { FavoritesStackNavigator } from './FavoritesStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { colors } from '../theme';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  HomeTab: '🏠',
  SearchTab: '🔍',
  FavoritesTab: '♥',
  ProfileTab: '👤',
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  HomeTab: 'Início',
  SearchTab: 'Busca',
  FavoritesTab: 'Favoritos',
  ProfileTab: 'Perfil',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabel: TAB_LABELS[route.name as keyof MainTabParamList],
        tabBarIcon: ({ color, size }) => (
          <Text style={{ color, fontSize: size }}>
            {TAB_ICONS[route.name as keyof MainTabParamList]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="SearchTab" component={SearchStackNavigator} />
      <Tab.Screen name="FavoritesTab" component={FavoritesStackNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
