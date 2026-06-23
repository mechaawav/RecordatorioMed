import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LocationDisplay({ location, onPickLocation, onClear, isLoading }) {
  if (!location) {
    return (
      <TouchableOpacity style={styles.emptyContainer} onPress={onPickLocation}>
        <Text style={styles.emptyIcon}>📍</Text>
        <Text style={styles.emptyText}>
          {isLoading ? 'Obteniendo ubicación...' : 'Presiona para agregar ubicación'}
        </Text>
      </TouchableOpacity>
    );
  }

  const { address, lat, lon } = location;

  return (
    <View style={styles.container}>
      <View style={styles.locationBox}>
        <Text style={styles.icon}>📍</Text>
        <View style={styles.infoBox}>
          <Text style={styles.address}>{address || `${lat.toFixed(4)}, ${lon.toFixed(4)}`}</Text>
          <Text style={styles.coords}>
            {lat.toFixed(4)}° N, {Math.abs(lon).toFixed(4)}° O
          </Text>
        </View>
      </View>
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.btn} onPress={onPickLocation}>
          <Text style={styles.btnText}>Cambiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={onClear}>
          <Text style={styles.btnText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  emptyContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  locationBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoBox: {
    flex: 1,
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  coords: {
    fontSize: 12,
    color: '#666',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnDelete: {
    backgroundColor: '#ff6b6b',
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
});
