import * as ImagePicker from 'expo-image-picker';
import { requestPermission } from './permissionsService';

export const pickImage = async () => {
  try {
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) {
      return { error: 'Permiso denegado para acceder a la galería' };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGES,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (result.canceled) {
      return { uri: null };
    }

    const uri = result.assets[0].uri;

    if (!uri || typeof uri !== 'string') {
      return { error: 'Imagen no válida' };
    }

    return { uri };
  } catch (error) {
    console.error('Error picking image:', error);
    return { error: 'Error al seleccionar imagen' };
  }
};

