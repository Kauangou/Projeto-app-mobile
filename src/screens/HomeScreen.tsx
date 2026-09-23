import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScreenContainer } from '../components/ScreenContainer';
import { CategoryTile } from '../components/CategoryTile';
import { FeaturedProviderCard } from '../components/FeaturedProviderCard';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { Icon } from '../components/Icon';
import { colors, radius, spacing, typography } from '../theme';
import { useCategories } from '../hooks/useCategories';
import { useProviders } from '../hooks/useProviders';
import { useAuth } from '../contexts/AuthContext';
import { ClientTabParamList, HomeStackParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<ClientTabParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const categories = useCategories();
  const providers = useProviders();
  const { user } = useAuth();

  const suggestedProviders = useMemo(
    () => [...providers].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [providers],
  );

  const firstName = user?.name.split(' ')[0];

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá{firstName ? `, ${firstName}` : ''} 👋</Text>
        <Text style={styles.headline}>Qual serviço você precisa hoje?</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.searchShortcut, pressed && styles.pressed]}
        onPress={() => navigation.navigate('SearchTab', { screen: 'Search' })}
        accessibilityRole="search"
        accessibilityLabel="Buscar prestadores"
      >
        <Icon name="search" size={20} color={colors.textMuted} />
        <Text style={styles.searchShortcutText}>Buscar por nome, serviço ou cidade</Text>
      </Pressable>

      <SectionTitle title="Categorias" />
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

      <SectionTitle title="Prestadores em destaque" />
      {suggestedProviders.length === 0 ? (
        <EmptyState
          icon="star-outline"
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
  searchShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  searchShortcutText: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
  },
  pressed: {
    opacity: 0.85,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featuredContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
    paddingBottom: spacing.xs,
  },
});
