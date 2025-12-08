// src/lib/utils/localStorage.ts

/**
 * Stores a value in localStorage.
 * @param key The key to store the value under.
 * @param value The value to store. Can be any JSON-serializable type.
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    if (typeof window !== 'undefined') {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  } catch (error) {
    console.error('Error setting item to localStorage:', error);
  }
};

/**
 * Retrieves a value from localStorage.
 * @param key The key of the item to retrieve.
 * @returns The retrieved value, or null if not found or an error occurs.
 */
export const getItem = <T>(key: string): T | null => {
  try {
    if (typeof window !== 'undefined') {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    }
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
  }
  return null;
};

/**
 * Removes an item from localStorage.
 * @param key The key of the item to remove.
 */
export const removeItem = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};

/**
 * Clears all items from localStorage.
 */
export const clearStorage = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
