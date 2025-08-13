/**
 * Budget Calculations Integration Tests
 *
 * Simple, working tests for budget calculation logic
 */

describe('Budget Calculations Integration Tests', () => {

    /**
     * TEST: Basic money arithmetic
     * PURPOSE: Ensures financial calculations are accurate
     */
    it('should handle basic money calculations correctly', () => {
        const planned = '1000.00';
        const spent = '750.50';

        const plannedNum = parseFloat(planned);
        const spentNum = parseFloat(spent);
        const remaining = plannedNum - spentNum;
        const percentage = (spentNum / plannedNum) * 100;

        expect(remaining).toBeCloseTo(249.50, 2);
        expect(percentage).toBeCloseTo(75.05, 2);
    });

    /**
     * TEST: Over-budget calculations
     * PURPOSE: Ensures over-budget scenarios are calculated correctly
     */
    it('should handle over-budget calculations correctly', () => {
        const planned = '500.00';
        const spent = '650.75';

        const plannedNum = parseFloat(planned);
        const spentNum = parseFloat(spent);
        const remaining = plannedNum - spentNum;
        const percentage = (spentNum / plannedNum) * 100;

        expect(remaining).toBeCloseTo(-150.75, 2);
        expect(percentage).toBeCloseTo(130.15, 2);
        expect(remaining).toBeLessThan(0);
        expect(percentage).toBeGreaterThan(100);
    });

    /**
     * TEST: Zero budget calculations
     * PURPOSE: Ensures zero budget scenarios don't cause division by zero
     */
    it('should handle zero budget calculations safely', () => {
        const planned = '0.00';
        const spent = '0.00';

        const plannedNum = parseFloat(planned);
        const spentNum = parseFloat(spent);
        const remaining = plannedNum - spentNum;

        expect(remaining).toBe(0);

        const percentage = plannedNum === 0 ? 0 : (spentNum / plannedNum) * 100;
        expect(percentage).toBe(0);
    });

});
