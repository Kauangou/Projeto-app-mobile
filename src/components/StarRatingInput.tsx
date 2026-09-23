import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Icon } from './Icon';

interface Props {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export function StarRatingInput({ value, onChange, size = 36 }: Props) {
  return (
    <View style={styles.row} accessibilityRole="adjustable" accessibilityValue={{ min: 0, max: 5, now: value }}>
      {[1, 2, 3, 4, 5].map((position) => (
        <Pressable
          key={position}
          onPress={() => onChange(position)}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={`${position} ${position === 1 ? 'estrela' : 'estrelas'}`}
        >
          <Icon name={value >= position ? 'star' : 'star-outline'} size={size} color={colors.star} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
