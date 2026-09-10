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

  const favoriteProviders = providers.filter((provider) => favoriteIds.includes(provider.id));

  return (
    <ScreenContainer>
      <Text style={styles.title}>Favoritos</Text>

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
            icon="♡"
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
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
});
