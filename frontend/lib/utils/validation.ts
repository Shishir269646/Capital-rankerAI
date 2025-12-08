// src/lib/utils/validation.ts

import { VALIDATION_RULES } from '../constants/validation-rules';

/**
 * Validates an email address.
 * @param email The email string to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email);
};

/**
 * Validates a password based on minimum length.
 * @param password The password string to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH;
};

/**
 * Checks if a string is not empty.
 * @param value The string to check.
 * @returns True if not empty, false otherwise.
 */
export const isRequired = (value: string | any[] | number | object | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'number') {
    return true; // Numbers are generally considered "present"
  }
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  return false;
};

/**
 * Validates a URL.
 * @param url The URL string to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidUrl = (url: string): boolean => {
  return VALIDATION_RULES.URL.PATTERN.test(url);
};

/**
 * Validates if a number is positive.
 * @param num The number to validate.
 * @returns True if positive, false otherwise.
 */
export const isPositiveNumber = (num: number): boolean => {
  return num > 0;
};
