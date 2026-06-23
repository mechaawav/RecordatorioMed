import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AddMedScreen({ navigation }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    (async () => {
      // nota para mi: peticion de permisos
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ey', 'Necesitamos permisos para mandarte los recordatorios');
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

  const handleSave = async () => {
    if (!name || !time) {
      Alert.alert('Error', 'Completá nombre y hora');
      return;
    }

    try {
      const existing = await AsyncStorage.getItem('@meds_list');
      const meds = existing ? JSON.parse(existing) : [];
      
      const newMed = { id: Date.now().toString(), name, time };
      meds.push(newMed);
      
      await AsyncStorage.setItem('@meds_list', JSON.stringify(meds));

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Hora de tu medicación! 💊",
          body: `Te toca tomar: ${name}`,
        },
        trigger: { 
          type: 'time',
          seconds: 5,
          channelId: 'recordatorios', 
        },
      });

      navigation.goBack();
    } catch (e) {
      console.log('Error al guardar medicación', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Medicamento</Text>
      <TextInput style={styles.input} placeholder="Ej: Ibuprofeno 400mg" value={name} onChangeText={setName} />
      
      <Text style={styles.label}>Hora de la toma</Text>
      <TextInput style={styles.input} placeholder="Ej: 14:30" value={time} onChangeText={setTime} />

      <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
        <Text style={styles.btnText}>Guardar y Programar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  btnPrimary: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});