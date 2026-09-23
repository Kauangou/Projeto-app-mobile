import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { ProviderProfileForm } from '../components/ProviderProfileForm';
import { PhotoGallery } from '../components/PhotoGallery';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { colors, spacing, typography } from '../theme';
import { useMyProvider } from '../hooks/useProviders';
import { useProvidersContext } from '../contexts/ProvidersContext';
import { pickImageFromLibrary } from '../utils/imagePicker';

export function EditProviderProfileScreen() {
  const navigation = useNavigation();
  const provider = useMyProvider();
  const { updateProvider, addPortfolioPhoto, removePortfolioPhoto } = useProvidersContext();

  if (!provider) {
    return <EmptyState icon="alert-circle-outline" title="Vitrine não encontrada" />;
  }

  const handleAddPhoto = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) addPortfolioPhoto(provider.id, uri);
  };

  return (
    <ScreenContainer scroll edges={['left', 'right', 'bottom']}>
      <SectionTitle title={`Portfólio (${provider.portfolio.length})`} />
      <Text style={styles.hint}>
        Mostre fotos de trabalhos já realizados. As alterações nas fotos são salvas na hora.
      </Text>
      <View style={styles.portfolio}>
        <PhotoGallery
          photos={provider.portfolio}
          size={96}
          onAdd={handleAddPhoto}
          onRemove={(photo) => removePortfolioPhoto(provider.id, photo)}
        />
      </View>

      <SectionTitle title="Informações da vitrine" />
      <ProviderProfileForm
        defaultValues={provider}
        submitLabel="Salvar alterações"
        onSubmit={(values) => {
          updateProvider(provider.id, values);
          navigation.goBack();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  portfolio: {
    marginBottom: spacing.sm,
  },
});
