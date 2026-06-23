import { validateMedInput } from '../utils/validations';

describe('Validación de Medicamento', () => {
  describe('validateMedInput', () => {
    it('debe fallar si el nombre está vacío', () => {
      expect(validateMedInput('', '14:30')).toBe(false);
    });

    it('debe fallar si la hora está vacía', () => {
      expect(validateMedInput('Ibuprofeno', '')).toBe(false);
    });

    it('debe fallar si ambos están vacíos', () => {
      expect(validateMedInput('', '')).toBe(false);
    });

    it('debe fallar si el nombre es null', () => {
      expect(validateMedInput(null, '14:30')).toBe(false);
    });

    it('debe fallar si la hora es null', () => {
      expect(validateMedInput('Ibuprofeno', null)).toBe(false);
    });

    it('debe pasar si tiene nombre y hora válidos', () => {
      expect(validateMedInput('Ibuprofeno', '14:30')).toBe(true);
    });

    it('debe pasar con múltiples nombres', () => {
      expect(validateMedInput('Paracetamol 500mg', '08:00')).toBe(true);
      expect(validateMedInput('Dipirona', '20:00')).toBe(true);
    });

    it('debe fallar con espacios en blanco solamente en nombre', () => {
      expect(validateMedInput('   ', '14:30')).toBe(false);
      expect(validateMedInput('\t\n', '14:30')).toBe(false);
    });

    it('debe fallar con espacios en blanco solamente en hora', () => {
      expect(validateMedInput('Ibuprofeno', '   ')).toBe(false);
      expect(validateMedInput('Ibuprofeno', '\t\n')).toBe(false);
    });

    it('debe validar diferentes formatos de hora', () => {
      expect(validateMedInput('Aspirina', '23:59')).toBe(true);
      expect(validateMedInput('Aspirina', '00:00')).toBe(true);
      expect(validateMedInput('Aspirina', '12:30')).toBe(true);
    });

    it('debe pasar con nombres que contienen números', () => {
      expect(validateMedInput('Vitamina B12', '10:00')).toBe(true);
      expect(validateMedInput('Omeprazol 20mg', '08:00')).toBe(true);
    });

    it('debe pasar con nombres que contienen caracteres especiales', () => {
      expect(validateMedInput('Ácido Acetilsalicílico', '14:30')).toBe(true);
      expect(validateMedInput('Sulfametoxazol-Trimetoprim', '12:00')).toBe(true);
    });

    it('debe trimear espacios al validar', () => {
      expect(validateMedInput('  Ibuprofeno  ', '  14:30  ')).toBe(true);
    });

    it('debe fallar si nombre tiene solo espacios después de trimear', () => {
      expect(validateMedInput('     ', '14:30')).toBe(false);
    });
  });
});

