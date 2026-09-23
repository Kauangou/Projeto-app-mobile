import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { SegmentedControl } from '../components/SegmentedControl';
import { colors, spacing, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { ProfileType } from '../types';
import { RootStackParamList } from '../navigation/types';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo'),
  email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type RegisterForm = z.infer<typeof registerSchema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const PROFILE_HINTS: Record<ProfileType, string> = {
  cliente: 'Encontre profissionais, salve favoritos e avalie serviços.',
  prestador: 'No primeiro acesso você vai montar sua vitrine com serviço, região e fotos.',
};

export function RegisterScreen({ navigation }: Props) {
  const [profileType, setProfileType] = useState<ProfileType>('cliente');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleRegister = registerForm.handleSubmit(async ({ name, email, password }) => {
    setSubmitting(true);
    const result = await register({ name, email, password, profileType });
    setSubmitting(false);
    if (!result.ok) {
      registerForm.setError('email', { message: result.error });
      return;
    }
    navigation.navigate('Login', { email: email.trim().toLowerCase(), justRegistered: true });
  });

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Leva menos de um minuto.</Text>
      </View>

      <View style={styles.profileTypeSection}>
        <Text style={styles.profileTypeLabel}>Eu sou:</Text>
        <SegmentedControl
          options={[
            { value: 'cliente', label: 'Cliente', icon: 'person-outline' },
            { value: 'prestador', label: 'Prestador', icon: 'hammer-outline' },
          ]}
          value={profileType}
          onChange={setProfileType}
        />
        <Text style={styles.profileTypeHint}>{PROFILE_HINTS[profileType]}</Text>
      </View>

      <Controller
        control={registerForm.control}
        name="name"
        render={({ field }) => (
          <TextField
            label="Nome completo"
            placeholder="Seu nome"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={registerForm.formState.errors.name?.message}
          />
        )}
      />
      <Controller
        control={registerForm.control}
        name="email"
        render={({ field }) => (
          <TextField
            ref={emailRef}
            label="E-mail"
            placeholder="voce@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={registerForm.formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={registerForm.control}
        name="password"
        render={({ field }) => (
          <TextField
            ref={passwordRef}
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={registerForm.formState.errors.password?.message}
          />
        )}
      />

      <Button
        label="Criar conta"
        onPress={handleRegister}
        loading={submitting}
        style={styles.submitButton}
      />

      <Pressable style={styles.backToLogin} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLoginText}>
          Já tem conta? <Text style={styles.backToLoginLink}>Entrar</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  profileTypeSection: {
    marginBottom: spacing.lg,
  },
  profileTypeLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  profileTypeHint: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  backToLoginText: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
  },
  backToLoginLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
