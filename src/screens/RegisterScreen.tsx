import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { colors, radius, spacing, typography } from "../theme";
import { useAuth } from "../contexts/AuthContext";
import { ProfileType } from "../types";
import { RootStackParamList } from "../navigation/types";

const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const [profileType, setProfileType] = useState<ProfileType>("cliente");
  const { signIn } = useAuth();

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleRegister = registerForm.handleSubmit(({ name, email }) => {
    signIn({ name, email, profileType });
  });

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Leva menos de um minuto.</Text>
      </View>

      <Controller
        control={registerForm.control}
        name="name"
        render={({ field }) => (
          <TextField
            label="Nome completo"
            placeholder="Seu nome"
            value={field.value}
            onChangeText={field.onChange}
            error={registerForm.formState.errors.name?.message}
          />
        )}
      />
      <Controller
        control={registerForm.control}
        name="email"
        render={({ field }) => (
          <TextField
            label="E-mail"
            placeholder="voce@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            error={registerForm.formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={registerForm.control}
        name="password"
        render={({ field }) => (
          <TextField
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={registerForm.formState.errors.password?.message}
          />
        )}
      />

      <View style={styles.profileTypeSection}>
        <Text style={styles.profileTypeLabel}>Eu sou:</Text>
        <View style={styles.profileTypeRow}>
          <Pressable
            style={[
              styles.profileTypeChip,
              profileType === "cliente" && styles.profileTypeChipActive,
            ]}
            onPress={() => setProfileType("cliente")}
          >
            <Text
              style={[
                styles.profileTypeChipLabel,
                profileType === "cliente" && styles.profileTypeChipLabelActive,
              ]}
            >
              Cliente
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.profileTypeChip,
              profileType === "prestador" && styles.profileTypeChipActive,
            ]}
            onPress={() => setProfileType("prestador")}
          >
            <Text
              style={[
                styles.profileTypeChipLabel,
                profileType === "prestador" &&
                  styles.profileTypeChipLabelActive,
              ]}
            >
              Prestador de serviço
            </Text>
          </Pressable>
        </View>
      </View>

      <Button
        label="Criar conta"
        onPress={handleRegister}
        style={styles.submitButton}
      />

      <Pressable
        style={styles.backToLogin}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.backToLoginText}>Já tem conta? Entrar</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: "700",
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
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  profileTypeRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  profileTypeChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  profileTypeChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  profileTypeChipLabel: {
    fontWeight: "600",
    color: colors.text,
  },
  profileTypeChipLabelActive: {
    color: "#fff",
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  backToLogin: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  backToLoginText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: typography.body.fontSize,
  },
});
