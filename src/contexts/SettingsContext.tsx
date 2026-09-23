import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { getJSON, setJSON, storageKeys } from '../storage/storage';

interface Settings {
  notificationsEnabled: boolean;
}

interface SettingsContextValue extends Settings {
  setNotificationsEnabled: (enabled: boolean) => void;
}

const DEFAULT_SETTINGS: Settings = { notificationsEnabled: true };

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const email = user?.email;
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(DEFAULT_SETTINGS);
    if (!email) return;
    let active = true;
    getJSON<Settings>(storageKeys.settings(email), DEFAULT_SETTINGS).then((stored) => {
      if (active) setSettings({ ...DEFAULT_SETTINGS, ...stored });
    });
    return () => {
      active = false;
    };
  }, [email]);

  const setNotificationsEnabled = useCallback(
    (enabled: boolean) => {
      setSettings((current) => {
        const next = { ...current, notificationsEnabled: enabled };
        if (email) setJSON(storageKeys.settings(email), next);
        return next;
      });
    },
    [email],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({ ...settings, setNotificationsEnabled }),
    [settings, setNotificationsEnabled],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
}
