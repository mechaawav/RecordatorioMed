import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView, Image } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import useMedStore from '../store/useMedStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AddMedScreen({ navigation }) {
  const addMed = useMedStore(state => state.addMed);
  
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos para mandarte los recordatorios');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('recordatorios', {
          name: 'Recordatorios de Medicación',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    })();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para la foto del medicamento.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la ubicación de la farmacia.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
    Alert.alert('Éxito', 'Ubicación de la farmacia guardada.');
  };

  const handlePickContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso para elegir a tu médico o familiar.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
    if (data.length > 0) {
      setContact(data[0]); // Para simplificar, toma el primero de la lista
      Alert.alert('Éxito', `Contacto guardado: ${data[0].name}`);
    } else {
      Alert.alert('Aviso', 'No se encontraron contactos.');
    }
  };

  const createCalendarEvent = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se podrá agendar en el calendario.');
      return;
    }
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.length > 0 ? calendars[0] : null;

    if (defaultCalendar) {
      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Tomar Medicación: ${name}`,
        startDate: new Date(), 
        endDate: new Date(Date.now() + 60 * 60 * 1000), 
        notes: `Hora: ${time}`,
      });
      Alert.alert('Éxito', 'Evento agregado a tu calendario.');
    }
  };

  const handleSave = async () => {
    if (!name || !time) {
      Alert.alert('Error', 'Completá nombre y hora');
      return;
    }

    try {
      const newMed = { 
        id: Date.now().toString(), 
        name, 
        time,
        imageUri,
        location,
        contactName: contact ? contact.name : null
      };
      
      await addMed(newMed);
      await createCalendarEvent();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Hora de tu medicación! 💊",
          body: `Te toca tomar: ${name}`,
        },
        trigger: { 
          seconds: 5,
        },
      });

      navigation.goBack();
    } catch (e) {
      console.log('Error al guardar medicación', e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nombre del Medicamento</Text>
      <TextInput style={styles.input} placeholder="Ej: Ibuprofeno 400mg" value={name} onChangeText={setName} />
      
      <Text style={styles.label}>Hora de la toma</Text>
      <TextInput style={styles.input} placeholder="Ej: 14:30" value={time} onChangeText={setTime} />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      
      <TouchableOpacity style={styles.btnSecondary} onPress={handlePickImage}>
        <Text style={styles.btnTextSecondary}>Adjuntar Foto (Medicamento)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={handleGetLocation}>
        <Text style={styles.btnTextSecondary}>{location ? 'Ubicación Guardada' : 'Guardar Ubicación (Farmacia)'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={handlePickContact}>
        <Text style={styles.btnTextSecondary}>{contact ? `Médico: ${contact.name}` : 'Elegir Médico (Contacto)'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
        <Text style={styles.btnText}>Guardar y Programar</Text>
      </TouchableOpacity>
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  btnPrimary: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnTextSecondary: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  imagePreview: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10, resizeMode: 'cover' }
});