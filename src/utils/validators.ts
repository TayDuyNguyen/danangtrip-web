/**
 * Validation utilities
 */

import { REGEX, ERROR_MESSAGES } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (!REGEX.EMAIL.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }
  return { isValid: true };
};

// Phone validation
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (!REGEX.PHONE.test(phone)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PHONE };
  }
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (!REGEX.PASSWORD.test(password)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PASSWORD };
  }
  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: unknown): ValidationResult => {
  if (value === undefined || value === null || value === "") {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  return { isValid: true };
};

// Min length validation
export const validateMinLength = (value: string, min: number): ValidationResult => {
  if (!value) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (value.length < min) {
    return { isValid: false, error: ERROR_MESSAGES.MIN_LENGTH(min) };
  }
  return { isValid: true };
};

// Max length validation
export const validateMaxLength = (value: string, max: number): ValidationResult => {
  if (!value) {
    return { isValid: true }; // Not required, just checking max
  }
  if (value.length > max) {
    return { isValid: false, error: ERROR_MESSAGES.MAX_LENGTH(max) };
  }
  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (!REGEX.URL.test(url)) {
    return { isValid: false, error: "URL không hợp lệ" };
  }
  return { isValid: true };
};

// File validation
export const validateFile = (
  file: File,
  acceptedTypes?: string[],
  maxSize?: number
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }

  if (acceptedTypes && acceptedTypes.length > 0) {
    if (!acceptedTypes.includes(file.type)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
    }
  }

  if (maxSize && file.size > maxSize) {
    return { isValid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  return { isValid: true };
};

// Compare password validation
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: "Mật khẩu không khớp" };
  }
  return { isValid: true };
};

// Range validation
export const validateRange = (
  value: number,
  min: number,
  max: number
): ValidationResult => {
  if (value === undefined || value === null) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `Giá trị phải từ ${min} đến ${max}`,
    };
  }
  return { isValid: true };
};

// Form validation helper
export interface FormErrors {
  [key: string]: string;
}

export const validateForm = (
  fields: { [key: string]: ValidationResult }
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  let isValid = true;

  Object.entries(fields).forEach(([field, result]) => {
    if (!result.isValid) {
      errors[field] = result.error || ERROR_MESSAGES.REQUIRED;
      isValid = false;
    }
  });

  return { isValid, errors };
};
