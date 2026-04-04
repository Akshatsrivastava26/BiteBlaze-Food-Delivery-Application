export const isValidEmail = (value) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const isValidMobileNumber = (value) => {
  if (!value) return false;
  return /^\d{10}$/.test(String(value).trim());
};

export const isStrongPassword = (value) => {
  if (!value) return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
};

export const isValidOtp = (value) => {
  if (!value) return false;
  return /^\d{4,6}$/.test(String(value).trim());
};
