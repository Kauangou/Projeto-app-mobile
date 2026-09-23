import { useMemo } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { ProviderCard } from '../components/ProviderCard';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, typography } from '../theme';
import { useProviders } from '../hooks/useProviders';
import { useFavorites } from '../contexts/FavoritesContext';
import { FavoritesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const providers = useProviders();
  const { favoriteIds } = useFavorites();

  const favoriteProviders = useMemo(
    () => providers.filter((provider) => favoriteIds.includes(provider.id)),
    [providers, favoriteIds],
  );

  return (
    <ScreenContainer>
      <Text style={styles.title} accessibilityRole="header">
        Favoritos
      </Text>

      <FlatList
        data={favoriteProviders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Nenhum favorito ainda"
            description="Toque no coração de um prestador para salvá-lo aqui."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
});
