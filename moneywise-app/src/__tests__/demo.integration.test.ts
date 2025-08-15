/**
 * DEMO INTEGRATION TEST - EDUCATIONAL GUIDE
 *
 * This is a simple demonstration test to help you learn Jest testing fundamentals.
 * It verifies that our Jest configuration is working correctly.
 *
 * LEARNING OBJECTIVES:
 * 1. Understand basic Jest test structure
 * 2. Learn about test suites (describe blocks)
 * 3. Learn about individual tests (it blocks)
 * 4. Understand synchronous vs asynchronous testing
 *
 * JEST TESTING STRUCTURE:
 * - describe(): Groups related tests together (test suite)
 * - it(): Individual test case (also can use test())
 * - expect(): Makes assertions about values
 * - Matchers: Methods like .toBe(), .toEqual(), etc.
 *
 * WHY START WITH SIMPLE TESTS?
 * - Verify Jest configuration is correct
 * - Learn testing syntax without complexity
 * - Build confidence before tackling complex scenarios
 * - Ensure test environment is set up properly
 */

// TEST SUITE: Groups related tests together
// describe(name, function) creates a test suite
describe('Demo Integration Test', () => {

    /**
     * BASIC SYNCHRONOUS TEST
     *
     * This tests simple, immediate operations.
     * No waiting for promises, API calls, or timers.
     *
     * WHAT THIS TEACHES:
     * - Basic Jest syntax and structure
     * - How to write assertions with expect()
     * - Using .toBe() matcher for exact equality
     */
    it('should run basic test successfully', () => {
        // ARRANGE: Set up test data (if needed)
        const a = 1;
        const b = 1;

        // ACT: Perform the operation being tested
        const result = a + b;

        // ASSERT: Verify the result is what we expect
        expect(result).toBe(2);

        // Alternative: Direct assertion (same result)
        expect(1 + 1).toBe(2);
    });

    /**
     * BASIC ASYNCHRONOUS TEST
     *
     * This tests operations that return promises.
     * Many real-world operations are async (API calls, file operations, etc.)
     *
     * WHAT THIS TEACHES:
     * - How to test async operations with async/await
     * - Difference between sync and async tests
     * - Promise handling in tests
     *
     * IMPORTANT:
     * - Must use 'async' keyword before test function
     * - Must use 'await' keyword before async operations
     * - Jest will wait for the promise to resolve before finishing the test
     */
    it('should handle async operations', async () => {
        // ARRANGE: Create a promise that resolves with test data
        const asyncOperation = Promise.resolve('test');

        // ACT: Wait for the async operation to complete
        const result = await asyncOperation;

        // ASSERT: Verify the async result
        expect(result).toBe('test');

        // Alternative: Direct async assertion (same result)
        const directResult = await Promise.resolve('test');
        expect(directResult).toBe('test');
    });

    /**
     * ADDITIONAL DEMO: Common Jest Matchers
     *
     * This shows different ways to make assertions in Jest.
     * Different matchers are useful for different types of comparisons.
     */
    it('should demonstrate common Jest matchers', () => {
        // EXACT EQUALITY (primitives)
        expect(5).toBe(5);                    // Numbers
        expect('hello').toBe('hello');        // Strings
        expect(true).toBe(true);             // Booleans

        // OBJECT EQUALITY (deep comparison)
        expect({ name: 'John' }).toEqual({ name: 'John' });

        // TRUTHINESS
        expect('non-empty string').toBeTruthy();
        expect('').toBeFalsy();
        expect(null).toBeNull();
        expect(undefined).toBeUndefined();

        // NUMBERS
        expect(2 + 2).toBeGreaterThan(3);
        expect(2 + 2).toBeGreaterThanOrEqual(4);
        expect(2 + 2).toBeLessThan(5);
        expect(Math.PI).toBeCloseTo(3.14, 2); // Floating point comparison

        // STRINGS
        expect('Hello World').toMatch(/World/);
        expect('Hello World').toContain('World');

        // ARRAYS
        expect(['apple', 'banana', 'orange']).toContain('banana');
        expect(['apple', 'banana']).toHaveLength(2);
    });
});
