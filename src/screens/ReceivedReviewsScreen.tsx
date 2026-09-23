import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { ReviewCard } from '../components/ReviewCard';
import { RatingStars } from '../components/RatingStars';
import { EmptyState } from '../components/EmptyState';
import { colors, radius, spacing, typography } from '../theme';
import { useMyProvider } from '../hooks/useProviders';
import { ReceivedReviewsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ReceivedReviewsStackParamList, 'ReceivedReviews'>;

export function ReceivedReviewsScreen({ navigation }: Props) {
  const provider = useMyProvider();
  const reviews = provider?.reviews ?? [];

  // Quantidade de avaliações por nota (5 a 1), arredondando meias estrelas para baixo.
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => Math.floor(review.rating) === stars).length,
  }));

  const summary = provider && reviews.length > 0 && (
    <View style={styles.summary}>
      <View style={styles.average}>
        <Text style={styles.averageValue}>{provider.rating.toFixed(1)}</Text>
        <RatingStars rating={provider.rating} showValue={false} size={16} />
        <Text style={styles.averageCount}>
          {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
        </Text>
      </View>
      <View style={styles.bars}>
        {distribution.map(({ stars, count }) => (
          <View key={stars} style={styles.barRow}>
            <Text style={styles.barLabel}>{stars}★</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(count / reviews.length) * 100}%` }]} />
            </View>
            <Text style={styles.barCount}>{count}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title} accessibilityRole="header">
              Avaliações recebidas
            </Text>
            {summary}
          </View>
        }
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            onPress={() =>
              navigation.navigate('ReviewDetail', { providerId: provider!.id, reviewId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="Nenhuma avaliação ainda"
            description="Quando um cliente avaliar seu serviço, a avaliação aparecerá aqui."
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
  summary: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  average: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  averageValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  averageCount: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  bars: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  barLabel: {
    width: 24,
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.star,
  },
  barCount: {
    width: 20,
    textAlign: 'right',
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  list: {
    paddingBottom: spacing.xl,
  },
});
