import { create } from 'zustand';

export const useMedStore = create((set) => ({
  medications: [],
  addMedication: (med) => set((state) => ({
    medications: [...state.medications, med],
  })),
  removeMedication: (id) => set((state) => ({
    medications: state.medications.filter((m) => m.id !== id),
  })),
  getMedications: () => {
    const state = useMedStore.getState();
    return state.medications;
  },
}));
