// src/lib/utils/date.ts

/**
 * Returns the number of days between two dates.
 * @param date1 The first date.
 * @param date2 The second date.
 * @returns The number of days.
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Adds a specified number of days to a date.
 * @param date The starting date.
 * @param days The number of days to add.
 * @returns A new Date object with the added days.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Checks if a given date is in the past.
 * @param date The date to check.
 * @returns True if the date is in the past, false otherwise.
 */
export const isPastDate = (date: Date): boolean => {
  return new Date(date) < new Date();
};

/**
 * Formats a date to ISO string (YYYY-MM-DDTHH:mm:ss.sssZ).
 * @param date The date to format.
 * @returns ISO 8601 string.
 */
export const toISOString = (date: Date): string => {
  return new Date(date).toISOString();
};

/**
 * Converts a date string to a Date object.
 * @param dateString The date string to convert.
 * @returns A Date object.
 */
export const toDateObject = (dateString: string): Date => {
  return new Date(dateString);
};
