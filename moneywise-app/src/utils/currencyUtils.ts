/**
 * Currency formatting and number conversion utilities with input sanitization.
 */
import { sanitizeString, sanitizeNumber } from './sanitization';

/**
 * Converts string/number values to numbers, handling currency symbols and commas.
 */
export const toNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;

  const sanitizedValue = sanitizeString(value);
  if (!sanitizedValue) return 0;

  if (typeof value === 'string') {
    // Remove currency symbols and parse as float
    const cleaned = sanitizedValue.replace(/[$,]/g, '');
    return sanitizeNumber(parseFloat(cleaned));
  }
  return sanitizeNumber(value);
};

/**
 * Formats numeric amount as currency string with dollar sign and commas.
 */
export const formatAmount = (amount: string | number | undefined): string => {
  const numAmount = toNumber(amount);
  const formatted = numAmount.toLocaleString();
  return `$${sanitizeString(formatted)}`;
};

/**
 * Formats currency with locale support using Intl.NumberFormat.
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
    // Fallback to basic formatting if Intl fails
    return `$${numAmount.toLocaleString()}`;
  }
};
