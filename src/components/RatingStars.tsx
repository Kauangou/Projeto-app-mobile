import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

interface Props {
  rating: number;
  reviewsCount?: number;
  size?: number;
}

export function RatingStars({ rating, reviewsCount, size = 14 }: Props) {
  const stars = [1, 2, 3, 4, 5].map((position) => {
    if (rating >= position) return '★';
    if (rating >= position - 0.5) return '☆';
    return '☆';
  });

  return (
    <View style={styles.row}>
      <Text style={[styles.stars, { fontSize: size }]}>{stars.join('')}</Text>
      <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      {typeof reviewsCount === 'number' && (
        <Text style={styles.reviewsCount}>({reviewsCount})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stars: {
    color: colors.star,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  reviewsCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
