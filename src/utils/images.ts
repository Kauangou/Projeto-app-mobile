import { ImageSourcePropType } from 'react-native';
import { ImageRef } from '../types';

export function resolveImage(ref: ImageRef): ImageSourcePropType {
  return { uri: ref };
}
