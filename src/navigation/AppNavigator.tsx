import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProviderSetupScreen } from '../screens/ProviderSetupScreen';
import { ClientTabNavigator, ProviderTabNavigator } from './TabNavigators';
import { useAuth } from '../contexts/AuthContext';
import { useProvidersContext } from '../contexts/ProvidersContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Tempo mínimo de exibição da Splash, para ela não "piscar" quando os dados carregam rápido. */
const SPLASH_MIN_DURATION_MS = 900;

export function AppNavigator() {
  const { user, hydrated: authHydrated } = useAuth();
  const { hydrated: providersHydrated } = useProvidersContext();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_MIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const booted = minTimeElapsed && authHydrated && providersHydrated;

  // A pilha exibida é derivada do estado da sessão: sem chamadas manuais de reset nas telas.
  const renderScreens = () => {
    if (!booted) {
      return <Stack.Screen name="Splash" component={SplashScreen} />;
    }
    if (!user) {
      return (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      );
    }
    if (user.profileType === 'prestador') {
      return user.providerId ? (
        <Stack.Screen name="ProviderTabs" component={ProviderTabNavigator} />
      ) : (
        <Stack.Screen name="ProviderSetup" component={ProviderSetupScreen} />
      );
    }
    return <Stack.Screen name="ClientTabs" component={ClientTabNavigator} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>{renderScreens()}</Stack.Navigator>
    </NavigationContainer>
  );
}
