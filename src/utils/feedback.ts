import { Alert, Platform } from 'react-native';

/** `Alert.alert` não exibe nada no navegador; no web usamos o `window.alert`. */
export function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}
