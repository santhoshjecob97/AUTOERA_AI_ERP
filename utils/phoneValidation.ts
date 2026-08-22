/**
 * Phone number validation and formatting utilities
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePhoneNumber = (phone: string): PhoneValidationResult => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (!cleaned) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Check if it's a valid Indian phone number (10 digits)
  if (cleaned.length === 10) {
    const isValid = /^[6-9]\d{9}$/.test(cleaned);
    return {
      isValid,
      error: isValid ? undefined : 'Indian mobile numbers must start with 6-9',
    };
  }
  
  // International format with country code (e.g., +91 for India)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const isValid = /^91[6-9]\d{9}$/.test(cleaned);
    return {
      isValid,
      error: isValid ? undefined : 'Invalid Indian phone number format',
    };
  }
  
  // General international format (10-15 digits)
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return { isValid: true };
  }
  
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Phone number is too short' };
  }
  
  return { isValid: false, error: 'Phone number is too long' };
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Indian phone numbers
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  
  // Already has country code
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)}-${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return with + prefix for international
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  
  return phone;
};

export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const isValidInternationalFormat = (phone: string): boolean => {
  // Check if phone starts with + and has valid format
  return /^\+\d{10,15}$/.test(phone);
};

export const addCountryCode = (phone: string, countryCode: string = '91'): string => {
  const cleaned = cleanPhoneNumber(phone);
  
  // If already has country code, return as is
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  
  // Add country code
  return `+${countryCode}${cleaned}`;
};
