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

export function FeaturedProviderCard({ provider, onPress }: Props) {
  const category = useCategoryById(provider.categoryId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(provider.id);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Avatar name={provider.name} size={48} />
        <Pressable
          hitSlop={10}
          onPress={() => toggleFavorite(provider.id)}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Text style={styles.favoriteIcon}>{favorite ? '♥' : '♡'}</Text>
        </Pressable>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {provider.name}
      </Text>
      <Text style={styles.category} numberOfLines={1}>
        {category ? `${category.icon} ${category.name}` : ''} · {provider.city}/{provider.state}
      </Text>

      <RatingStars rating={provider.rating} reviewsCount={provider.reviewsCount} />

      <Text style={styles.description} numberOfLines={2}>
        {provider.description}
      </Text>

      <Text style={styles.price}>{provider.priceReference}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 230,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteIcon: {
    fontSize: 22,
    color: colors.danger,
  },
  name: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  category: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  description: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  price: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: spacing.xs,
  },
});
