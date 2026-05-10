import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedicationCard from '../components/MedicationCard';

export default function HomeScreen({ navigation }) {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMeds();
    });
    return unsubscribe;
  }, [navigation]);

  const loadMeds = async () => {
    try {
      const data = await AsyncStorage.getItem('@meds_list');
      if (data) setMeds(JSON.parse(data));
    } catch (e) {
      console.log('Error leyendo meds', e);
    }
  };

  const deleteMed = async (id) => {
    try {
      const filteredMeds = meds.filter(m => m.id !== id);
      setMeds(filteredMeds);
      await AsyncStorage.setItem('@meds_list', JSON.stringify(filteredMeds));
    } catch (e) {
      console.log('Error borrando', e);
    }
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {meds.length === 0 ? (
        <Text style={styles.emptyText}>No tenés medicación cargada todavía.</Text>
      ) : (
        <FlatList
          data={meds}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MedicationCard medication={item} onDelete={deleteMed} />
          )}
        />
      )}

      {/* nota para mi: Botón flotante para agregar */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMed')}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* nota para mi: Botón de logout abajito */}
      <TouchableOpacity onPress={handleLogout} style={styles.btnLogout}>
        <Text style={styles.btnLogoutTxt}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  fab: {
    position: 'absolute', right: 20, bottom: 80,
    backgroundColor: '#2196F3', width: 60, height: 60,
    borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 5
  },
  fabIcon: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  btnLogout: { position: 'absolute', bottom: 20, alignSelf: 'center' },
  btnLogoutTxt: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 }
});