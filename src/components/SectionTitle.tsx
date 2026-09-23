import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  title: string;
  right?: ReactNode;
}

export function SectionTitle({ title, right }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
});
