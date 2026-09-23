import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { RatingStars } from '../components/RatingStars';
import { Avatar } from '../components/Avatar';
import { FavoriteButton } from '../components/FavoriteButton';
import { PhotoGallery } from '../components/PhotoGallery';
import { ReviewCard } from '../components/ReviewCard';
import { SectionTitle } from '../components/SectionTitle';
import { EmptyState } from '../components/EmptyState';
import { Icon } from '../components/Icon';
import { colors, radius, spacing, typography } from '../theme';
import { useProviderSubtitle } from '../hooks/useCategories';
import { useProviderById } from '../hooks/useProviders';
import { useAuth } from '../contexts/AuthContext';
import { ProviderDetailParamList } from '../navigation/types';
import { Provider } from '../types';
import { showMessage } from '../utils/feedback';
import { formatPhone } from '../utils/text';

type Props = NativeStackScreenProps<ProviderDetailParamList, 'ProviderProfile'>;

export function ProviderProfileScreen({ navigation, route }: Props) {
  const { providerId, preview = false } = route.params;
  const provider = useProviderById(providerId);
  const { user } = useAuth();
  const isClient = user?.profileType === 'cliente';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: preview ? 'Minha vitrine' : (provider?.name ?? 'Prestador'),
      headerRight:
        provider && isClient && !preview
          ? () => <FavoriteButton providerId={provider.id} />
          : undefined,
    });
  }, [navigation, provider, isClient, preview]);

  if (!provider) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          icon="alert-circle-outline"
          title="Prestador não encontrado"
          description="Ele pode ter sido removido."
        />
      </SafeAreaView>
    );
  }

  return (
    <ProviderProfileContent
      provider={provider}
      preview={preview}
      canReview={isClient && !preview}
      onReview={() => navigation.navigate('ReviewForm', { providerId: provider.id })}
      onOpenReview={(reviewId) =>
        navigation.navigate('ReviewDetail', { providerId: provider.id, reviewId })
      }
    />
  );
}

interface ContentProps {
  provider: Provider;
  preview: boolean;
  canReview: boolean;
  onReview: () => void;
  onOpenReview: (reviewId: string) => void;
}

function ProviderProfileContent({ provider, preview, canReview, onReview, onOpenReview }: ContentProps) {
  const subtitle = useProviderSubtitle(provider);
  const phone = formatPhone(provider.phone);

  // Nesta versão o contato é apenas ilustrativo: nenhum app externo é aberto.
  const handleWhatsApp = () =>
    showMessage(
      'Chamar no WhatsApp',
      `WhatsApp de ${provider.name}: ${phone}\n\nNesta versão do app o contato é apenas ilustrativo.`,
    );
  const handleCall = () =>
    showMessage(
      'Ligar para o prestador',
      `Telefone de ${provider.name}: ${phone}\n\nNesta versão do app a ligação é apenas ilustrativa.`,
    );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {preview && (
          <View style={styles.previewBanner}>
            <Icon name="eye-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.previewText}>É assim que os clientes veem o seu perfil.</Text>
          </View>
        )}

        <View style={styles.header}>
          <Avatar name={provider.name} size={96} />
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.category}>{subtitle}</Text>
          <RatingStars rating={provider.rating} reviewsCount={provider.reviewsCount} size={18} />
        </View>

        <SectionTitle title="Sobre" />
        <Text style={styles.description}>{provider.description}</Text>
        <View style={styles.priceTag}>
          <Icon name="pricetag-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.price}>{provider.priceReference}</Text>
        </View>

        <SectionTitle title={`Portfólio (${provider.portfolio.length})`} />
        {provider.portfolio.length > 0 ? (
          <PhotoGallery photos={provider.portfolio} />
        ) : (
          <Text style={styles.muted}>Nenhuma foto de trabalho publicada ainda.</Text>
        )}

        <SectionTitle title={`Avaliações (${provider.reviewsCount})`} />
        {canReview && (
          <Button
            label="Avaliar este prestador"
            variant="outline"
            icon="create-outline"
            onPress={onReview}
            style={styles.reviewButton}
          />
        )}
        {provider.reviews.length === 0 ? (
          <Text style={styles.muted}>Ainda não há avaliações.</Text>
        ) : (
          provider.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onPress={() => onOpenReview(review.id)} />
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="WhatsApp"
          icon="logo-whatsapp"
          variant="success"
          onPress={handleWhatsApp}
          disabled={preview}
          style={styles.footerButton}
        />
        <Button
          label="Ligar"
          icon="call-outline"
          variant="outline"
          onPress={handleCall}
          disabled={preview}
          style={styles.footerButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginTop: spacing.md,
  },
  previewText: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  category: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 22,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  price: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  muted: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
  },
  reviewButton: {
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerButton: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
});
