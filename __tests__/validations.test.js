import { validateMedInput } from '../utils/validations';

describe('Validación de Medicamento', () => {
  it('debe fallar si el nombre o la hora están vacíos', () => {
    expect(validateMedInput('', '14:30')).toBe(false);
    expect(validateMedInput('Ibuprofeno', '')).toBe(false);
  });

  it('debe pasar si tiene nombre y hora', () => {
    expect(validateMedInput('Ibuprofeno', '14:30')).toBe(true);
  });
});