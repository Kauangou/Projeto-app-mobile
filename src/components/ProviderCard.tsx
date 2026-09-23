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

export function ProviderCard({ provider, onPress }: Props) {
  const subtitle = useProviderSubtitle(provider);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      // Sem accessibilityRole="button": o card contém o botão de favoritar, e no web isso
      // geraria um <button> dentro de outro.
      accessibilityLabel={`${provider.name}, ${subtitle}`}
    >
      <Avatar name={provider.name} size={56} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {provider.name}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {subtitle}
        </Text>
        <RatingStars rating={provider.rating} reviewsCount={provider.reviewsCount} />
        <Text style={styles.price} numberOfLines={1}>
          {provider.priceReference}
        </Text>
      </View>
      <FavoriteButton providerId={provider.id} />
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
  price: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
