import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { RatingStars } from '../components/RatingStars';
import { Avatar } from '../components/Avatar';
import { colors, radius, spacing, typography } from '../theme';
import { useCategoryById } from '../hooks/useCategories';
import { useProviderById } from '../hooks/useProviders';
import { useFavorites } from '../contexts/FavoritesContext';

type ProviderProfileRoute = RouteProp<
  { ProviderProfile: { providerId: string } },
  'ProviderProfile'
>;

export function ProviderProfileScreen() {
  const route = useRoute<ProviderProfileRoute>();
  const navigation = useNavigation();
  const provider = useProviderById(route.params.providerId);
  const category = useCategoryById(provider?.categoryId ?? '');
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!provider) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Prestador não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(provider.id);

  const handleContact = () => {
    const message = encodeURIComponent(
      `Olá, ${provider.name}! Vi seu perfil no App Serviços Gerais e gostaria de saber mais sobre seus serviços.`
    );
    Linking.openURL(`https://wa.me/${provider.phone}?text=${message}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar name={provider.name} size={96} />
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.category}>
            {category ? `${category.icon} ${category.name}` : ''} · {provider.city}/{provider.state}
          </Text>
          <RatingStars rating={provider.rating} reviewsCount={provider.reviewsCount} size={18} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.description}>{provider.description}</Text>
          <Text style={styles.price}>{provider.priceReference}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações ({provider.reviews.length})</Text>
          {provider.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.authorName}</Text>
                <RatingStars rating={review.rating} size={12} />
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            label={favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            variant="outline"
            onPress={() => toggleFavorite(provider.id)}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Chamar no WhatsApp" onPress={handleContact} style={styles.contactButton} />
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
  notFound: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textMuted,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    color: colors.text,
  },
  category: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 22,
  },
  price: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primaryDark,
    marginTop: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  reviewAuthor: {
    fontWeight: '600',
    color: colors.text,
  },
  reviewComment: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  contactButton: {
    backgroundColor: colors.success,
  },
});
