import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@asg/';

export const storageKeys = {
  accounts: 'accounts',
  session: 'session',
  providers: 'providers',
  favorites: (email: string) => `favorites/${email.toLowerCase()}`,
  settings: (email: string) => `settings/${email.toLowerCase()}`,
};

export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function setJSON(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Falha de escrita não deve travar a interface; o estado em memória continua válido.
  }
}

export async function removeKey(key: string) {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch {
    // ignorado
  }
}
