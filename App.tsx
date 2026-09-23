import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProvidersProvider } from './src/contexts/ProvidersContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { ToastProvider } from './src/contexts/ToastContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <ProvidersProvider>
            <FavoritesProvider>
              <SettingsProvider>
                <AppNavigator />
                <StatusBar style="dark" />
              </SettingsProvider>
            </FavoritesProvider>
          </ProvidersProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
