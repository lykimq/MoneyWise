/**
 * Demo Integration Test
 *
 * Simple test to verify Jest configuration is working
 */

describe('Demo Integration Test', () => {
    it('should run basic test successfully', () => {
        expect(1 + 1).toBe(2);
    });

    it('should handle async operations', async () => {
        const result = await Promise.resolve('test');
        expect(result).toBe('test');
    });
});
