import { useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import usePermissionStore from '../store/usePermissionStore';
import { requestPermission } from '../services/permissionsService';

export const useLocationPicker = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getReverseGeocodeAddress = usePermissionStore((state) => state.getReverseGeocodeAddress);

  const pickLocation = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPermission('location');
      if (!hasPermission) {
        Alert.alert('Error', 'Permiso de ubicación denegado');
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      const address = await getReverseGeocodeAddress(latitude, longitude);

      const locationData = {
        lat: latitude,
        lon: longitude,
        address: address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };

      setLocation(locationData);
      Alert.alert('Éxito', 'Ubicación actualizada');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación. Verifica que el GPS esté activado');
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
  };

  return { location, isLoading, pickLocation, clearLocation, setLocation };
};
