import { ScrollView, StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import { CategoryChip } from './CategoryChip';

export interface ChipOption<T> {
  value: T;
  label: string;
  icon?: string;
}

interface Props<T> {
  options: ChipOption<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  /** Tocar no chip já selecionado desmarca a opção. */
  allowDeselect?: boolean;
  /** `scroll` = uma linha rolável; `wrap` = quebra em várias linhas. */
  layout?: 'scroll' | 'wrap';
}

export function ChipGroup<T>({
  options,
  value,
  onChange,
  allowDeselect = false,
  layout = 'scroll',
}: Props<T>) {
  const chips = options.map((option) => {
    const selected = option.value === value;
    return (
      <CategoryChip
        key={String(option.value)}
        label={option.label}
        icon={option.icon}
        selected={selected}
        onPress={() => onChange(selected && allowDeselect ? undefined : option.value)}
      />
    );
  });

  if (layout === 'wrap') {
    return <View style={styles.wrap}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {chips}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
