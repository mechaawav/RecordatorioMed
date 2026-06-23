import { create } from 'zustand';

const useUIStore = create((set) => ({
  formData: {
    name: '',
    time: '',
    imageUri: null,
    location: null,
    contact: null,
  },

  setFormData: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    }));
  },

  setImageUri: (uri) => {
    set((state) => ({
      formData: {
        ...state.formData,
        imageUri: uri,
      },
    }));
  },

  setLocation: (location) => {
    set((state) => ({
      formData: {
        ...state.formData,
        location,
      },
    }));
  },

  setContact: (contact) => {
    set((state) => ({
      formData: {
        ...state.formData,
        contact,
      },
    }));
  },

  resetForm: () => {
    set({
      formData: {
        name: '',
        time: '',
        imageUri: null,
        location: null,
        contact: null,
      },
    });
  },

  getFormData: () => {
    return useUIStore.getState().formData;
  },
}));

export default useUIStore;
