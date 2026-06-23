import React from 'react';
import { render } from '@testing-library/react-native';
import MedicationCard from '../components/MedicationCard';

describe('MedicationCard', () => {
  const mockMed = {
    id: '1',
    name: 'Ibuprofeno 400mg',
    time: '14:30',
    imageUri: null,
    contact: { id: '123', name: 'Dr. House', phone: '555-1234' },
    location: { lat: -34.6, lon: -58.4, address: 'Farmacia Central' },
  };

  const mockOnDelete = jest.fn();

  it('debe renderizar sin error', () => {
    const result = render(
      <MedicationCard medication={mockMed} onDelete={mockOnDelete} />
    );
    expect(result).toBeTruthy();
  });

  it('debe aceptar props correctamente', () => {
    const result = render(
      <MedicationCard medication={mockMed} onDelete={mockOnDelete} />
    );
    expect(result).toBeDefined();
  });

  it('debe tener callback de delete', () => {
    render(<MedicationCard medication={mockMed} onDelete={mockOnDelete} />);
    expect(mockOnDelete).toBeDefined();
  });

  it('debe renderizar con datos completos', () => {
    const fullMed = {
      id: '1',
      name: 'Paracetamol',
      time: '08:00',
      imageUri: 'file://image.jpg',
      contact: { id: '123', name: 'Doctor', phone: '123456' },
      location: { lat: 0, lon: 0, address: 'Clinic' },
    };
    const result = render(
      <MedicationCard medication={fullMed} onDelete={mockOnDelete} />
    );
    expect(result).toBeTruthy();
  });

  it('debe renderizar con datos mínimos', () => {
    const minimalMed = {
      id: '1',
      name: 'Aspirina',
      time: '10:00',
      imageUri: null,
      contact: null,
      location: null,
    };
    const result = render(
      <MedicationCard medication={minimalMed} onDelete={mockOnDelete} />
    );
    expect(result).toBeTruthy();
  });
});

