import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { ProviderProfileForm } from '../components/ProviderProfileForm';
import { PhotoGallery } from '../components/PhotoGallery';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useProvidersContext } from '../contexts/ProvidersContext';
import { pickImageFromLibrary } from '../utils/imagePicker';
import { ImageRef } from '../types';

/** Segundo passo do cadastro do prestador: exibido no primeiro login, até a vitrine ser criada. */
export function ProviderSetupScreen() {
  const { user, updateUser, signOut } = useAuth();
  const { createProvider, addPortfolioPhoto } = useProvidersContext();
  const [photos, setPhotos] = useState<ImageRef[]>([]);

  if (!user) return null;

  const handleAddPhoto = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setPhotos((current) => [...current, uri]);
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.step}>Passo 2 de 2</Text>
        <Text style={styles.title} accessibilityRole="header">
          Monte sua vitrine
        </Text>
        <Text style={styles.subtitle}>
          Olá, {user.name.split(' ')[0]}! Essas informações aparecem para os clientes que buscam
          pelo seu serviço. Você pode alterá-las depois.
        </Text>
      </View>

      <ProviderProfileForm
        defaultValues={{ name: user.name }}
        submitLabel="Publicar minha vitrine"
        onSubmit={(values) => {
          const providerId = createProvider(user.email, values);
          photos.forEach((photo) => addPortfolioPhoto(providerId, photo));
          updateUser({ providerId });
        }}
      >
        <Text style={styles.label}>Fotos de trabalhos (opcional)</Text>
        <View style={styles.portfolio}>
          <PhotoGallery
            photos={photos}
            size={96}
            onAdd={handleAddPhoto}
            onRemove={(photo) => setPhotos((current) => current.filter((item) => item !== photo))}
          />
        </View>
      </ProviderProfileForm>

      <Pressable
        style={styles.signOut}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Sair e continuar depois"
        onPress={signOut}
      >
        <Text style={styles.signOutText}>Sair e continuar depois</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  step: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: typography.caption.fontSize,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 21,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  portfolio: {
    marginBottom: spacing.sm,
  },
  signOut: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  signOutText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
});
