import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon, IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'outline' | 'success' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const FILLED: Variant[] = ['primary', 'secondary', 'success'];

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
}: Props) {
  const filled = FILLED.includes(variant);
  const contentColor = filled ? colors.onPrimary : colors.primary;
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        inactive && styles.disabled,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <View style={styles.content}>
          {icon && <Icon name={icon} size={20} color={contentColor} />}
          <Text style={[styles.label, { color: contentColor }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.whatsapp,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});
