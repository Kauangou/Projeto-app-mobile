import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useFavorites } from '../contexts/FavoritesContext';
import { Icon } from './Icon';

interface Props {
  providerId: string;
  size?: number;
}

export function FavoriteButton({ providerId, size = 24 }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(providerId);

  return (
    <Pressable
      onPress={() => toggleFavorite(providerId)}
      hitSlop={10}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: favorite }}
    >
      <Icon name={favorite ? 'heart' : 'heart-outline'} size={size} color={colors.danger} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
