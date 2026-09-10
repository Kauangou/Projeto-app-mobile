import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { colors, spacing, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { ProfileType } from '../types';
import { RootStackParamList } from '../navigation/types';
import mockUsers from '../data/mockUsers.json';

const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = loginForm.handleSubmit(({ email, password }) => {
    const account = mockUsers.find(
      (mockUser) =>
        mockUser.email.toLowerCase() === email.toLowerCase() && mockUser.password === password
    );

    if (!account) {
      loginForm.setError('password', { message: 'E-mail ou senha inválidos' });
      return;
    }

    signIn({
      name: account.name,
      email: account.email,
      profileType: account.profileType as ProfileType,
    });
  });

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.logo}>🛠️</Text>
        <Text style={styles.title}>App Serviços Gerais</Text>
        <Text style={styles.subtitle}>Conecte-se a quem faz.</Text>
      </View>

      <Controller
        control={loginForm.control}
        name="email"
        render={({ field }) => (
          <TextField
            label="E-mail"
            placeholder="voce@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            error={loginForm.formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={loginForm.control}
        name="password"
        render={({ field }) => (
          <TextField
            label="Senha"
            placeholder="••••••"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={loginForm.formState.errors.password?.message}
          />
        )}
      />

      <Pressable style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </Pressable>

      <Button label="Entrar" onPress={handleLogin} style={styles.submitButton} />

      <Pressable style={styles.createAccount} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createAccountText}>Criar conta</Text>
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
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
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
    color: colors.primary,
    fontWeight: '600',
    fontSize: typography.body.fontSize,
  },
});
