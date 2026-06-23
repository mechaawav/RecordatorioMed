import { validateMedicationName, validateTime, validateEmail } from '../utils/validations';

describe('Validations', () => {
  describe('validateMedicationName', () => {
    it('should return true for valid medication name', () => {
      expect(validateMedicationName('Ibuprofeno')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(validateMedicationName('')).toBe(false);
    });

    it('should return false for non-string', () => {
      expect(validateMedicationName(null)).toBe(false);
    });
  });

  describe('validateTime', () => {
    it('should return true for valid time format', () => {
      expect(validateTime('14:30')).toBe(true);
    });

    it('should return true for 00:00', () => {
      expect(validateTime('00:00')).toBe(true);
    });

    it('should return true for 23:59', () => {
      expect(validateTime('23:59')).toBe(true);
    });

    it('should return false for invalid time format', () => {
      expect(validateTime('25:00')).toBe(false);
    });

    it('should return false for invalid minutes', () => {
      expect(validateTime('14:60')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
