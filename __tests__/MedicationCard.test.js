import MedicationCard from '../components/MedicationCard';

describe('MedicationCard', () => {
  it('should export a valid component', () => {
    expect(MedicationCard).toBeDefined();
    expect(typeof MedicationCard).toBe('function');
  });

  it('should accept medication and onDelete props', () => {
    const medication = { id: '1', name: 'Ibuprofeno', time: '14:30' };
    const mockOnDelete = jest.fn();
    
    expect(() => {
      MedicationCard({ medication, onDelete: mockOnDelete });
    }).not.toThrow();
  });

  it('should handle multiple medications', () => {
    const medications = [
      { id: '1', name: 'Ibuprofeno', time: '14:30' },
      { id: '2', name: 'Paracetamol', time: '10:00' },
    ];
    const mockOnDelete = jest.fn();
    
    medications.forEach(med => {
      expect(() => {
        MedicationCard({ medication: med, onDelete: mockOnDelete });
      }).not.toThrow();
    });
  });
});

