import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '../components/Avatar';
import { RatingStars } from '../components/RatingStars';
import { EmptyState } from '../components/EmptyState';
import { PhotoViewerModal } from '../components/PhotoViewerModal';
import { SectionTitle } from '../components/SectionTitle';
import { Icon, IconName } from '../components/Icon';
import { colors, radius, spacing, typography } from '../theme';
import { useProviderById } from '../hooks/useProviders';
import { useProviderSubtitle } from '../hooks/useCategories';
import { ProviderDetailParamList } from '../navigation/types';
import { Provider, Review } from '../types';
import { formatDateLong } from '../utils/date';
import { resolveImage } from '../utils/images';

type Props = NativeStackScreenProps<ProviderDetailParamList, 'ReviewDetail'>;

export function ReviewDetailScreen({ route }: Props) {
  const provider = useProviderById(route.params.providerId);
  const review = provider?.reviews.find((item) => item.id === route.params.reviewId);

  if (!provider || !review) {
    return <EmptyState icon="alert-circle-outline" title="Avaliação não encontrada" />;
  }

  return <ReviewDetail provider={provider} review={review} />;
}

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function ReviewDetail({ provider, review }: { provider: Provider; review: Review }) {
  const subtitle = useProviderSubtitle(provider);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.authorCard}>
        <Avatar name={review.authorName} size={56} />
        <View style={styles.authorTexts}>
          <Text style={styles.author}>{review.authorName}</Text>
          <RatingStars rating={review.rating} size={20} />
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow icon="person-outline" label="Prestador avaliado" value={`${provider.name}\n${subtitle}`} />
        <InfoRow icon="construct-outline" label="Serviço prestado" value={review.service} />
        <InfoRow icon="calendar-outline" label="Data do serviço" value={formatDateLong(review.date)} />
      </View>

      <SectionTitle title="Comentário" />
      <Text style={styles.comment}>{review.comment}</Text>

      <SectionTitle title={`Fotos (${review.photos.length})`} />
      {review.photos.length === 0 ? (
        <Text style={styles.muted}>O cliente não anexou fotos nesta avaliação.</Text>
      ) : (
        <View style={styles.grid}>
          {review.photos.map((photo, index) => (
            <Pressable
              key={`${photo}-${index}`}
              style={styles.gridItem}
              onPress={() => setViewerIndex(index)}
              accessibilityRole="imagebutton"
              accessibilityLabel={`Abrir foto ${index + 1}`}
            >
              <Image source={resolveImage(photo)} style={styles.gridImage} />
            </Pressable>
          ))}
        </View>
      )}

      <PhotoViewerModal photos={review.photos} index={viewerIndex} onClose={() => setViewerIndex(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  authorTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  author: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTexts: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  comment: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 22,
  },
  muted: {
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
});
