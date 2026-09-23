import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Provider } from '../types';
import { useProviderSubtitle } from '../hooks/useCategories';
import { RatingStars } from './RatingStars';
import { Avatar } from './Avatar';
import { FavoriteButton } from './FavoriteButton';

interface Props {
  provider: Provider;
  onPress: () => void;
}

export function FeaturedProviderCard({ provider, onPress }: Props) {
  const subtitle = useProviderSubtitle(provider);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      // Sem accessibilityRole="button": o card contém o botão de favoritar, e no web isso
      // geraria um <button> dentro de outro.
      accessibilityLabel={`${provider.name}, ${subtitle}`}
    >
      <View style={styles.header}>
        <Avatar name={provider.name} size={48} />
        <FavoriteButton providerId={provider.id} size={22} />
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {provider.name}
      </Text>
      <Text style={styles.category} numberOfLines={1}>
        {subtitle}
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
