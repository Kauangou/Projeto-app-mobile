import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (providerId: string) => boolean;
  toggleFavorite: (providerId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      isFavorite: (providerId) => favoriteIds.includes(providerId),
      toggleFavorite: (providerId) =>
        setFavoriteIds((current) =>
          current.includes(providerId)
            ? current.filter((id) => id !== providerId)
            : [...current, providerId],
        ),
    }),
    [favoriteIds],
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
