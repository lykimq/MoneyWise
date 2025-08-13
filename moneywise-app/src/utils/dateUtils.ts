/**
 * 📅 Date Utility Functions for MoneyWise App
 */

/**
 * Get current month and year as strings for API calls
 *
 * @returns Object with current month (1-12) and year as strings
 */
export const getCurrentDateParams = () => {
    const now = new Date();
    return {
        month: String(now.getMonth() + 1), // JavaScript months are 0-indexed
        year: String(now.getFullYear()),
    };
};

/**
 * Build date parameters with fallbacks to current date
 *
 * @param month - Optional month string
 * @param year - Optional year string
 * @returns Object with month and year, using current date as fallback
 */
export const buildDateParams = (month?: string, year?: string) => {
    const current = getCurrentDateParams();
    return {
        month: month || current.month,
        year: year || current.year,
    };
};
