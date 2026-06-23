import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MedicationCard from '../components/MedicationCard';

describe('MedicationCard', () => {
  const mockMed = { id: '1', name: 'Paracetamol', time: '08:00', contactName: 'Dr. House' };

  it('renderiza correctamente el nombre y la información', () => {
    const { getByText } = render(<MedicationCard medication={mockMed} onDelete={() => {}} />);
    expect(getByText('Paracetamol')).toBeTruthy();
    expect(getByText('👨‍⚕️ Médico: Dr. House')).toBeTruthy();
  });

  it('ejecuta la función onDelete al presionar el botón X', () => {
    const mockOnDelete = jest.fn();
    const { getByText } = render(<MedicationCard medication={mockMed} onDelete={mockOnDelete} />);
    
    fireEvent.press(getByText('X'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});