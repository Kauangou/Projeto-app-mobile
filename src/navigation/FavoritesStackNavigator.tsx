import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProviderProfileScreen } from '../screens/ProviderProfileScreen';
import { FavoritesStackParamList } from './types';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export function FavoritesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen
        name="ProviderProfile"
        component={ProviderProfileScreen}
        options={{ headerShown: true, title: 'Perfil do prestador' }}
      />
    </Stack.Navigator>
  );
}
