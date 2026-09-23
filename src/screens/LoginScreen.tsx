import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { showMessage } from '../utils/feedback';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const justRegistered = route.params?.justRegistered;

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: route.params?.email ?? '', password: '' },
  });

  // Ao voltar do cadastro, preenche o e-mail da conta recém-criada.
  const registeredEmail = route.params?.email;
  const { reset } = loginForm;
  useEffect(() => {
    if (registeredEmail) {
      reset({ email: registeredEmail, password: '' });
      passwordRef.current?.focus();
    }
  }, [registeredEmail, reset]);

  const handleLogin = loginForm.handleSubmit(async ({ email, password }) => {
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (!result.ok) {
      loginForm.setError('password', { message: result.error });
    }
  });

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Icon name="construct" size={48} color={colors.primary} style={styles.logo} />
        <Text style={styles.title}>App Serviços Gerais</Text>
        <Text style={styles.subtitle}>Conecte-se a quem faz.</Text>
      </View>

      {justRegistered && (
        <View style={styles.banner} accessibilityRole="alert">
          <Icon name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.bannerText}>Conta criada! Entre para continuar.</Text>
        </View>
      )}

      <Controller
        control={loginForm.control}
        name="email"
        render={({ field }) => (
          <TextField
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
            error={loginForm.formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={loginForm.control}
        name="password"
        render={({ field }) => (
          <TextField
            ref={passwordRef}
            label="Senha"
            placeholder="••••••"
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleLogin}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={loginForm.formState.errors.password?.message}
          />
        )}
      />

      <Pressable
        style={styles.forgotPassword}
        onPress={() =>
          showMessage(
            'Recuperar senha',
            'A recuperação de senha por e-mail estará disponível quando o app for integrado ao servidor.',
          )
        }
      >
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </Pressable>

      <Button label="Entrar" onPress={handleLogin} loading={submitting} style={styles.submitButton} />

      <Pressable style={styles.createAccount} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createAccountText}>
          Não tem conta? <Text style={styles.createAccountLink}>Criar conta</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  logo: {
    marginBottom: spacing.xs,
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
  },
  bannerText: {
    flex: 1,
    color: colors.text,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: typography.caption.fontSize,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  createAccount: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  createAccountText: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
  },
  createAccountLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
