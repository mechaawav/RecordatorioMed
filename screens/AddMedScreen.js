import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import useMedStore from '../store/useMedStore';
import useUIStore from '../store/useUIStore';
import usePermissionStore from '../store/usePermissionStore';
import { pickImage } from '../services/imageService';
import { scheduleNotificationForTime } from '../services/notificationsService';
import { useLocationPicker } from '../hooks/useLocationPicker';
import ContactSelector from '../components/ContactSelector';
import LocationDisplay from '../components/LocationDisplay';
import { validateMedInput } from '../utils/validations';

export default function AddMedScreen({ navigation }) {
  const formData = useUIStore((state) => state.formData);
  const setFormData = useUIStore((state) => state.setFormData);
  const setImageUri = useUIStore((state) => state.setImageUri);
  const setContact = useUIStore((state) => state.setContact);
  const setLocation = useUIStore((state) => state.setLocation);
  const resetForm = useUIStore((state) => state.resetForm);

  const addMed = useMedStore((state) => state.addMed);

  const { location, isLoading: locationLoading, pickLocation, clearLocation } = useLocationPicker();

  const [showContactSelector, setShowContactSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = useCallback((text) => {
    setFormData({ name: text });
  }, [setFormData]);

  const handleTimeChange = useCallback((text) => {
    setFormData({ time: text });
  }, [setFormData]);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result.error) {
      Alert.alert('Error', result.error);
    } else if (result.uri) {
      setImageUri(result.uri);
      Alert.alert('Éxito', 'Foto seleccionada');
    }
  };

  const handleLocationPick = async () => {
    await pickLocation();
  };

  const handleLocationUpdate = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSelectContact = (contact) => {
    setContact(contact);
  };

  const handleSave = async () => {
    if (!validateMedInput(formData.name, formData.time)) {
      Alert.alert('Error', 'Completa nombre y hora (formato: HH:MM)');
      return;
    }

    setIsSaving(true);

    try {
      const newMedData = {
        id: Date.now().toString(),
        name: formData.name,
        time: formData.time,
        imageUri: formData.imageUri,
        location: location || formData.location,
        contact: formData.contact,
      };

      const savedMed = await addMed(newMedData);

      const notificationId = await scheduleNotificationForTime(
        formData.name,
        formData.time
      );

      if (notificationId) {
        await useMedStore.getState().updateMed(savedMed.id, { notificationId });
      }

      Alert.alert('Éxito', 'Medicamento guardado');
      resetForm();
      clearLocation();
      navigation.goBack();
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Error', 'No se pudo guardar el medicamento');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.label}>Medicamento *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Ibuprofeno 400mg"
        value={formData.name}
        onChangeText={handleNameChange}
        editable={!isSaving}
      />

      <Text style={styles.label}>Hora de toma *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 14:30"
        value={formData.time}
        onChangeText={handleTimeChange}
        editable={!isSaving}
      />

      {formData.imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: formData.imageUri }} style={styles.imagePreview} />
          <TouchableOpacity
            style={styles.removeImageBtn}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.removeImageText}>Remover foto</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.btn}
        onPress={handlePickImage}
        disabled={isSaving}
      >
        <Text style={styles.btnText}>
          {formData.imageUri ? '📸 Cambiar foto' : '📸 Agregar foto'}
        </Text>
      </TouchableOpacity>

      <LocationDisplay
        location={location || formData.location}
        onPickLocation={handleLocationPick}
        onClear={clearLocation}
        isLoading={locationLoading}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => setShowContactSelector(true)}
        disabled={isSaving}
      >
        <Text style={styles.btnText}>
          {formData.contact ? `👨‍⚕️ ${formData.contact.name}` : '👨‍⚕️ Agregar médico/contacto'}
        </Text>
      </TouchableOpacity>

      <ContactSelector
        visible={showContactSelector}
        onSelectContact={handleSelectContact}
        onClose={() => setShowContactSelector(false)}
      />

      <TouchableOpacity
        style={[styles.btnSave, isSaving && styles.btnSaveDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>Guardar Medicamento</Text>
        )}
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginVertical: 10,
  },
  imagePreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeImageBtn: {
    backgroundColor: '#ffebee',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeImageText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnSave: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  btnSaveDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  spacer: {
    height: 30,
  },
});
