// src/lib/utils/string.ts

/**
 * Capitalizes the first letter of a string.
 * @param str The input string.
 * @returns The string with its first letter capitalized.
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a string to title case.
 * E.g., "hello world" -> "Hello World"
 * @param str The input string.
 * @returns The string in title case.
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Truncates a string to a specified length and appends an ellipsis.
 * @param str The input string.
 * @param maxLength The maximum length of the string before truncation.
 * @returns The truncated string.
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Removes all whitespace from a string.
 * @param str The input string.
 * @returns The string with no whitespace.
 */
export const removeWhitespace = (str: string): string => {
  if (!str) return '';
  return str.replace(/\s/g, '');
};

/**
 * Generates a random string of a given length.
 * @param length The desired length of the random string.
 * @returns A random string.
 */
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
