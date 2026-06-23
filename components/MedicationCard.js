import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MedicationCard({ medication, onDelete }) {
  const { name, time, imageUri, contact, location } = medication;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.medImage}
            onError={() => console.warn('Error loading image:', imageUri)}
          />
        )}

        <View style={styles.infoBox}>
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>

          <Text style={styles.time}>
            <Text style={styles.icon}>⏰</Text> {time}
          </Text>

          {location && (
            <Text style={styles.info} numberOfLines={1}>
              <Text style={styles.icon}>📍</Text>
              {location.address || `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
            </Text>
          )}

          {contact && (
            <Text style={styles.info} numberOfLines={1}>
              <Text style={styles.icon}>👨‍⚕️</Text>
              {contact.name}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.btnDelete} onPress={() => onDelete(medication.id)}>
        <Text style={styles.btnDeleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  infoBox: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  info: {
    fontSize: 12,
    color: '#2196F3',
    marginVertical: 2,
  },
  icon: {
    marginRight: 4,
  },
  btnDelete: {
    backgroundColor: '#ffebee',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  btnDeleteText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
