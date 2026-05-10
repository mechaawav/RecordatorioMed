import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleRegister = async () => {
    if (!user || !pass) {
      Alert.alert('Che', 'No dejes campos vacíos');
      return;
    }
    try {
      await AsyncStorage.setItem('@user_credentials', JSON.stringify({ user, pass }));
      Alert.alert('¡Éxito!', 'Usuario creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      console.log('Error guardando usuario', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Usuario</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Elegí un usuario" 
        value={user} 
        onChangeText={setUser} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Tu contraseña" 
        secureTextEntry 
        value={pass} 
        onChangeText={setPass} 
      />
      <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
        <Text style={styles.btnText}>Registrarme</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  btnPrimary: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});