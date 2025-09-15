/**
 * Date utility functions for API parameter handling.
 */

/**
 * Gets current month and year as strings for API calls.
 */
export const getCurrentDateParams = () => {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1), // Convert 0-indexed to 1-indexed
    year: String(now.getFullYear()),
  };
};

/**
 * Builds date parameters with current date as fallback for missing values.
 */
export const buildDateParams = (month?: string, year?: string) => {
  const current = getCurrentDateParams();
  return {
    month: month || current.month,
    year: year || current.year,
  };
};
