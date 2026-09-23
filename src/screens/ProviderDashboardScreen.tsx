import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatCard } from '../components/StatCard';
import { SettingRow } from '../components/SettingRow';
import { SectionTitle } from '../components/SectionTitle';
import { ReviewCard } from '../components/ReviewCard';
import { EmptyState } from '../components/EmptyState';
import { Icon } from '../components/Icon';
import { colors, radius, spacing, typography } from '../theme';
import { useMyProvider } from '../hooks/useProviders';
import { useProviderSubtitle } from '../hooks/useCategories';
import { DashboardStackParamList, ProviderTabParamList } from '../navigation/types';
import { Provider } from '../types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>,
  BottomTabScreenProps<ProviderTabParamList>
>;

const LATEST_REVIEWS = 3;

export function ProviderDashboardScreen(props: Props) {
  const provider = useMyProvider();
  if (!provider) {
    return <EmptyState icon="alert-circle-outline" title="Vitrine não encontrada" />;
  }
  return <Dashboard {...props} provider={provider} />;
}

function Dashboard({ navigation, provider }: Props & { provider: Provider }) {
  const subtitle = useProviderSubtitle(provider);
  const firstName = provider.name.split(' ')[0];

  // Dicas simples para o prestador deixar a vitrine mais completa.
  const tips = [
    provider.portfolio.length === 0 && 'Adicione fotos de trabalhos ao seu portfólio.',
    provider.description.length < 60 && 'Descreva melhor seus serviços e diferenciais.',
  ].filter(Boolean) as string[];

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
        <Text style={styles.headline}>Sua vitrine</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard value={provider.reviewsCount ? provider.rating.toFixed(1) : '–'} label="Nota média" />
        <StatCard value={provider.reviewsCount} label="Avaliações" />
        <StatCard value={provider.portfolio.length} label="Fotos" />
      </View>

      {tips.length > 0 && (
        <View style={styles.tipCard}>
          <Icon name="bulb-outline" size={20} color={colors.secondary} />
          <View style={styles.tipTexts}>
            <Text style={styles.tipTitle}>Deixe sua vitrine mais atrativa</Text>
            {tips.map((tip) => (
              <Text key={tip} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>
      )}

      <SectionTitle title="Atalhos" />
      <SettingRow
        icon="eye-outline"
        label="Ver minha vitrine"
        description="Como os clientes veem seu perfil"
        onPress={() => navigation.navigate('ProviderProfile', { providerId: provider.id, preview: true })}
      />
      <SettingRow
        icon="create-outline"
        label="Editar vitrine"
        description="Informações, contato e portfólio"
        onPress={() => navigation.navigate('EditProviderProfile')}
      />

      <SectionTitle
        title="Últimas avaliações"
        right={
          provider.reviews.length > LATEST_REVIEWS ? (
            <Pressable
              onPress={() => navigation.navigate('ReceivedReviewsTab', { screen: 'ReceivedReviews' })}
              hitSlop={8}
            >
              <Text style={styles.seeAll}>Ver todas</Text>
            </Pressable>
          ) : undefined
        }
      />
      {provider.reviews.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="Nenhuma avaliação ainda"
          description="As avaliações dos seus clientes aparecerão aqui."
        />
      ) : (
        provider.reviews
          .slice(0, LATEST_REVIEWS)
          .map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onPress={() =>
                navigation.navigate('ReviewDetail', { providerId: provider.id, reviewId: review.id })
              }
            />
          ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  headline: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  tipTexts: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  tipText: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize + 1,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '600',
  },
});
