/**
 * Date Utility Functions for MoneyWise App
 *
 * This file provides helper functions for handling date-related parameters,
 * primarily for use in API calls.
 */

/**
 * Retrieves the current month and year as string values suitable for API calls.
 *
 * @returns An object containing the current month (1-12) and year as strings.
 */
export const getCurrentDateParams = () => {
    const now = new Date();
    return {
        month: String(now.getMonth() + 1), // JavaScript months are 0-indexed.
        year: String(now.getFullYear()),
    };
};

/**
 * Constructs date parameters, using the current date as a fallback if month
 * or year are not provided.
 *
 * @param month - Optional month string (e.g., "1" for January).
 * @param year - Optional year string (e.g., "2023").
 * @returns An object with the month and year, defaulting to the current date.
 */
export const buildDateParams = (month?: string, year?: string) => {
    const current = getCurrentDateParams();
    return {
        month: month || current.month,
        year: year || current.year,
    };
};
