import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Provider } from '../types';
import { useCategoryById } from '../hooks/useCategories';
import { RatingStars } from './RatingStars';
import { Avatar } from './Avatar';
import { useFavorites } from '../contexts/FavoritesContext';

interface Props {
  provider: Provider;
  onPress: () => void;
}

export function ProviderCard({ provider, onPress }: Props) {
  const category = useCategoryById(provider.categoryId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(provider.id);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Avatar name={provider.name} size={56} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {provider.name}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {category ? `${category.icon} ${category.name}` : ''} · {provider.city}/{provider.state}
        </Text>
        <RatingStars rating={provider.rating} reviewsCount={provider.reviewsCount} />
      </View>
      <Pressable
        hitSlop={10}
        onPress={() => toggleFavorite(provider.id)}
        style={styles.favoriteButton}
        accessibilityRole="button"
        accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Text style={styles.favoriteIcon}>{favorite ? '♥' : '♡'}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
    gap: 2,
  },
  name: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.text,
  },
  category: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  favoriteButton: {
    paddingHorizontal: spacing.xs,
  },
  favoriteIcon: {
    fontSize: 22,
    color: colors.danger,
  },
});
