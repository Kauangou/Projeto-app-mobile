import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScreenContainer } from '../components/ScreenContainer';
import { CategoryTile } from '../components/CategoryTile';
import { FeaturedProviderCard } from '../components/FeaturedProviderCard';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, typography } from '../theme';
import { useCategories } from '../hooks/useCategories';
import { useProviders } from '../hooks/useProviders';
import { useAuth } from '../contexts/AuthContext';
import { HomeStackParamList, MainTabParamList, RootStackParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export function HomeScreen({ navigation }: Props) {
  const categories = useCategories();
  const providers = useProviders();
  const { user } = useAuth();

  const suggestedProviders = [...providers].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá{user ? `, ${user.name}` : ''} 👋</Text>
        <Text style={styles.headline}>Qual serviço você precisa hoje?</Text>
      </View>

      <Text style={styles.sectionTitle}>Categorias</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((item) => (
          <CategoryTile
            key={item.id}
            icon={item.icon}
            label={item.name}
            onPress={() =>
              navigation.navigate('SearchTab', {
                screen: 'Search',
                params: { categoryId: item.id },
              })
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Prestadores em destaque</Text>
      {suggestedProviders.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="Nenhum prestador em destaque"
          description="Ainda não há prestadores cadastrados."
        />
      ) : (
        <FlatList
          data={suggestedProviders}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContent}
          renderItem={({ item }) => (
            <FeaturedProviderCard
              provider={item}
              onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  headline: {
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  featuredContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
    paddingBottom: spacing.xs,
  },
});
