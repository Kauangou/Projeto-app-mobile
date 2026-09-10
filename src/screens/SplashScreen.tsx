import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛠️</Text>
      <Text style={styles.title}>App Serviços Gerais</Text>
      <Text style={styles.subtitle}>Conecte-se a quem faz.</Text>
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
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: '#E0E7FF',
  },
});
