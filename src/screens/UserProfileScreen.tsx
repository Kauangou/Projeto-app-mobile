import { StyleSheet, Switch, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

export function UserProfileScreen() {
  const { user, signOut } = useAuth();
  const { favoriteIds } = useFavorites();

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{user?.name.charAt(0).toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {user?.profileType === 'prestador' ? 'Prestador de serviço' : 'Cliente'}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{favoriteIds.length}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Avaliações feitas</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
      </View>

      <Button label="Sair da conta" variant="outline" onPress={signOut} style={styles.logout} />
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarInitial: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
  },
  name: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: '700',
    color: colors.text,
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
    color: '#fff',
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  settingLabel: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  logout: {
    marginBottom: spacing.xl,
  },
});
