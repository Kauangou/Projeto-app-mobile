import { StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { StatCard } from '../components/StatCard';
import { SettingRow } from '../components/SettingRow';
import { SectionTitle } from '../components/SectionTitle';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSettings } from '../contexts/SettingsContext';
import { useMyProvider, useMyReviewsCount } from '../hooks/useProviders';
import { ProfileStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'UserProfile'>;

export function UserProfileScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const { favoriteIds } = useFavorites();
  const { notificationsEnabled, setNotificationsEnabled } = useSettings();
  const myProvider = useMyProvider();
  const myReviewsCount = useMyReviewsCount();

  if (!user) return null;

  const isProvider = user.profileType === 'prestador';

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Avatar name={user.name} size={80} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{isProvider ? 'Prestador de serviço' : 'Cliente'}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {isProvider ? (
          <>
            <StatCard value={myProvider?.reviewsCount ? myProvider.rating.toFixed(1) : '–'} label="Nota média" />
            <StatCard value={myProvider?.reviewsCount ?? 0} label="Avaliações recebidas" />
          </>
        ) : (
          <>
            <StatCard value={favoriteIds.length} label="Favoritos" />
            <StatCard value={myReviewsCount} label="Avaliações feitas" />
          </>
        )}
      </View>

      {isProvider && myProvider && (
        <>
          <SectionTitle title="Minha vitrine" />
          <SettingRow
            icon="eye-outline"
            label="Ver minha vitrine"
            description="Prévia de como os clientes veem seu perfil"
            onPress={() =>
              navigation.navigate('ProviderProfile', { providerId: myProvider.id, preview: true })
            }
          />
          <SettingRow
            icon="create-outline"
            label="Editar vitrine"
            description="Serviço, descrição, região, preço, contato e fotos"
            onPress={() => navigation.navigate('EditProviderProfile')}
          />
        </>
      )}

      <SectionTitle title="Configurações" />
      <SettingRow
        icon="person-circle-outline"
        label="Editar nome"
        description={user.name}
        onPress={() => navigation.navigate('EditAccount')}
      />
      <SettingRow
        icon="notifications-outline"
        label="Notificações"
        description={notificationsEnabled ? 'Ativadas' : 'Desativadas'}
        right={
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ true: colors.primary, false: colors.border }}
            accessibilityLabel="Notificações"
          />
        }
      />
      <SettingRow
        icon="information-circle-outline"
        label="Sobre o app"
        onPress={() => navigation.navigate('About')}
      />

      <Button
        label="Sair da conta"
        variant="outline"
        icon="log-out-outline"
        onPress={signOut}
        style={styles.logout}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  email: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  badge: {
    marginTop: spacing.xs,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  logout: {
    marginTop: spacing.lg,
  },
});
