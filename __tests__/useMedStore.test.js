import { useMedStore } from '../store/useMedStore';

describe('useMedStore', () => {
  beforeEach(() => {
    useMedStore.setState({ medications: [] });
  });

  it('should initialize with empty medications', () => {
    const state = useMedStore.getState();
    expect(state.medications).toEqual([]);
  });

  it('should add medication', () => {
    const med = { id: '1', name: 'Ibuprofeno', time: '14:30' };
    useMedStore.getState().addMedication(med);
    const state = useMedStore.getState();
    expect(state.medications).toHaveLength(1);
    expect(state.medications[0]).toEqual(med);
  });

  it('should remove medication by id', () => {
    const med1 = { id: '1', name: 'Ibuprofeno', time: '14:30' };
    const med2 = { id: '2', name: 'Paracetamol', time: '10:00' };
    useMedStore.getState().addMedication(med1);
    useMedStore.getState().addMedication(med2);
    useMedStore.getState().removeMedication('1');
    const state = useMedStore.getState();
    expect(state.medications).toHaveLength(1);
    expect(state.medications[0].id).toBe('2');
  });

  it('should get medications', () => {
    const med = { id: '1', name: 'Ibuprofeno', time: '14:30' };
    useMedStore.getState().addMedication(med);
    const meds = useMedStore.getState().getMedications();
    expect(meds).toHaveLength(1);
  });
});
