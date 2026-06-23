import { requestPermission, checkAllPermissions } from '../services/permissionsService';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';

jest.mock('expo-image-picker');
jest.mock('expo-location');
jest.mock('expo-contacts');
jest.mock('expo-calendar');
jest.mock('expo-notifications');

describe('permissionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Contacts.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Calendar.requestCalendarPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
  });

  describe('requestPermission', () => {
    it('debe solicitar permiso de cámara', async () => {
      const result = await requestPermission('camera');
      expect(result).toBe(true);
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    });

    it('debe solicitar permiso de ubicación', async () => {
      const result = await requestPermission('location');
      expect(result).toBe(true);
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });

    it('debe solicitar permiso de contactos', async () => {
      const result = await requestPermission('contacts');
      expect(result).toBe(true);
      expect(Contacts.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('debe solicitar permiso de calendario', async () => {
      const result = await requestPermission('calendar');
      expect(result).toBe(true);
      expect(Calendar.requestCalendarPermissionsAsync).toHaveBeenCalled();
    });

    it('debe solicitar permiso de notificaciones', async () => {
      const result = await requestPermission('notifications');
      expect(result).toBe(true);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('debe retornar false si el permiso es denegado', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

      const result = await requestPermission('camera');
      expect(result).toBe(false);
    });

    it('debe manejar errores', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockRejectedValueOnce(new Error('Permission error'));

      const result = await requestPermission('camera');
      expect(result).toBe(false);
    });

    it('debe retornar false para permiso desconocido', async () => {
      const result = await requestPermission('unknown');
      expect(result).toBe(false);
    });
  });

  describe('checkAllPermissions', () => {
    it('debe verificar todos los permisos', async () => {
      const result = await checkAllPermissions();

      expect(result.camera).toBe(true);
      expect(result.location).toBe(true);
      expect(result.contacts).toBe(true);
      expect(result.calendar).toBe(true);
      expect(result.notifications).toBe(true);
    });

    it('debe manejar si algunos permisos son denegados', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });

      const result = await checkAllPermissions();

      expect(result.camera).toBe(false);
      expect(result.location).toBe(true);
    });
  });
});
