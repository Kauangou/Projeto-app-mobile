import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionTitle } from '../components/SectionTitle';
import { Icon, IconName } from '../components/Icon';
import { colors, spacing, typography } from '../theme';

const FEATURES: { icon: IconName; text: string }[] = [
  { icon: 'search-outline', text: 'Busca por localização, tipo de serviço e nome do prestador' },
  {
    icon: 'storefront-outline',
    text: 'Vitrine para o prestador divulgar seu trabalho e portfólio',
  },
  { icon: 'star-outline', text: 'Avaliações com data, serviço prestado e fotos' },
  { icon: 'heart-outline', text: 'Lista de favoritos para o cliente' },
];

export function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenContainer scroll edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Icon name="construct" size={56} color={colors.primary} />
        <Text style={styles.title}>App Serviços Gerais</Text>
        <Text style={styles.version}>Versão {version}</Text>
      </View>

      <Text style={styles.paragraph}>
        Uma vitrine virtual que aproxima profissionais autônomos de serviços gerais (pintores,
        pedreiros, encanadores, eletricistas, diaristas e outros) de clientes que precisam
        contratá-los com praticidade e confiança.
      </Text>

      <SectionTitle title="O que você pode fazer" />
      {FEATURES.map((feature) => (
        <View key={feature.text} style={styles.feature}>
          <Icon name={feature.icon} size={20} color={colors.primary} />
          <Text style={styles.featureText}>{feature.text}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  version: {
    color: colors.textMuted,
  },
  paragraph: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 22,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  featureText: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
});
