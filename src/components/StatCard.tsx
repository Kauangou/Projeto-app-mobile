import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  value: string | number;
  label: string;
}

export function StatCard({ value, label }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  value: {
    ...typography.title,
    color: colors.primary,
  },
  label: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
