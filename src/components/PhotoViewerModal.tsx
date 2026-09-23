import { FlatList, Image, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { colors, spacing, typography } from '../theme';
import { ImageRef } from '../types';
import { resolveImage } from '../utils/images';
import { Icon } from './Icon';

interface Props {
  photos: ImageRef[];
  /** Índice da foto aberta; `null` mantém o visualizador fechado. */
  index: number | null;
  onClose: () => void;
}

export function PhotoViewerModal({ photos, index, onClose }: Props) {
  const { width } = useWindowDimensions();
  const [current, setCurrent] = useState(0);

  return (
    <Modal
      visible={index !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => setCurrent(index ?? 0)}
    >
      <SafeAreaView style={styles.backdrop}>
        <View style={styles.header}>
          <Text style={styles.counter}>
            {current + 1} de {photos.length}
          </Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar">
            <Icon name="close" size={28} color={colors.onPrimary} />
          </Pressable>
        </View>
        {index !== null && (
          <FlatList
            data={photos}
            keyExtractor={(item, i) => `${item}-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={index}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            onMomentumScrollEnd={(event) =>
              setCurrent(Math.round(event.nativeEvent.contentOffset.x / width))
            }
            renderItem={({ item }) => (
              <View style={[styles.page, { width }]}>
                <Image source={resolveImage(item)} style={styles.image} resizeMode="contain" />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  counter: {
    color: colors.onPrimary,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
