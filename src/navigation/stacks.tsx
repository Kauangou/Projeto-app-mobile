import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { EditAccountScreen } from '../screens/EditAccountScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ProviderProfileScreen } from '../screens/ProviderProfileScreen';
import { ReviewDetailScreen } from '../screens/ReviewDetailScreen';
import { ReviewFormScreen } from '../screens/ReviewFormScreen';
import { EditProviderProfileScreen } from '../screens/EditProviderProfileScreen';
import { ProviderDashboardScreen } from '../screens/ProviderDashboardScreen';
import { ReceivedReviewsScreen } from '../screens/ReceivedReviewsScreen';
import { colors } from '../theme';
import { AppStackParamList } from './types';

// Um único navigator tipado com todas as telas internas: cada aba monta sua própria stack com
// ele, e as telas de detalhe de prestador são registradas uma vez só (`providerDetailScreens`).
const Stack = createNativeStackNavigator<AppStackParamList>();

const stackOptions: NativeStackNavigationOptions = {
  headerShown: false,
  headerTintColor: colors.primary,
  headerTitleStyle: { color: colors.text },
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: colors.background },
};

const detailHeader: NativeStackNavigationOptions = { headerShown: true };

const providerDetailScreens = (
  <>
    <Stack.Screen
      name="ProviderProfile"
      component={ProviderProfileScreen}
      options={{ ...detailHeader, title: 'Prestador' }}
    />
    <Stack.Screen
      name="ReviewDetail"
      component={ReviewDetailScreen}
      options={{ ...detailHeader, title: 'Avaliação' }}
    />
    <Stack.Screen
      name="ReviewForm"
      component={ReviewFormScreen}
      options={{ ...detailHeader, title: 'Avaliar prestador', presentation: 'modal' }}
    />
  </>
);

const editProviderScreen = (
  <Stack.Screen
    name="EditProviderProfile"
    component={EditProviderProfileScreen}
    options={{ ...detailHeader, title: 'Editar vitrine' }}
  />
);

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {providerDetailScreens}
    </Stack.Navigator>
  );
}

export function SearchStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Search" component={SearchScreen} />
      {providerDetailScreens}
    </Stack.Navigator>
  );
}

export function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      {providerDetailScreens}
    </Stack.Navigator>
  );
}

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{ ...detailHeader, title: 'Editar conta' }}
      />
      <Stack.Screen name="About" component={AboutScreen} options={{ ...detailHeader, title: 'Sobre o app' }} />
      {editProviderScreen}
      {providerDetailScreens}
    </Stack.Navigator>
  );
}

export function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Dashboard" component={ProviderDashboardScreen} />
      {editProviderScreen}
      {providerDetailScreens}
    </Stack.Navigator>
  );
}

export function ReceivedReviewsStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="ReceivedReviews" component={ReceivedReviewsScreen} />
      {providerDetailScreens}
    </Stack.Navigator>
  );
}
