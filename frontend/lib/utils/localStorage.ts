// src/lib/utils/localStorage.ts

/**
 * Stores a value in localStorage.
 * @param key The key to store the value under.
 * @param value The value to store. Can be any serializable type.
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error setting item to localStorage:', error);
  }
};

/**
 * Retrieves a value from localStorage.
 * @param key The key of the item to retrieve.
 * @returns The retrieved value of type T, or null if not found or deserialization fails.
 */
export const getItem = <T>(key: string): T | null => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
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
