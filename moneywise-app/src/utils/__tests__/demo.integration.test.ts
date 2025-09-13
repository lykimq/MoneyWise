/**
 * Demo Integration Tests
 *
 * Basic Jest testing examples to verify configuration and demonstrate
 * fundamental testing patterns including sync/async operations and common matchers.
 */

describe('Demo Integration Test', () => {
  // Tests basic synchronous operations
  it('should run basic test successfully', () => {
    const a = 1;
    const b = 1;
    const result = a + b;

    expect(result).toBe(2);
    expect(1 + 1).toBe(2);
  });

  // Tests basic asynchronous operations with promises
  it('should handle async operations', async () => {
    const asyncOperation = Promise.resolve('test');
    const result = await asyncOperation;

    expect(result).toBe('test');

    const directResult = await Promise.resolve('test');
    expect(directResult).toBe('test');
  });

  // Demonstrates common Jest matchers for different assertion types
  it('should demonstrate common Jest matchers', () => {
    // Exact equality (primitives)
    expect(5).toBe(5);
    expect('hello').toBe('hello');
    expect(true).toBe(true);

    // Object equality (deep comparison)
    expect({ name: 'John' }).toEqual({ name: 'John' });

    // Truthiness
    expect('non-empty string').toBeTruthy();
    expect('').toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();

    // Numbers
    expect(2 + 2).toBeGreaterThan(3);
    expect(2 + 2).toBeGreaterThanOrEqual(4);
    expect(2 + 2).toBeLessThan(5);
    expect(Math.PI).toBeCloseTo(3.14, 2);

    // Strings
    expect('Hello World').toMatch(/World/);
    expect('Hello World').toContain('World');

    // Arrays
    expect(['apple', 'banana', 'orange']).toContain('banana');
    expect(['apple', 'banana']).toHaveLength(2);
  });
});
