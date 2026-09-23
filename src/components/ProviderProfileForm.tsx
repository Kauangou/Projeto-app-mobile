import { ReactNode, useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { colors, spacing, typography } from '../theme';
import { ProviderProfileInput } from '../types';
import { useCategories } from '../hooks/useCategories';
import { formatPhone } from '../utils/text';
import { TextField } from './TextField';
import { ChipGroup } from './ChipGroup';
import { Button } from './Button';

const providerProfileSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome que aparecerá na vitrine'),
  categoryId: z.string({ error: 'Escolha o tipo de serviço' }).min(1, 'Escolha o tipo de serviço'),
  description: z
    .string()
    .trim()
    .min(20, 'Descreva seu trabalho em pelo menos 20 caracteres')
    .max(400, 'Máximo de 400 caracteres'),
  city: z.string().trim().min(2, 'Informe a cidade'),
  state: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, 'Use a sigla do estado (ex.: GO)'),
  priceReference: z.string().trim().min(3, 'Informe um valor de referência (ex.: A partir de R$ 50)'),
  phone: z
    .string()
    .refine((value) => [10, 11].includes(value.replace(/\D/g, '').length), 'Informe DDD + número'),
});

type ProviderProfileFormValues = z.infer<typeof providerProfileSchema>;

interface Props {
  defaultValues?: Partial<ProviderProfileInput>;
  submitLabel: string;
  onSubmit: (values: ProviderProfileInput) => void;
  /** Conteúdo extra exibido antes do botão (ex.: editor de portfólio). */
  children?: ReactNode;
}

export function ProviderProfileForm({ defaultValues, submitLabel, onSubmit, children }: Props) {
  const categories = useCategories();
  const descriptionRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const priceRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      categoryId: defaultValues?.categoryId ?? '',
      description: defaultValues?.description ?? '',
      city: defaultValues?.city ?? '',
      state: defaultValues?.state ?? '',
      priceReference: defaultValues?.priceReference ?? '',
      phone: defaultValues?.phone ? formatPhone(defaultValues.phone) : '',
    },
  });
  const { errors } = form.formState;

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      state: values.state.toUpperCase(),
      phone: `55${values.phone.replace(/\D/g, '')}`,
    });
  });

  return (
    <View>
      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <TextField
            label="Nome na vitrine"
            placeholder="Como os clientes vão te encontrar"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current?.focus()}
            error={errors.name?.message}
          />
        )}
      />

      <Text style={styles.label}>Tipo de serviço</Text>
      <Controller
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <ChipGroup
            layout="wrap"
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
              icon: category.icon,
            }))}
            value={field.value || undefined}
            onChange={(value) => field.onChange(value ?? '')}
          />
        )}
      />
      {!!errors.categoryId && <Text style={styles.error}>{errors.categoryId.message}</Text>}
      <View style={styles.spacer} />

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <TextField
            ref={descriptionRef}
            label="Sobre o seu trabalho"
            placeholder="Experiência, especialidades, diferenciais..."
            multiline
            numberOfLines={4}
            style={styles.multiline}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.description?.message}
          />
        )}
      />

      <View style={styles.row}>
        <View style={styles.cityField}>
          <Controller
            control={form.control}
            name="city"
            render={({ field }) => (
              <TextField
                ref={cityRef}
                label="Cidade"
                placeholder="Goiânia"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                returnKeyType="next"
                onSubmitEditing={() => stateRef.current?.focus()}
                error={errors.city?.message}
              />
            )}
          />
        </View>
        <View style={styles.stateField}>
          <Controller
            control={form.control}
            name="state"
            render={({ field }) => (
              <TextField
                ref={stateRef}
                label="UF"
                placeholder="GO"
                autoCapitalize="characters"
                maxLength={2}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                returnKeyType="next"
                onSubmitEditing={() => priceRef.current?.focus()}
                error={errors.state?.message}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={form.control}
        name="priceReference"
        render={({ field }) => (
          <TextField
            ref={priceRef}
            label="Valor de referência"
            placeholder="Ex.: A partir de R$ 80 / Sob orçamento"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            error={errors.priceReference?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="phone"
        render={({ field }) => (
          <TextField
            ref={phoneRef}
            label="WhatsApp / telefone"
            placeholder="(62) 99999-0000"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            value={field.value}
            onChangeText={(text) => field.onChange(formatPhone(text.replace(/\D/g, '').slice(0, 11)))}
            onBlur={field.onBlur}
            error={errors.phone?.message}
          />
        )}
      />

      {children}

      <Button label={submitLabel} onPress={handleSubmit} style={styles.submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
  },
  spacer: {
    height: spacing.md,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cityField: {
    flex: 1,
  },
  stateField: {
    width: 80,
  },
  submit: {
    marginTop: spacing.md,
  },
});
