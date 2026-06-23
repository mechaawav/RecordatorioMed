import { create } from 'zustand';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import { requestPermission } from '../services/permissionsService';

const usePermissionStore = create((set) => ({
  permissions: {
    camera: false,
    location: false,
    contacts: false,
    calendar: false,
    notifications: false,
  },

  requestPermission: async (permission) => {
    try {
      const granted = await requestPermission(permission);
      set((state) => ({
        permissions: {
          ...state.permissions,
          [permission]: granted,
        },
      }));
      return granted;
    } catch (error) {
      console.error(`Error requesting ${permission}:`, error);
      return false;
    }
  },

  loadContacts: async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });
      return data || [];
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  },

  getReverseGeocodeAddress: async (latitude, longitude) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addresses.length > 0) {
        const addr = addresses[0];
        return `${addr.name || ''} ${addr.street || ''} ${addr.city || ''}`.trim();
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  },
}));

export default usePermissionStore;
