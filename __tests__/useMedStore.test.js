import useMedStore from '../store/useMedStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('useMedStore', () => {
  beforeEach(() => {
    useMedStore.setState({ meds: [] });
    jest.clearAllMocks();
  });

  describe('addMed', () => {
    it('debe agregar un medicamento al store', async () => {
      const newMed = { name: 'Aspirina', time: '10:00' };
      await useMedStore.getState().addMed(newMed);

      const state = useMedStore.getState();
      expect(state.meds.length).toBe(1);
      expect(state.meds[0].name).toBe('Aspirina');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('debe generar ID si no existe', async () => {
      const newMed = { name: 'Ibuprofeno', time: '14:30' };
      await useMedStore.getState().addMed(newMed);

      const med = useMedStore.getState().meds[0];
      expect(med.id).toBeDefined();
    });

    it('debe guardar campos opcionales como null si no existen', async () => {
      const newMed = { name: 'Paracetamol', time: '08:00' };
      await useMedStore.getState().addMed(newMed);

      const med = useMedStore.getState().meds[0];
      expect(med.imageUri).toBeNull();
      expect(med.location).toBeNull();
      expect(med.contact).toBeNull();
    });
  });

  describe('deleteMed', () => {
    it('debe eliminar un medicamento del store', async () => {
      const med1 = { id: '1', name: 'Aspirina', time: '10:00' };
      const med2 = { id: '2', name: 'Ibuprofeno', time: '14:30' };

      await useMedStore.getState().addMed(med1);
      await useMedStore.getState().addMed(med2);

      await useMedStore.getState().deleteMed('1');

      const state = useMedStore.getState();
      expect(state.meds.length).toBe(1);
      expect(state.meds[0].id).toBe('2');
    });

    it('debe persistir cambios en AsyncStorage', async () => {
      const med = { id: '1', name: 'Aspirina', time: '10:00' };
      await useMedStore.getState().addMed(med);
      await useMedStore.getState().deleteMed('1');

      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('@meds_list', JSON.stringify([]));
    });
  });

  describe('loadMeds', () => {
    it('debe cargar medicamentos desde AsyncStorage', async () => {
      const storedMeds = [
        { id: '1', name: 'Ibuprofeno', time: '14:30', imageUri: null, location: null, contact: null },
        { id: '2', name: 'Paracetamol', time: '09:00', imageUri: null, location: null, contact: null },
      ];

      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedMeds));

      await useMedStore.getState().loadMeds();

      const state = useMedStore.getState();
      expect(state.meds.length).toBe(2);
      expect(state.meds[0].name).toBe('Ibuprofeno');
    });

    it('debe manejar cuando no hay datos guardados', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      await useMedStore.getState().loadMeds();

      const state = useMedStore.getState();
      expect(state.meds.length).toBe(0);
    });
  });

  describe('updateMed', () => {
    it('debe actualizar un medicamento existente', async () => {
      const med = { id: '1', name: 'Aspirina', time: '10:00' };
      await useMedStore.getState().addMed(med);

      await useMedStore.getState().updateMed('1', { time: '15:00' });

      const updated = useMedStore.getState().meds[0];
      expect(updated.time).toBe('15:00');
      expect(updated.name).toBe('Aspirina');
    });
  });

  describe('getMedById', () => {
    it('debe obtener un medicamento por ID', async () => {
      const med = { id: '1', name: 'Ibuprofeno', time: '14:30' };
      await useMedStore.getState().addMed(med);

      const found = useMedStore.getState().getMedById('1');
      expect(found.name).toBe('Ibuprofeno');
    });

    it('debe retornar undefined si no existe', () => {
      const found = useMedStore.getState().getMedById('999');
      expect(found).toBeUndefined();
    });
  });

  describe('clearAll', () => {
    it('debe limpiar todos los medicamentos', async () => {
      const med = { id: '1', name: 'Aspirina', time: '10:00' };
      await useMedStore.getState().addMed(med);

      await useMedStore.getState().clearAll();

      expect(useMedStore.getState().meds.length).toBe(0);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@meds_list');
    });
  });

  describe('agregar múltiples medicamentos', () => {
    it('debe mantener todos los medicamentos en orden', async () => {
      const med1 = { id: '1', name: 'Aspir', time: '10:00' };
      const med2 = { id: '2', name: 'Ibuprofeno', time: '14:00' };
      const med3 = { id: '3', name: 'Paracetamol', time: '08:00' };

      await useMedStore.getState().addMed(med1);
      await useMedStore.getState().addMed(med2);
      await useMedStore.getState().addMed(med3);

      const state = useMedStore.getState();
      expect(state.meds.length).toBe(3);
      expect(state.meds[0].name).toBe('Aspir');
      expect(state.meds[1].name).toBe('Ibuprofeno');
      expect(state.meds[2].name).toBe('Paracetamol');
    });
  });
});

