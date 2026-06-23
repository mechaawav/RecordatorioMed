import useMedStore from '../store/useMedStore';

describe('useMedStore', () => {
  beforeEach(() => {
    useMedStore.setState({ meds: [] }); 
  });

  it('debe agregar un medicamento al store', async () => {
    const newMed = { id: '1', name: 'Aspirina', time: '10:00' };
    await useMedStore.getState().addMed(newMed);
    
    const state = useMedStore.getState();
    expect(state.meds.length).toBe(1);
    expect(state.meds[0].name).toBe('Aspirina');
  });
});