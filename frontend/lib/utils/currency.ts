// src/lib/utils/currency.ts

/**
 * Formats a number into a currency string based on locale.
 * @param amount The amount to format.
 * @param currency The currency code (e.g., 'USD', 'EUR').
 * @param locale The locale to use for formatting (e.g., 'en-US').
 * @param options Intl.NumberFormatOptions for currency.
 * @returns Formatted currency string.
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    ...options,
  }).format(amount);
};

/**
 * Formats a large number into a compact currency string (e.g., $1.2M).
 * @param amount The amount to format.
 * @param currency The currency symbol (e.g., '$', '€').
 * @param fractionDigits Number of decimal places for compact format.
 * @returns Compact formatted currency string.
 */
export const formatCompactCurrency = (
  amount: number,
  currencySymbol: string = '$',
  fractionDigits: number = 1
): string => {
  if (amount < 1000) {
    return `${currencySymbol}${amount}`;
  }

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(amount)) / 3);
  const scaled = amount / (1000 ** tier);

  return `${currencySymbol}${scaled.toFixed(fractionDigits)}${suffixes[tier]}`;
};

/**
 * Converts a number to a percentage string with a given number of decimal places.
 * @param value The number to convert (e.g., 0.15 for 15%).
 * @param decimalPlaces The number of decimal places to include.
 * @returns A string representing the percentage.
 */
export const toPercentage = (value: number, decimalPlaces: number = 2): string => {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
};
