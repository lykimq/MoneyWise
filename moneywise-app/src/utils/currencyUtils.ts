/**
 * Currency Utility Functions
 *
 * Centralized utility functions for currency formatting and number conversion.
 * These functions are used across multiple components to ensure consistency
 * and avoid code duplication.
 *
 * Security: All functions include input sanitization to prevent injection
 * attacks.
 */
import { sanitizeString, sanitizeNumber } from './sanitization';

/**
 * Converts a value (string, number, or undefined) into a number.
 * Handles currency symbols and commas in strings.
 *
 * @param value - The input value to convert.
 * @returns The converted number, or 0 if conversion fails or value is undefined.
 */
export const toNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;

  // Sanitizes input before processing.
  const sanitizedValue = sanitizeString(value);
  if (!sanitizedValue) return 0;

  if (typeof value === 'string') {
    // Removes currency symbols and parses as a float.
    const cleaned = sanitizedValue.replace(/[$,]/g, '');
    return sanitizeNumber(parseFloat(cleaned));
  }
  return sanitizeNumber(value);
};

/**
 * Formats a numerical amount into a currency string (e.g., "$1,234.56").
 *
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
export const formatAmount = (amount: string | number | undefined): string => {
  const numAmount = toNumber(amount);
  const formatted = numAmount.toLocaleString();
  return `$${sanitizeString(formatted)}`;
};

/**
 * Formats currency with proper locale support and currency symbol.
 *
 * @param amount - The amount to format.
 * @param currency - The currency code (default: 'USD').
 * @param locale - The locale for formatting (default: 'en-US').
 * @returns The formatted currency string with proper locale formatting.
 */
export const formatCurrency = (
  amount: string | number | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  const numAmount = toNumber(amount);
  const sanitizedCurrency = sanitizeString(currency);
  const sanitizedLocale = sanitizeString(locale);

  try {
    const formatted = new Intl.NumberFormat(sanitizedLocale, {
      style: 'currency',
      currency: sanitizedCurrency,
    }).format(numAmount);
    return sanitizeString(formatted);
  } catch (error) {
    // Fallback to basic formatting if Intl fails.
    // TODO: Log the error for better debugging in production.
    return `$${numAmount.toLocaleString()}`;
  }
};
