import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';

const permissionCheckers = {
  camera: ImagePicker.requestMediaLibraryPermissionsAsync,
  location: Location.requestForegroundPermissionsAsync,
  contacts: Contacts.requestPermissionsAsync,
  calendar: Calendar.requestCalendarPermissionsAsync,
  notifications: Notifications.requestPermissionsAsync,
};

export const requestPermission = async (permission) => {
  try {
    if (!permissionCheckers[permission]) {
      console.warn(`Unknown permission: ${permission}`);
      return false;
    }
    const { status } = await permissionCheckers[permission]();
    return status === 'granted';
  } catch (error) {
    console.error(`Error requesting ${permission} permission:`, error);
    return false;
  }
};

export const checkAllPermissions = async () => {
  const result = {};
  for (const [key] of Object.entries(permissionCheckers)) {
    try {
      result[key] = await requestPermission(key);
    } catch (error) {
      result[key] = false;
    }
  }
  return result;
};
