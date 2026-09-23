import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  message: string | null;
}

/**
 * Feedback não-bloqueante para ações frequentes (salvar, avaliar), sobreposto no topo da tela
 * para não competir com a tab bar nem com o teclado aberto em formulários.
 * Puramente visual: quem usa leitor de tela recebe o mesmo texto via `announceForAccessibility`
 * (ver `ToastContext`), então o toast não precisa nem deve roubar o foco de acessibilidade.
 */
export function Toast({ message }: Props) {
  const insets = useSafeAreaInsets();

  if (!message) return null;

  return (
    <View
      style={[styles.wrapper, { top: insets.top + spacing.sm }]}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Icon name="checkmark-circle" size={18} color={colors.onPrimary} />
      <Text style={styles.text} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.text,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});
