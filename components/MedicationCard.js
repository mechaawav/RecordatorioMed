import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MedicationCard({ medication, onDelete }) {
  return (
    <View style={styles.card}>
      {medication.imageUri && (
        <Image source={{ uri: medication.imageUri }} style={styles.medImage} />
      )}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{medication.name}</Text>
        <Text style={styles.time}>Hora: {medication.time}</Text>
        {medication.location && (
           <Text style={styles.extraInfo}>📍 Farmacia guardada</Text>
        )}
        {medication.contactName && (
           <Text style={styles.extraInfo}>👨‍⚕️ Médico: {medication.contactName}</Text>
        )}
      </View>
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
  medImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  infoBox: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  time: { fontSize: 14, color: '#666', marginTop: 2 },
  extraInfo: { fontSize: 12, color: '#2196F3', marginTop: 2 },
  btnDelete: { backgroundColor: '#ff4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 5, marginLeft: 10 },
  btnText: { color: 'white', fontWeight: 'bold' }
});