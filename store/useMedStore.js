import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMedStore = create((set, get) => ({
  meds: [],
  loadMeds: async () => {
    try {
      const data = await AsyncStorage.getItem('@meds_list');
      if (data) set({ meds: JSON.parse(data) });
    } catch (e) {
      console.log('Error leyendo meds', e);
    }
  },
  addMed: async (newMed) => {
    const updated = [...get().meds, newMed];
    set({ meds: updated });
    await AsyncStorage.setItem('@meds_list', JSON.stringify(updated));
  },
  deleteMed: async (id) => {
    const updated = get().meds.filter(m => m.id !== id);
    set({ meds: updated });
    await AsyncStorage.setItem('@meds_list', JSON.stringify(updated));
  }
}));

export default useMedStore;