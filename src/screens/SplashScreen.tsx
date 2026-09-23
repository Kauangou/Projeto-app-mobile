import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Icon } from '../components/Icon';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Icon name="construct" size={64} color={colors.onPrimary} style={styles.logo} />
      <Text style={styles.title}>App Serviços Gerais</Text>
      <Text style={styles.subtitle}>Conecte-se a quem faz.</Text>
      <ActivityIndicator color={colors.onPrimary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  logo: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.onPrimary,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.onPrimaryMuted,
  },
  loader: {
    marginTop: spacing.lg,
  },
});
