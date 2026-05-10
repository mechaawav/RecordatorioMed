import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MedicationCard({ medication, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.infoBox}>
        <Text style={styles.title}>{medication.name}</Text>
        <Text style={styles.time}>Hora: {medication.time}</Text>
      </View>
      {/* nota para mi: boton delete */}
      <TouchableOpacity style={styles.btnDelete} onPress={() => onDelete(medication.id)}>
        <Text style={styles.btnText}>X</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2, 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoBox: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  time: { fontSize: 14, color: '#666', marginTop: 4 },
  btnDelete: { backgroundColor: '#ff4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 5 },
  btnText: { color: 'white', fontWeight: 'bold' }
});