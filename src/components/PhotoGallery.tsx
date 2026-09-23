import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { ImageRef } from '../types';
import { resolveImage } from '../utils/images';
import { Icon } from './Icon';
import { PhotoViewerModal } from './PhotoViewerModal';

interface Props {
  photos: ImageRef[];
  size?: number;
  /** Quando informado, exibe um botão de remover sobre cada foto (modo edição). */
  onRemove?: (photo: ImageRef) => void;
  /** Quando informado, exibe um bloco "Adicionar foto" no fim da galeria (modo edição). */
  onAdd?: () => void;
  addLabel?: string;
}

/** Galeria horizontal de fotos; tocar numa foto abre o visualizador em tela cheia. */
export function PhotoGallery({ photos, size = 120, onRemove, onAdd, addLabel = 'Adicionar' }: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {photos.map((photo, index) => (
          <View key={`${photo}-${index}`}>
            <Pressable
              onPress={() => setViewerIndex(index)}
              accessibilityRole="imagebutton"
              accessibilityLabel={`Abrir foto ${index + 1}`}
            >
              <Image
                source={resolveImage(photo)}
                style={[styles.photo, { width: size, height: size }]}
              />
            </Pressable>
            {onRemove && (
              <Pressable
                onPress={() => onRemove(photo)}
                hitSlop={8}
                style={styles.removeButton}
                accessibilityRole="button"
                accessibilityLabel={`Remover foto ${index + 1}`}
              >
                <Icon name="close" size={16} color={colors.onPrimary} />
              </Pressable>
            )}
          </View>
        ))}
        {onAdd && (
          <Pressable
            onPress={onAdd}
            style={[styles.addTile, { width: size, height: size }]}
            accessibilityRole="button"
            accessibilityLabel={addLabel}
          >
            <Icon name="camera-outline" size={28} color={colors.primary} />
            <Text style={styles.addLabel}>{addLabel}</Text>
          </Pressable>
        )}
      </ScrollView>

      <PhotoViewerModal photos={photos} index={viewerIndex} onClose={() => setViewerIndex(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  photo: {
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
});
