export const normalizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
