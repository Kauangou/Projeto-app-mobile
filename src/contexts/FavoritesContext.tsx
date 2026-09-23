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

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (providerId: string) => boolean;
  toggleFavorite: (providerId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const email = user?.email;
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds([]);
    if (!email) return;
    let active = true;
    getJSON<string[]>(storageKeys.favorites(email), []).then((stored) => {
      if (active) setFavoriteIds(stored);
    });
    return () => {
      active = false;
    };
  }, [email]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback((providerId: string) => favoriteSet.has(providerId), [favoriteSet]);

  const toggleFavorite = useCallback(
    (providerId: string) => {
      setFavoriteIds((current) => {
        const next = current.includes(providerId)
          ? current.filter((id) => id !== providerId)
          : [...current, providerId];
        if (email) setJSON(storageKeys.favorites(email), next);
        return next;
      });
    },
    [email],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}
