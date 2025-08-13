/**
 * Date Utils Integration Tests
 *
 * Simple, working tests for date utility functions
 */

import { getCurrentDateParams, buildDateParams } from '../dateUtils';

describe('Date Utils Integration Tests', () => {

    /**
     * TEST: Current date parameter extraction
     * PURPOSE: Ensures date utilities work correctly for current date
     */
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

    /**
     * TEST: Parameter fallback behavior
     * PURPOSE: Ensures function provides defaults when parameters are missing
     */
    it('should use current date when no parameters provided', () => {
        const result = buildDateParams();
        const current = getCurrentDateParams();

        expect(result.month).toBe(current.month);
        expect(result.year).toBe(current.year);
    });

    /**
     * TEST: Complete parameter override
     * PURPOSE: Ensures function uses provided parameters when both are given
     */
    it('should use both provided parameters', () => {
        const result = buildDateParams('3', '2022');

        expect(result.month).toBe('3');
        expect(result.year).toBe('2022');
    });

    /**
     * TEST: Partial parameter handling
     * PURPOSE: Ensures function handles partial parameter sets correctly
     */
    it('should use provided month with current year when year not provided', () => {
        const result = buildDateParams('6');
        const current = getCurrentDateParams();

        expect(result.month).toBe('6');
        expect(result.year).toBe(current.year);
    });

});
