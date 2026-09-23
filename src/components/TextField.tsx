import { Ref, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon } from './Icon';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  ref?: Ref<TextInput>;
}

export function TextField({ label, error, style, secureTextEntry, ref, ...inputProps }: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, !!error && styles.inputError]}>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry && hidden}
          accessibilityLabel={label}
          {...inputProps}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden((current) => !current)}
            hitSlop={8}
            style={styles.toggle}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
          >
            <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  toggle: {
    paddingHorizontal: spacing.sm + 4,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
  },
});
