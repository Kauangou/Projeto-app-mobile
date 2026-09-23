import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Icon, IconName } from './Icon';

interface Props {
  icon?: IconName;
  title: string;
  description?: string;
}

export function EmptyState({ icon = 'search-outline', title, description }: Props) {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={40} color={colors.textMuted} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
