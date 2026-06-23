import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMedStore = create((set, get) => ({
  meds: [],

  loadMeds: async () => {
    try {
      const data = await AsyncStorage.getItem('@meds_list');
      if (data) {
        const parsedMeds = JSON.parse(data);
        set({ meds: parsedMeds });
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  },

  addMed: async (newMed) => {
    try {
      const med = {
        id: newMed.id || Date.now().toString(),
        name: newMed.name || '',
        time: newMed.time || '',
        imageUri: newMed.imageUri || null,
        location: newMed.location || null,
        contact: newMed.contact || null,
        notificationId: newMed.notificationId || null,
        createdAt: newMed.createdAt || new Date().toISOString(),
      };

      const updated = [...get().meds, med];
      set({ meds: updated });
      await AsyncStorage.setItem('@meds_list', JSON.stringify(updated));
      return med;
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  },

  updateMed: async (id, updates) => {
    try {
      const updated = get().meds.map((m) => (m.id === id ? { ...m, ...updates } : m));
      set({ meds: updated });
      await AsyncStorage.setItem('@meds_list', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  },

  deleteMed: async (id) => {
    try {
      const updated = get().meds.filter((m) => m.id !== id);
      set({ meds: updated });
      await AsyncStorage.setItem('@meds_list', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  },

  getMedById: (id) => {
    return get().meds.find((m) => m.id === id);
  },

  clearAll: async () => {
    try {
      set({ meds: [] });
      await AsyncStorage.removeItem('@meds_list');
    } catch (error) {
      console.error('Error clearing medications:', error);
    }
  },
}));

export default useMedStore;