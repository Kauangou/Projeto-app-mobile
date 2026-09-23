import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import {
  DashboardStack,
  FavoritesStack,
  HomeStack,
  ProfileStack,
  ReceivedReviewsStack,
  SearchStack,
} from './stacks';
import { colors } from '../theme';
import { ClientTabParamList, ProviderTabParamList } from './types';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Ícone preenchido na aba ativa e contornado nas demais. */
function tabOptions(label: string, icon: IconName, iconFocused: IconName): BottomTabNavigationOptions {
  return {
    tabBarLabel: label,
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons name={focused ? iconFocused : icon} size={size} color={color} />
    ),
  };
}

const sharedOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarLabelStyle: { fontWeight: '600' },
};

const ClientTab = createBottomTabNavigator<ClientTabParamList>();

export function ClientTabNavigator() {
  return (
    <ClientTab.Navigator screenOptions={sharedOptions}>
      <ClientTab.Screen name="HomeTab" component={HomeStack} options={tabOptions('Início', 'home-outline', 'home')} />
      <ClientTab.Screen
        name="SearchTab"
        component={SearchStack}
        options={tabOptions('Busca', 'search-outline', 'search')}
      />
      <ClientTab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={tabOptions('Favoritos', 'heart-outline', 'heart')}
      />
      <ClientTab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={tabOptions('Perfil', 'person-outline', 'person')}
      />
    </ClientTab.Navigator>
  );
}

const ProviderTab = createBottomTabNavigator<ProviderTabParamList>();

export function ProviderTabNavigator() {
  return (
    <ProviderTab.Navigator screenOptions={sharedOptions}>
      <ProviderTab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={tabOptions('Painel', 'storefront-outline', 'storefront')}
      />
      <ProviderTab.Screen
        name="ReceivedReviewsTab"
        component={ReceivedReviewsStack}
        options={tabOptions('Avaliações', 'chatbubbles-outline', 'chatbubbles')}
      />
      <ProviderTab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={tabOptions('Perfil', 'person-outline', 'person')}
      />
    </ProviderTab.Navigator>
  );
}
