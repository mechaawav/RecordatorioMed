import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import usePermissionStore from '../store/usePermissionStore';

export default function ContactSelector({ visible, onSelectContact, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loadContacts = usePermissionStore((state) => state.loadContacts);

  useEffect(() => {
    if (visible) {
      loadContactsData();
    }
  }, [visible]);

  const loadContactsData = async () => {
    setIsLoading(true);
    try {
      const data = await loadContacts();
      if (data.length === 0) {
        Alert.alert('Aviso', 'No hay contactos en el dispositivo');
        setContacts([]);
        setFilteredContacts([]);
      } else {
        setContacts(data);
        setFilteredContacts(data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'No se pudieron cargar los contactos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const handleSelectContact = (contact) => {
    onSelectContact({
      id: contact.id,
      name: contact.name,
      phone: contact.phoneNumbers?.[0]?.number || null,
    });
    setSearchText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar Médico/Contacto</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar contacto..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />

        {isLoading ? (
          <Text style={styles.loadingText}>Cargando contactos...</Text>
        ) : filteredContacts.length === 0 ? (
          <Text style={styles.emptyText}>No hay contactos para mostrar</Text>
        ) : (
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleSelectContact(item)}
              >
                <Text style={styles.contactName}>{item.name}</Text>
                {item.phoneNumbers?.[0]?.number && (
                  <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
                )}
              </TouchableOpacity>
            )}
            scrollEnabled
          />
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeBtn: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  contactItem: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactPhone: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  cancelBtn: {
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
