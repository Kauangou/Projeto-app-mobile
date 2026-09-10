import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { CategoryChip } from '../components/CategoryChip';
import { ProviderCard } from '../components/ProviderCard';
import { EmptyState } from '../components/EmptyState';
import { TextField } from '../components/TextField';
import { colors, spacing, typography } from '../theme';
import { useCategories } from '../hooks/useCategories';
import { useProviders } from '../hooks/useProviders';
import { SearchStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<SearchStackParamList, 'Search'>;

export function SearchScreen({ navigation, route }: Props) {
  const categories = useCategories();
  const providers = useProviders();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    route.params?.categoryId
  );
  const [query, setQuery] = useState('');

  const categoryIdParamRef = useRef(route.params?.categoryId);
  categoryIdParamRef.current = route.params?.categoryId;

  useFocusEffect(
    useCallback(() => {
      const categoryId = categoryIdParamRef.current;
      setSelectedCategoryId(categoryId);
      if (categoryId) {
        navigation.setParams({ categoryId: undefined });
      }
    }, [navigation])
  );

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesCategory = selectedCategoryId
        ? provider.categoryId === selectedCategoryId
        : true;
      const matchesQuery = query.trim()
        ? provider.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          provider.city.toLowerCase().includes(query.trim().toLowerCase())
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [providers, selectedCategoryId, query]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Buscar prestadores</Text>

      <TextField
        label="Nome ou cidade"
        placeholder="Ex.: Carlos, Belo Horizonte..."
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => (
          <CategoryChip
            icon={item.icon}
            label={item.name}
            selected={selectedCategoryId === item.id}
            onPress={() =>
              setSelectedCategoryId((current) => (current === item.id ? undefined : item.id))
            }
          />
        )}
      />

      <Text style={styles.resultsCount}>
        {filteredProviders.length} {filteredProviders.length === 1 ? 'resultado' : 'resultados'}
      </Text>

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsList}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🔎"
            title="Nenhum prestador encontrado"
            description="Tente outro nome, cidade ou categoria."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoriesList: {
    flexGrow: 0,
    height: 44,
    marginBottom: spacing.xs,
  },
  categoriesContent: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  resultsList: {
    paddingBottom: spacing.xl,
  },
});
