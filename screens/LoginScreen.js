import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    if (!user || !pass) {
      Alert.alert('Error', 'Completá todos los campos porfa');
      return;
    }
    try {
      const storedData = await AsyncStorage.getItem('@user_credentials');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.user === user && parsedData.pass === pass) {
          navigation.replace('Home');
        } else {
          Alert.alert('Error', 'Usuario o contraseña incorrectos');
        }
      } else {
        Alert.alert('Aviso', 'No hay usuarios registrados. ¡Registrate primero!');
      }
    } catch (e) {
      console.log('Error leyendo credenciales', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 MedCheck</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Usuario" 
        value={user} 
        onChangeText={setUser} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        secureTextEntry 
        value={pass} 
        onChangeText={setPass} 
      />
      
      <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
        <Text style={styles.btnText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={{ marginTop: 20 }}>
        <Text style={styles.linkText}>¿No tenés cuenta? Registrate acá</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#2196F3' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  btnPrimary: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#2196F3', textAlign: 'center', fontWeight: 'bold' }
});