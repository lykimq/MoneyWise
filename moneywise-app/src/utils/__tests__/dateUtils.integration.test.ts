/**
 * Integration Tests for Date Utilities
 *
 * Tests date parameter handling for API calls including current date extraction,
 * default parameter behavior, and various parameter combinations.
 */

import { getCurrentDateParams, buildDateParams } from '../dateUtils';

describe('Date Utils Integration Tests', () => {

    // Tests current date extraction for default API parameters
    it('should return current month and year as strings', () => {
        const result = getCurrentDateParams();

        expect(result).toHaveProperty('month');
        expect(result).toHaveProperty('year');
        expect(typeof result.month).toBe('string');
        expect(typeof result.year).toBe('string');

        const monthNum = parseInt(result.month);
        expect(monthNum).toBeGreaterThanOrEqual(1);
        expect(monthNum).toBeLessThanOrEqual(12);

        const yearNum = parseInt(result.year);
        const currentYear = new Date().getFullYear();
        expect(yearNum).toBe(currentYear);
    });

    // Tests default parameter behavior when no date is provided
    it('should use current date when no parameters provided', () => {
        const result = buildDateParams();
        const current = getCurrentDateParams();

        expect(result.month).toBe(current.month);
        expect(result.year).toBe(current.year);
    });

    // Tests explicit parameter passing for historical dates
    it('should use both provided parameters', () => {
        const result = buildDateParams('3', '2022');

        expect(result.month).toBe('3');
        expect(result.year).toBe('2022');
    });

    // Tests partial parameter handling with month-only input
    it('should use provided month with current year when year not provided', () => {
        const result = buildDateParams('6');
        const current = getCurrentDateParams();

        expect(result.month).toBe('6');
        expect(result.year).toBe(current.year);
    });

    // Tests additional parameter combinations and edge cases
    it('should handle edge cases and additional parameter combinations', () => {
        // Month boundary values
        const january = buildDateParams('1', '2023');
        expect(january.month).toBe('1');
        expect(january.year).toBe('2023');

        const december = buildDateParams('12', '2023');
        expect(december.month).toBe('12');
        expect(december.year).toBe('2023');

        // Different year formats
        const futureYear = buildDateParams('6', '2025');
        expect(futureYear.month).toBe('6');
        expect(futureYear.year).toBe('2025');

        const pastYear = buildDateParams('6', '2020');
        expect(pastYear.month).toBe('6');
        expect(pastYear.year).toBe('2020');
    });

});
