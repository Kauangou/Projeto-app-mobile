import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Icon, IconName } from './Icon';

interface Props {
  rating: number;
  reviewsCount?: number;
  size?: number;
  showValue?: boolean;
}

function starIcon(rating: number, position: number): IconName {
  if (rating >= position - 0.25) return 'star';
  if (rating >= position - 0.75) return 'star-half';
  return 'star-outline';
}

export function RatingStars({ rating, reviewsCount, size = 14, showValue = true }: Props) {
  if (reviewsCount === 0) {
    return (
      <View style={styles.row}>
        <Icon name="star-outline" size={size} color={colors.textMuted} />
        <Text style={styles.reviewsCount}>Sem avaliações</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`Nota ${rating.toFixed(1)} de 5${
        typeof reviewsCount === 'number' ? `, ${reviewsCount} avaliações` : ''
      }`}
    >
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((position) => (
          <Icon key={position} name={starIcon(rating, position)} size={size} color={colors.star} />
        ))}
      </View>
      {showValue && <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>}
      {typeof reviewsCount === 'number' && <Text style={styles.reviewsCount}>({reviewsCount})</Text>}
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
    flexDirection: 'row',
    gap: 1,
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
