// src/lib/utils/cn.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally joins class names together, optimizing for Tailwind CSS.
 * Uses `clsx` to join classes and `tailwind-merge` to resolve conflicts.
 *
 * @param inputs - An array of class values (strings, objects, arrays)
 * @returns A single string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
