export const validateMedInput = (name, time) => {
  if (!name || name.trim() === '') return false;
  if (!time || time.trim() === '') return false;
  return true;
};