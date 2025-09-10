import {
    sanitizeString,
    sanitizeForUrl,
    sanitizeNumber,
    sanitizeObject
} from '../sanitization';
import fc from 'fast-check';

/**
 * Property-based Tests for Sanitization Functions
 *
 * Uses fast-check to verify invariants across random inputs.
 * Tests that sanitization functions maintain certain properties regardless of input.
 */

// Property-based tests using fast-check to verify invariants across random inputs
describe('Sanitization Properties', () => {
    it('sanitizeString should never return undefined or null', () => {
        fc.assert(
            fc.property(fc.string(), (input: string) => {
                const result = sanitizeString(input);
                return typeof result === 'string';
            })
        );
    });

    it('sanitizeNumber should always return a safe number or 0', () => {
        fc.assert(
            fc.property(fc.oneof(fc.string(), fc.double()), (input: string | number) => {
                const result = sanitizeNumber(input);
                return (
                    typeof result === 'number' &&
                    !isNaN(result) &&
                    isFinite(result) &&
                    Math.abs(result) <= Number.MAX_SAFE_INTEGER
                );
            })
        );
    });

    it('sanitizeForUrl should always return a valid URL-safe string', () => {
        fc.assert(
            fc.property(fc.webUrl(), (input: string) => {
                const result = sanitizeForUrl(input);
                return (
                    typeof result === 'string' &&
                    !result.includes('<') &&
                    !result.includes('>') &&
                    !result.includes('javascript:')
                );
            })
        );
    });

    it('sanitizeObject should maintain object structure while sanitizing values', () => {
        const arbitraryObject = fc.object({
            maxDepth: 2,
            values: [fc.string(), fc.integer(), fc.boolean()]
        });

        fc.assert(
            fc.property(arbitraryObject, (input: Record<string, unknown>) => {
                const result = sanitizeObject(input);
                return (
                    result !== null &&
                    typeof result === 'object' &&
                    Object.keys(result).length <= Object.keys(input).length
                );
            })
        );
    });
});
