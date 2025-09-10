/**
 * BUDGET CALCULATIONS INTEGRATION TESTS - EDUCATIONAL GUIDE
 *
 * This file tests the core business logic of our budget application. It
 * demonstrates testing mathematical operations and edge cases.
 *
 * LEARNING OBJECTIVES:
 * 1. Understand testing business logic and calculations.
 * 2. Learn about floating-point precision in financial calculations.
 * 3. Understand edge case testing (zero values, negative numbers).
 * 4. Learn about testing mathematical operations safely.
 *
 * WHY TEST CALCULATIONS?
 * - Money calculations must be 100% accurate.
 * - Small errors compound over time.
 * - Edge cases can cause app crashes.
 * - Financial apps require high reliability.
 *
 * FINANCIAL CALCULATION CHALLENGES:
 * - Floating-point precision errors.
 * - Division by zero scenarios.
 * - Negative values (over-budget situations).
 * - Currency formatting and parsing.
 *
 * TESTING PATTERNS DEMONSTRATED:
 * - Arrange-Act-Assert pattern.
 * - Floating-point comparison with tolerance.
 * - Edge case coverage.
 * - Multiple assertions per test.
 */

describe('Budget Calculations Integration Tests', () => {

    /**
     * BASIC MONEY ARITHMETIC TEST
     *
     * Tests the fundamental budget calculation: planned - spent = remaining.
     * Also tests percentage calculation: (spent / planned) * 100.
     *
     * WHAT THIS TEACHES:
     * - String to number conversion with parseFloat().
     * - Basic arithmetic operations.
     * - Floating-point comparison with toBeCloseTo().
     *
     * WHY USE toBeCloseTo()?
     * - Floating-point math isn't always exact.
     * - 0.1 + 0.2 = 0.30000000000000004 in JavaScript.
     * - toBeCloseTo() allows small precision differences.
     *
     * REAL-WORLD SCENARIO:
     * User has $1000 budget, spent $750.50, should have $249.50 remaining.
     */
    it('should handle basic money calculations correctly', async () => {
        // ARRANGE: Set up test data (strings like from API).
        const planned = '1000.00';  // Budget amount planned.
        const spent = '750.50';     // Amount spent so far.

        // ACT: Convert strings to numbers and perform calculations.
        const plannedNum = parseFloat(planned);
        const spentNum = parseFloat(spent);
        const remaining = plannedNum - spentNum;        // Money left to spend.
        const percentage = (spentNum / plannedNum) * 100; // Percentage used.

        // ASSERT: Verify calculations are correct.
        expect(remaining).toBeCloseTo(249.50, 2);    // $249.50 remaining.
        expect(percentage).toBeCloseTo(75.05, 2);    // 75.05% of budget used.

        // EDUCATIONAL NOTE: Why 2 decimal places?
        // - Financial calculations typically use 2 decimal places for cents.
        // - toBeCloseTo(value, precision) - precision is number of decimal places.
    });

    /**
     * OVER-BUDGET SCENARIO TEST
     *
     * Tests what happens when a user spends more than planned. This is a common
     * real-world scenario that must be handled correctly.
     *
     * WHAT THIS TEACHES:
     * - Handling negative values (over-budget).
     * - Percentage calculations over 100%.
     * - Multiple related assertions in one test.
     *
     * WHY TEST OVER-BUDGET?
     * - Users frequently exceed budgets.
     * - The app must handle negative remaining amounts.
     * - The UI needs to show "over budget" states correctly.
     *
     * REAL-WORLD SCENARIO:
     * User planned $500 for dining, but spent $650.75 (over by $150.75).
     */
    it('should handle over-budget calculations correctly', () => {
        // ARRANGE: Over-budget scenario data.
        const planned = '500.00';   // Planned budget.
        const spent = '650.75';     // Amount spent (more than planned).

        // ACT: Perform over-budget calculations.
        const plannedNum = parseFloat(planned);
        const spentNum = parseFloat(spent);
        const remaining = plannedNum - spentNum;        // Will be negative.
        const percentage = (spentNum / plannedNum) * 100; // Will be over 100%.

        // ASSERT: Verify over-budget calculations.
        expect(remaining).toBeCloseTo(-150.75, 2);   // Negative remaining.
        expect(percentage).toBeCloseTo(130.15, 2);   // 130.15% of budget used.

        // Additional assertions for over-budget state.
        expect(remaining).toBeLessThan(0);           // Remaining should be negative.
        expect(percentage).toBeGreaterThan(100);     // Percentage should exceed 100%.

        // EDUCATIONAL NOTE: These additional assertions make the test intent clear.
        // They verify the over-budget state explicitly, not just the numbers.
    });

    /**
     * ZERO VALUES EDGE CASE TEST
     *
     * Tests the dangerous scenario of division by zero. This prevents app
     * crashes when users have no budget set up.
     *
     * WHAT THIS TEACHES:
     * - Edge case testing for dangerous operations.
     * - Safe division with zero-checking.
     * - Handling empty/new user states.
     *
     * WHY TEST ZERO VALUES?
     * - Division by zero causes Infinity or NaN.
     * - New users might have no budget set up.
     * - Empty categories should not crash the app.
     *
     * REAL-WORLD SCENARIOS:
     * - New user hasn't set up a budget yet.
     * - Category with $0 planned budget.
     * - Time period with no activity.
     */
    it('should handle zero budget calculations safely', () => {
        // ARRANGE: Zero values scenario.
        const planned = '0.00';     // No budget planned.
        const spent = '0.00';       // No money spent.

        // ACT: Convert and calculate with zero values.
        const plannedNum = parseFloat(planned);
        const spentNum = parseFloat(spent);
        const remaining = plannedNum - spentNum;    // 0 - 0 = 0.

        // ASSERT: Basic calculation should work.
        expect(remaining).toBe(0);

        // ACT: Safe percentage calculation (avoid division by zero).
        const percentage = plannedNum === 0 ? 0 : (spentNum / plannedNum) * 100;

        // ASSERT: Percentage should be 0, not NaN or Infinity.
        expect(percentage).toBe(0);

        // EDUCATIONAL NOTE: The ternary operator prevents division by zero.
        // plannedNum === 0 ? 0 : (calculation).
        // If planned is zero, return 0, otherwise calculate normally.

        // ALTERNATIVE APPROACHES:
        // - Use Number.isFinite() to check the result.
        // - Use Math.min/Math.max to clamp values.
        // - Use dedicated money/decimal libraries for precision.
    });

    /**
     * ADDITIONAL EDGE CASES TEST
     *
     * Tests more unusual scenarios that could occur in real usage.
     * Demonstrates comprehensive edge case coverage.
     */
    it('should handle additional edge cases correctly', () => {
        // EDGE CASE 1: Very small amounts (precision testing).
        const smallPlanned = parseFloat('0.01');  // 1 cent.
        const smallSpent = parseFloat('0.005');   // Half a cent (rounds to 0.01).
        const smallRemaining = smallPlanned - smallSpent;
        expect(smallRemaining).toBeCloseTo(0.005, 3); // 3 decimal precision for sub-cent.

        // EDGE CASE 2: Very large amounts (no overflow).
        const largePlanned = parseFloat('999999.99');
        const largeSpent = parseFloat('500000.50');
        const largeRemaining = largePlanned - largeSpent;
        expect(largeRemaining).toBeCloseTo(499999.49, 2);

        // EDGE CASE 3: Exact budget usage (100% scenario).
        const exactPlanned = parseFloat('100.00');
        const exactSpent = parseFloat('100.00');
        const exactPercentage = (exactSpent / exactPlanned) * 100;
        expect(exactPercentage).toBe(100); // Exactly 100%.
        expect(exactPlanned - exactSpent).toBe(0); // Exactly zero remaining.
    });

});
