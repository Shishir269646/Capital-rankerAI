// src/lib/utils/array.ts

/**
 * Removes duplicate values from an array.
 * @param arr The array to process.
 * @returns A new array with unique values.
 */
export const uniqueArray = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

/**
 * Chunks an array into smaller arrays of a specified size.
 * @param arr The array to chunk.
 * @param size The size of each chunk.
 * @returns An array of chunks.
 */
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

/**
 * Flattens a nested array into a single-level array.
 * @param arr The array to flatten.
 * @returns A new flattened array.
 */
export const flattenArray = <T>(arr: (T | T[])[]): T[] => {
  return ([] as T[]).concat(...arr);
};

/**
 * Shuffles an array randomly.
 * @param arr The array to shuffle.
 * @returns A new shuffled array.
 */
export const shuffleArray = <T>(arr: T[]): T[] => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

/**
 * Returns a random element from an array.
 * @param arr The array to pick from.
 * @returns A random element.
 */
export const getRandomElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) {
    return undefined;
  }
  return arr[Math.floor(Math.random() * arr.length)];
};
