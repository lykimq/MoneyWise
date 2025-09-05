/**
 * Currency Utility Functions
 *
 * Centralized utility functions for currency formatting and number conversion.
 * These functions are used across multiple components to ensure consistency
 * and avoid code duplication.
 */

/**
 * Converts a value (string, number, or undefined) into a number.
 * Handles currency symbols and commas in strings.
 *
 * @param value - The input value to convert
 * @returns The converted number, or 0 if conversion fails or value is undefined
 */
export const toNumber = (value: string | number | undefined): number => {
    if (value === undefined) return 0;
    if (typeof value === 'string') {
        // Remove currency symbols and parse as float
        const cleaned = value.replace(/[$,]/g, '');
        return parseFloat(cleaned) || 0;
    }
    return value;
};

/**
 * Formats a numerical amount into a currency string (e.g., "$1,234.56").
 *
 * @param amount - The amount to format
 * @returns The formatted currency string
 */
export const formatAmount = (amount: string | number | undefined): string => {
    const numAmount = toNumber(amount);
    return `$${numAmount.toLocaleString()}`;
};

/**
 * Formats currency with proper locale support and currency symbol.
 *
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns The formatted currency string with proper locale formatting
 */
export const formatCurrency = (
    amount: string | number | undefined,
    currency: string = 'USD',
    locale: string = 'en-US'
): string => {
    const numAmount = toNumber(amount);
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(numAmount);
};
