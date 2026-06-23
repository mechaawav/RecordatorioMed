import * as ImagePicker from 'expo-image-picker';

export const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (result.canceled) {
      return { uri: null };
    }

    const uri = result.assets?.[0]?.uri;
    if (!uri) {
      return { error: 'No se pudo obtener la imagen' };
    }

    return { uri };
  } catch (error) {
    console.error('Error:', error);
    return { error: 'Error al abrir galería' };
  }
};


