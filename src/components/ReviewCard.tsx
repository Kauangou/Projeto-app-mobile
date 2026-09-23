import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Review } from '../types';
import { formatDateShort } from '../utils/date';
import { resolveImage } from '../utils/images';
import { RatingStars } from './RatingStars';
import { Icon } from './Icon';

interface Props {
  review: Review;
  onPress: () => void;
}

const MAX_THUMBS = 3;

export function ReviewCard({ review, onPress }: Props) {
  const extraPhotos = review.photos.length - MAX_THUMBS;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Avaliação de ${review.authorName}, nota ${review.rating}. Toque para ver detalhes`}
    >
      <View style={styles.header}>
        <Text style={styles.author} numberOfLines={1}>
          {review.authorName}
        </Text>
        <Text style={styles.date}>{formatDateShort(review.date)}</Text>
      </View>

      <RatingStars rating={review.rating} size={12} />

      <View style={styles.serviceRow}>
        <Icon name="construct-outline" size={14} color={colors.primaryDark} />
        <Text style={styles.service} numberOfLines={1}>
          {review.service}
        </Text>
      </View>

      <Text style={styles.comment} numberOfLines={2}>
        {review.comment}
      </Text>

      {review.photos.length > 0 && (
        <View style={styles.thumbs}>
          {review.photos.slice(0, MAX_THUMBS).map((photo, index) => (
            <Image key={`${photo}-${index}`} source={resolveImage(photo)} style={styles.thumb} />
          ))}
          {extraPhotos > 0 && (
            <View style={[styles.thumb, styles.moreThumb]}>
              <Text style={styles.moreText}>+{extraPhotos}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.more}>Ver detalhes</Text>
        <Icon name="chevron-forward" size={14} color={colors.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  author: {
    flex: 1,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  service: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  comment: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize + 1,
  },
  thumbs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  moreThumb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontWeight: '700',
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 2,
  },
  more: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
});
