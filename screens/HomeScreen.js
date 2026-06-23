import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import useMedStore from '../store/useMedStore';
import MedicationCard from '../components/MedicationCard';

export default function HomeScreen({ navigation }) {
  const meds = useMedStore((state) => state.meds);
  const loadMeds = useMedStore((state) => state.loadMeds);
  const deleteMed = useMedStore((state) => state.deleteMed);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMeds();
    });
    return unsubscribe;
  }, [navigation, loadMeds]);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleAddMed = () => {
    navigation.navigate('AddMed');
  };

  return (
    <View style={styles.container}>
      {meds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💊</Text>
          <Text style={styles.emptyText}>No tenés medicación cargada todavía</Text>
          <TouchableOpacity style={styles.btnEmpty} onPress={handleAddMed}>
            <Text style={styles.btnEmptyText}>Agregar Medicamento</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={meds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicationCard medication={item} onDelete={deleteMed} />
          )}
          scrollEnabled
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddMed}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.btnLogout}>
        <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  btnEmpty: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  btnEmptyText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabIcon: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  btnLogout: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnLogoutText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
