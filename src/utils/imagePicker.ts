import * as ImagePicker from 'expo-image-picker';
import { showMessage } from './feedback';

/** Abre a galeria e devolve a URI da foto escolhida, ou `null` se o usuário cancelar. */
export async function pickImageFromLibrary(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    showMessage(
      'Permissão necessária',
      'Permita o acesso às fotos nas configurações do aparelho para anexar imagens.',
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.7,
  });

  if (result.canceled || result.assets.length === 0) return null;
  return result.assets[0].uri;
}
