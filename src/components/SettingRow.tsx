import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon, IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  description?: string;
  onPress?: () => void;
  /** Conteúdo à direita (ex.: um `Switch`). Sem ele, uma seta indica navegação. */
  right?: ReactNode;
}

export function SettingRow({ icon, label, description, onPress, right }: Props) {
  const content = (
    <>
      <View style={styles.iconBadge}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      {right ?? (onPress && <Icon name="chevron-forward" size={20} color={colors.textMuted} />)}
    </>
  );

  // Linhas sem ação (ex.: com um Switch) não usam Pressable: um Pressable desabilitado
  // desabilitaria também o controle interno no web.
  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
});
