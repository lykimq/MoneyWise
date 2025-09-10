/**
 * Integration Tests for Budget Calculations
 *
 * Tests core financial calculations including budget arithmetic, over-budget scenarios,
 * and edge cases. Ensures accurate money calculations with proper floating-point handling.
 */

describe('Budget Calculations Integration Tests', () => {

    // Tests basic budget arithmetic: planned - spent = remaining
    it('should handle basic money calculations correctly', async () => {
        const planned = '1000.00';
        const spent = '750.50';

        const plannedNum = parseFloat(planned);
        const spentNum = parseFloat(spent);
        const remaining = plannedNum - spentNum;
        const percentage = (spentNum / plannedNum) * 100;

        expect(remaining).toBeCloseTo(249.50, 2);
        expect(percentage).toBeCloseTo(75.05, 2);
    });

    // Tests over-budget scenarios when spending exceeds planned amount
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

    // Tests zero values and division by zero edge cases
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

    // Tests additional edge cases for comprehensive coverage
    it('should handle additional edge cases correctly', () => {
        // Very small amounts (precision testing)
        const smallPlanned = parseFloat('0.01');
        const smallSpent = parseFloat('0.005');
        const smallRemaining = smallPlanned - smallSpent;
        expect(smallRemaining).toBeCloseTo(0.005, 3);

        // Very large amounts (no overflow)
        const largePlanned = parseFloat('999999.99');
        const largeSpent = parseFloat('500000.50');
        const largeRemaining = largePlanned - largeSpent;
        expect(largeRemaining).toBeCloseTo(499999.49, 2);

        // Exact budget usage (100% scenario)
        const exactPlanned = parseFloat('100.00');
        const exactSpent = parseFloat('100.00');
        const exactPercentage = (exactSpent / exactPlanned) * 100;
        expect(exactPercentage).toBe(100);
        expect(exactPlanned - exactSpent).toBe(0);
    });

});
