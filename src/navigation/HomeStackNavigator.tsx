import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProviderProfileScreen } from '../screens/ProviderProfileScreen';
import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="ProviderProfile"
        component={ProviderProfileScreen}
        options={{ headerShown: true, title: 'Perfil do prestador' }}
      />
    </Stack.Navigator>
  );
}
