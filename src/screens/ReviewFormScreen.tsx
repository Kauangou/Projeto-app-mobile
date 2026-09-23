import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScreenContainer } from '../components/ScreenContainer';
import { StarRatingInput } from '../components/StarRatingInput';
import { TextField } from '../components/TextField';
import { PhotoGallery } from '../components/PhotoGallery';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, typography } from '../theme';
import { useProviderById } from '../hooks/useProviders';
import { useCategoryById } from '../hooks/useCategories';
import { useAuth } from '../contexts/AuthContext';
import { useProvidersContext } from '../contexts/ProvidersContext';
import { useToast } from '../contexts/ToastContext';
import { ProviderDetailParamList } from '../navigation/types';
import { ImageRef } from '../types';
import { isFutureIso, maskDate, parseDateShort, todayShort } from '../utils/date';
import { pickImageFromLibrary } from '../utils/imagePicker';

const MAX_PHOTOS = 3;

const RATING_LABELS = ['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

const reviewSchema = z.object({
  rating: z.number().min(1, 'Toque nas estrelas para dar uma nota'),
  service: z.string().trim().min(3, 'Informe qual serviço foi feito'),
  date: z
    .string()
    .refine((value) => parseDateShort(value) !== null, 'Data inválida (use DD/MM/AAAA)')
    .refine((value) => {
      const iso = parseDateShort(value);
      return !iso || !isFutureIso(iso);
    }, 'A data não pode estar no futuro'),
  comment: z
    .string()
    .trim()
    .min(10, 'Conte um pouco mais (mínimo 10 caracteres)')
    .max(500, 'Máximo de 500 caracteres'),
});

type ReviewForm = z.infer<typeof reviewSchema>;

type Props = NativeStackScreenProps<ProviderDetailParamList, 'ReviewForm'>;

export function ReviewFormScreen({ navigation, route }: Props) {
  const provider = useProviderById(route.params.providerId);
  const category = useCategoryById(provider?.categoryId);
  const { user } = useAuth();
  const { addReview } = useProvidersContext();
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<ImageRef[]>([]);

  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, service: '', date: todayShort(), comment: '' },
  });
  const { errors } = form.formState;

  if (!provider || !user) {
    return <EmptyState icon="alert-circle-outline" title="Prestador não encontrado" />;
  }

  const handleAddPhoto = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setPhotos((current) => [...current, uri].slice(0, MAX_PHOTOS));
  };

  const handleSubmit = form.handleSubmit((values) => {
    addReview(provider.id, {
      authorName: user.name,
      authorEmail: user.email,
      rating: values.rating,
      service: values.service.trim(),
      date: parseDateShort(values.date)!,
      comment: values.comment.trim(),
      photos,
    });
    navigation.goBack();
    showToast('Avaliação publicada');
  });

  return (
    <ScreenContainer scroll edges={['left', 'right', 'bottom']}>
      <Text style={styles.intro}>
        Como foi o serviço de <Text style={styles.providerName}>{provider.name}</Text>?
      </Text>

      <Controller
        control={form.control}
        name="rating"
        render={({ field }) => (
          <View style={styles.ratingBlock}>
            <StarRatingInput value={field.value} onChange={field.onChange} />
            <Text style={styles.ratingLabel}>{RATING_LABELS[field.value] || 'Sua nota'}</Text>
          </View>
        )}
      />
      {!!errors.rating && <Text style={styles.error}>{errors.rating.message}</Text>}

      <Controller
        control={form.control}
        name="service"
        render={({ field }) => (
          <TextField
            label="Serviço prestado"
            placeholder={
              category ? `Ex.: serviço de ${category.name.toLowerCase()}` : 'Ex.: pintura da sala'
            }
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.service?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="date"
        render={({ field }) => (
          <TextField
            label="Data do serviço"
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            maxLength={10}
            value={field.value}
            onChangeText={(text) => field.onChange(maskDate(text))}
            onBlur={field.onBlur}
            error={errors.date?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="comment"
        render={({ field }) => (
          <TextField
            label="Comentário"
            placeholder="Conte como foi: pontualidade, qualidade, limpeza..."
            multiline
            numberOfLines={4}
            style={styles.multiline}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.comment?.message}
          />
        )}
      />

      <Text style={styles.label}>
        Fotos do serviço ({photos.length}/{MAX_PHOTOS})
      </Text>
      <PhotoGallery
        photos={photos}
        size={88}
        onAdd={photos.length < MAX_PHOTOS ? handleAddPhoto : undefined}
        addLabel="Anexar"
        onRemove={(photo) => setPhotos((current) => current.filter((item) => item !== photo))}
      />

      <Button label="Publicar avaliação" icon="send" onPress={handleSubmit} style={styles.submit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  providerName: {
    fontWeight: '700',
  },
  ratingBlock: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  ratingLabel: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: spacing.lg,
  },
});
