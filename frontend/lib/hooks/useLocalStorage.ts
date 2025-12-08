// src/lib/hooks/useLocalStorage.ts

import { useState, useEffect, useCallback } from 'react';
import * as localStorageUtil from '../utils/localStorage';

/**
 * Custom hook for persisting state in localStorage.
 *
 * @template T The type of the value being stored.
 * @param {string} key The key under which the value will be stored in localStorage.
 * @param {T} initialValue The initial value to use if nothing is found in localStorage.
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} A tuple containing:
 *   - The stored value.
 *   - A function to update the stored value.
 *   - A function to remove the stored value.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorageUtil.getItem<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // useEffect to update localStorage when the state changes
  useEffect(() => {
    localStorageUtil.setItem<T>(key, storedValue);
  }, [key, storedValue]);

  // Function to update the value, mimicking useState's setter
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((oldValue) => {
      const newValue = value instanceof Function ? value(oldValue) : value;
      localStorageUtil.setItem<T>(key, newValue);
      return newValue;
    });
  }, [key]);

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    localStorageUtil.removeItem(key);
    setStoredValue(initialValue); // Reset state to initial value
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
