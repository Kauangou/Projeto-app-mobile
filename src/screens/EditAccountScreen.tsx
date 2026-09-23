import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ProfileStackParamList } from '../navigation/types';

const accountSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo'),
});

type AccountForm = z.infer<typeof accountSchema>;

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditAccount'>;

export function EditAccountScreen({ navigation }: Props) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const form = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const handleSave = form.handleSubmit(({ name }) => {
    updateUser({ name: name.trim() });
    navigation.goBack();
    showToast('Conta atualizada');
  });

  return (
    <ScreenContainer scroll edges={['left', 'right', 'bottom']}>
      <View style={styles.spacer} />
      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <TextField
            label="Nome completo"
            autoComplete="name"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={form.formState.errors.name?.message}
          />
        )}
      />

      <Text style={styles.label}>E-mail</Text>
      <View style={styles.readOnly}>
        <Text style={styles.readOnlyText}>{user?.email}</Text>
      </View>
      <Text style={styles.hint}>O e-mail é usado para entrar e não pode ser alterado.</Text>

      <Button label="Salvar" onPress={handleSave} style={styles.submit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  spacer: {
    height: spacing.lg,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  readOnly: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background,
  },
  readOnlyText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  hint: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  submit: {
    marginTop: spacing.lg,
  },
});
