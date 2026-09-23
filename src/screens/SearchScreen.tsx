import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { ChipGroup, ChipOption } from '../components/ChipGroup';
import { ProviderCard } from '../components/ProviderCard';
import { EmptyState } from '../components/EmptyState';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { colors, radius, spacing, typography } from '../theme';
import { useCategories } from '../hooks/useCategories';
import { useProviders } from '../hooks/useProviders';
import { SearchStackParamList } from '../navigation/types';
import {
  EMPTY_FILTERS,
  filterProviders,
  hasActiveFilters,
  SearchFilters,
  SearchSort,
  sortProviders,
} from '../utils/search';
import { normalizeText } from '../utils/text';

type Props = NativeStackScreenProps<SearchStackParamList, 'Search'>;

const RATING_OPTIONS: ChipOption<number>[] = [
  { value: 0, label: 'Qualquer' },
  { value: 3, label: '3+ ★' },
  { value: 4, label: '4+ ★' },
  { value: 4.5, label: '4,5+ ★' },
];

const SORT_OPTIONS: ChipOption<SearchSort>[] = [
  { value: 'rating', label: 'Melhor avaliados' },
  { value: 'reviews', label: 'Mais avaliações' },
  { value: 'name', label: 'A–Z' },
];

export function SearchScreen({ navigation, route }: Props) {
  const categories = useCategories();
  const providers = useProviders();

  // `draft` = o que está nos campos; `applied` = filtros da última busca (null = ainda não buscou).
  const [draft, setDraft] = useState<SearchFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<SearchFilters | null>(null);
  const [sort, setSort] = useState<SearchSort>('rating');
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const categoryIdParamRef = useRef(route.params?.categoryId);
  categoryIdParamRef.current = route.params?.categoryId;

  // Categoria escolhida no Início: preenche o filtro e já executa a busca.
  useFocusEffect(
    useCallback(() => {
      const categoryId = categoryIdParamRef.current;
      if (!categoryId) return;
      const filters = { ...EMPTY_FILTERS, categoryId };
      setDraft(filters);
      setApplied(filters);
      setFiltersExpanded(false);
      navigation.setParams({ categoryId: undefined });
    }, [navigation]),
  );

  const cityOptions = useMemo<ChipOption<string>[]>(() => {
    const cities = Array.from(new Set(providers.map((provider) => provider.city)));
    return cities.sort((a, b) => a.localeCompare(b, 'pt-BR')).map((city) => ({ value: city, label: city }));
  }, [providers]);

  const selectedCity = cityOptions.find(
    (option) => normalizeText(option.value) === normalizeText(draft.location),
  )?.value;

  const results = useMemo(
    () => (applied ? sortProviders(filterProviders(providers, applied, categories), sort) : null),
    [applied, providers, categories, sort],
  );

  const updateDraft = (changes: Partial<SearchFilters>) =>
    setDraft((current) => ({ ...current, ...changes }));

  const handleSearch = () => {
    Keyboard.dismiss();
    setApplied(draft);
    setFiltersExpanded(false);
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(null);
    setFiltersExpanded(true);
  };

  const showClear = hasActiveFilters(draft) || (applied !== null && hasActiveFilters(applied));

  const summary = applied
    ? [
        applied.name.trim() && `"${applied.name.trim()}"`,
        categories.find((category) => category.id === applied.categoryId)?.name,
        applied.location.trim(),
        applied.minRating > 0 && `${String(applied.minRating).replace('.', ',')}+ ★`,
      ]
        .filter(Boolean)
        .join(' · ') || 'Todos os prestadores'
    : '';

  const filtersPanel = (
    <View style={styles.panel}>
      <TextField
        label="Nome do prestador ou serviço"
        placeholder="Ex.: Carlos, pintura..."
        value={draft.name}
        onChangeText={(name) => updateDraft({ name })}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      <TextField
        label="Localização"
        placeholder="Cidade ou UF (ex.: Goiânia, GO)"
        value={draft.location}
        onChangeText={(location) => updateDraft({ location })}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <View style={styles.chipsBlock}>
        <ChipGroup
          options={cityOptions}
          value={selectedCity}
          allowDeselect
          onChange={(city) => updateDraft({ location: city ?? '' })}
        />
      </View>

      <Text style={styles.filterLabel}>Tipo de serviço</Text>
      <View style={styles.chipsBlock}>
        <ChipGroup
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
            icon: category.icon,
          }))}
          value={draft.categoryId}
          allowDeselect
          onChange={(categoryId) => updateDraft({ categoryId })}
        />
      </View>

      <Text style={styles.filterLabel}>Nota mínima</Text>
      <View style={styles.chipsBlock}>
        <ChipGroup
          options={RATING_OPTIONS}
          value={draft.minRating}
          onChange={(minRating) => updateDraft({ minRating: minRating ?? 0 })}
        />
      </View>

      <Button label="Buscar" icon="search" onPress={handleSearch} style={styles.searchButton} />
      {showClear && (
        <Button label="Limpar filtros" variant="ghost" icon="close-circle-outline" onPress={handleClear} />
      )}
    </View>
  );

  const collapsedFilters = (
    <Pressable
      style={styles.summary}
      onPress={() => setFiltersExpanded(true)}
      accessibilityRole="button"
      accessibilityLabel="Editar filtros"
    >
      <Icon name="options-outline" size={20} color={colors.primary} />
      <Text style={styles.summaryText} numberOfLines={2}>
        {summary}
      </Text>
      <Text style={styles.summaryAction}>Editar</Text>
    </Pressable>
  );

  const header = (
    <View>
      <Text style={styles.title} accessibilityRole="header">
        Buscar prestadores
      </Text>
      {filtersExpanded || !applied ? filtersPanel : collapsedFilters}

      {results && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </Text>
          {results.length > 1 && (
            <ChipGroup options={SORT_OPTIONS} value={sort} onChange={(value) => setSort(value ?? 'rating')} />
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={results ?? []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
          />
        )}
        ListEmptyComponent={
          results ? (
            <EmptyState
              icon="sad-outline"
              title="Nenhum prestador encontrado"
              description="Tente outra localização, tipo de serviço ou uma nota mínima menor."
            />
          ) : (
            <EmptyState
              icon="options-outline"
              title="Defina os filtros"
              description="Escolha o que precisa e toque em Buscar para ver os prestadores."
            />
          )
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  panel: {
    marginBottom: spacing.sm,
  },
  filterLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  chipsBlock: {
    marginBottom: spacing.md,
  },
  searchButton: {
    marginTop: spacing.xs,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    marginBottom: spacing.sm,
  },
  summaryText: {
    flex: 1,
    color: colors.text,
    fontWeight: '600',
  },
  summaryAction: {
    color: colors.primary,
    fontWeight: '700',
  },
  resultsHeader: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  resultsCount: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    paddingBottom: spacing.xl,
  },
});
