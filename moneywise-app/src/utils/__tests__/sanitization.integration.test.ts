import {
    sanitizeString,
    sanitizeForUrl,
    sanitizeNumber,
    sanitizeObject
} from '../sanitization';
import fc from 'fast-check';

/**
 * Test suite for sanitizeString function
 *
 * This function is critical for preventing XSS attacks by removing dangerous HTML elements
 * while preserving safe text content. It's used throughout the app to sanitize user input
 * before displaying it in UI components.
 */
describe('sanitizeString', () => {
    it('should handle null and undefined inputs', async () => {
        // Prevents runtime errors when sanitizing potentially missing data
        // Ensures graceful handling of null/undefined values from APIs or user input
        expect(sanitizeString(null)).toBe('');
        expect(sanitizeString(undefined)).toBe('');
    });

    it('should remove script tags completely', () => {
        // Script tags can execute malicious JavaScript and should be completely removed
        // Tests that <script> tags and their content are stripped for security
        const input = '<script>alert("test")</script>';
        expect(sanitizeString(input)).toBe('');

        const complexInput = 'Hello <script type="text/javascript">console.log("world")</script>!';
        expect(sanitizeString(complexInput)).toBe('Hello !');
    });

    it('should remove iframe tags completely', () => {
        // iframes can load external malicious content and are generally unsafe for user content
        // Tests that iframe elements are completely removed, including their content
        const input = 'Before <iframe src="http://malicious.com"></iframe> After';
        expect(sanitizeString(input)).toBe('Before  After');
    });

    it('should remove event handlers and their values', () => {
        // Event handlers like onclick can execute malicious code when triggered
        // Tests that event handler attributes are stripped completely for security
        const input = '<div onclick="maliciousFunction()">Click me</div>';
        expect(sanitizeString(input)).toBe('Click me');
    });

    it('should remove various event handlers', () => {
        // Different event handlers can all execute malicious code
        // Tests that various event handler types are properly removed
        const input = '<div onload="evil()" onerror="bad()" onmouseover="attack()">Content</div>';
        expect(sanitizeString(input)).toBe('Content');

        const input2 = '<img onload="malicious()" onerror="hack()" src="test.jpg">';
        expect(sanitizeString(input2)).toBe('');
    });

    it('should handle nested HTML and multiple sanitization needs', () => {
        // Real-world malicious input often contains multiple attack vectors combined
        // Tests complex sanitization scenarios with nested dangerous elements
        const input = `
            <div onclick="alert('test')">
                <script>console.log("nested")</script>
                <iframe src="evil.com"></iframe>
                <p>Safe content</p>
            </div>
        `;
        const result = sanitizeString(input);
        expect(result.includes('Safe content')).toBe(true);
        expect(result.includes('<script>')).toBe(false);
        expect(result.includes('<iframe')).toBe(false);
        expect(result.includes('<div')).toBe(false);
    });

    it('should remove javascript: protocol', () => {
        // javascript: URLs can execute code when clicked, even in sanitized content
        // Tests that javascript: protocol is stripped while preserving the rest
        const input = 'javascript:alert(1)';
        expect(sanitizeString(input)).toBe('alert(1)');
    });
});

/**
 * Test suite for sanitizeForUrl function
 *
 * This function prevents URL-based attacks like path traversal and protocol injection.
 * It's used when constructing API endpoints or handling user-provided URLs to ensure
 * they're safe for network requests and don't expose sensitive system files.
 */
describe('sanitizeForUrl', () => {
    it('should handle null and undefined inputs', () => {
        // Prevents runtime errors when building URLs from potentially missing data
        // Ensures graceful handling of null/undefined values in URL construction
        expect(sanitizeForUrl(null)).toBe('');
        expect(sanitizeForUrl(undefined)).toBe('');
    });

    it('should prevent path traversal attacks', () => {
        // Path traversal (../../../) can access sensitive system files outside the app directory
        // Tests that directory traversal sequences are neutralized while preserving valid paths
        expect(sanitizeForUrl('../../../etc/passwd')).toBe('//etc/passwd');
        expect(sanitizeForUrl('safe/../../malicious')).toBe('safe/malicious');
    });

    it('should handle encoded malicious content', () => {
        // Attackers often encode malicious content to bypass basic filters
        // Tests that URL-encoded dangerous content is properly decoded and sanitized
        const encoded = encodeURIComponent('javascript:alert(1)');
        expect(sanitizeForUrl(encoded)).not.toContain('javascript:');
    });

    it('should preserve valid URL components', () => {
        // Legitimate URLs should remain functional after sanitization
        // Tests that valid URL structures (protocol, domain, path, query params) are preserved
        const validUrl = 'https://api.example.com/path?param=value&other=123';
        expect(sanitizeForUrl(validUrl)).toBe(validUrl);
    });

    it('should normalize multiple slashes', () => {
        // Multiple slashes can cause routing issues and are often used in attacks
        // Tests that consecutive slashes are normalized to single slashes
        expect(sanitizeForUrl('https://example.com////path')).toBe('https://example.com/path');
        expect(sanitizeForUrl('path///to///resource')).toBe('path/to/resource');
    });

    it('should remove unsafe characters while keeping URL-safe ones', () => {
        // HTML tags and special characters can break URL parsing or introduce security issues
        // Tests that dangerous characters are removed while preserving URL-safe characters
        const input = 'https://api.example.com/<script>alert(1)</script>/path';
        expect(sanitizeForUrl(input)).toBe('https://api.example.com/scriptalert1/script/path');
    });
});

/**
 * Test suite for sanitizeNumber function
 *
 * This function ensures numeric inputs are safe for mathematical operations and prevents
 * issues like NaN propagation, infinite values, or unsafe integer ranges that could break
 * calculations or cause security vulnerabilities in financial calculations.
 */
describe('sanitizeNumber', () => {
    it('should handle null and undefined inputs', () => {
        // Prevents runtime errors when performing calculations with potentially missing data
        // Ensures null/undefined values default to 0 for safe mathematical operations
        expect(sanitizeNumber(null)).toBe(0);
        expect(sanitizeNumber(undefined)).toBe(0);
    });

    it('should handle valid number inputs', () => {
        // Valid numbers should pass through unchanged for legitimate calculations
        // Tests that proper numeric values (integers, negatives, decimals) are preserved
        expect(sanitizeNumber(123)).toBe(123);
        expect(sanitizeNumber(-456)).toBe(-456);
        expect(sanitizeNumber(123.456)).toBe(123.456);
    });

    it('should handle valid numeric strings', () => {
        // User input often comes as strings that need to be converted to numbers safely
        // Tests that string representations of numbers are properly converted
        expect(sanitizeNumber('123')).toBe(123);
        expect(sanitizeNumber('-456')).toBe(-456);
        expect(sanitizeNumber('123.456')).toBe(123.456);
    });

    it('should handle invalid numeric inputs', () => {
        // Invalid numeric input could cause NaN propagation or calculation errors
        // Tests that non-numeric strings default to 0 to prevent calculation failures
        expect(sanitizeNumber('abc')).toBe(0);
        expect(sanitizeNumber('123abc')).toBe(0);
        expect(sanitizeNumber('12.34.56')).toBe(0);
    });

    it('should handle edge cases', () => {
        // Extreme values can cause overflow, precision loss, or infinite loops in calculations
        // Tests boundary conditions like MAX_SAFE_INTEGER, Infinity, and NaN
        expect(sanitizeNumber(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER);
        expect(sanitizeNumber(Number.MAX_SAFE_INTEGER + 1)).toBe(0);
        expect(sanitizeNumber(Infinity)).toBe(0);
        expect(sanitizeNumber(NaN)).toBe(0);
    });

    it('should handle whitespace in string numbers', () => {
        // User input often contains leading/trailing whitespace that should be ignored
        // Tests that whitespace is properly trimmed before numeric conversion
        expect(sanitizeNumber('  123  ')).toBe(123);
        expect(sanitizeNumber('  -456.789  ')).toBe(-456.789);
    });

    it('should handle scientific notation', () => {
        // Scientific notation is a valid number format that should be supported
        // Tests that scientific notation strings are properly converted to numbers
        expect(sanitizeNumber('1e5')).toBe(100000);
        expect(sanitizeNumber('1.5e-3')).toBe(0.0015);
        expect(sanitizeNumber('2E+4')).toBe(20000);
        expect(sanitizeNumber('-3.2e-2')).toBe(-0.032);
    });
});

/**
 * Test suite for sanitizeObject function
 *
 * This function recursively sanitizes complex data structures (objects, arrays) by applying
 * appropriate sanitization to each value based on its type. It's crucial for cleaning API
 * responses and user input before storing or displaying data throughout the application.
 */
describe('sanitizeObject', () => {
    it('should handle null and undefined inputs', () => {
        // Prevents runtime errors when sanitizing potentially missing data structures
        // Ensures null/undefined values are handled gracefully without throwing errors
        expect(sanitizeObject(null)).toBeNull();
        expect(sanitizeObject(undefined)).toBeNull();
    });

    it('should sanitize nested objects', () => {
        // API responses and user data often contain nested structures with mixed content types
        // Tests recursive sanitization of nested objects with different data types
        const input = {
            name: '<script>alert("name")</script>John',
            age: '25',
            profile: {
                bio: '<div onclick="evil()">Bio text</div>',
                website: 'javascript:alert(1)',
                score: '123.456'
            }
        };

        const expected = {
            name: 'John',
            age: 25,
            profile: {
                bio: 'Bio text',
                website: 'alert(1)',
                score: 123.456
            }
        };

        expect(sanitizeObject(input)).toEqual(expected);
    });

    it('should handle arrays', () => {
        // Arrays can contain mixed content types that all need individual sanitization
        // Tests that array elements are sanitized while preserving array structure
        const input = [
            '<script>alert(1)</script>',
            123,
            { text: '<div>Hello</div>' }
        ];

        const expected = [
            '',
            123,
            { text: 'Hello' }
        ];

        expect(sanitizeObject(input)).toEqual(expected);
    });

    it('should sanitize object keys', () => {
        // Object keys can contain malicious content that could cause issues during iteration
        // Tests that object keys are sanitized while preserving the key-value relationships
        const input = {
            '<script>key</script>': 'value',
            'normal_key': '<div>value</div>'
        };

        const expected = {
            'key': 'value',
            'normal_key': 'value'
        };

        expect(sanitizeObject(input)).toEqual(expected);
    });

    it('should handle mixed types correctly', () => {
        // Real-world data structures often contain mixed types requiring different sanitization
        // Tests complex scenarios with strings, numbers, arrays, and nested objects
        const input = {
            string: 'Hello <script>World</script>',
            number: '123.456',
            array: ['<div>Item</div>', 789],
            nested: {
                text: '<p onclick="evil()">Text</p>',
                score: '456'
            }
        };

        const expected = {
            string: 'Hello',
            number: 123.456,
            array: ['Item', 789],
            nested: {
                text: 'Text',
                score: 456
            }
        };

        expect(sanitizeObject(input)).toEqual(expected);
    });
});

/**
 * Property-based tests using fast-check
 *
 * These tests use property-based testing to verify that sanitization functions maintain
 * certain invariants across a wide range of inputs. This helps catch edge cases and
 * ensures the functions behave correctly with unexpected or malformed data.
 */
describe('Sanitization Properties', () => {
    it('sanitizeString should never return undefined or null', () => {
        // String sanitization should always return a valid string to prevent downstream errors
        // Tests that any string input produces a valid string output (never undefined/null)
        fc.assert(
            fc.property(fc.string(), (input: string) => {
                const result = sanitizeString(input);
                return typeof result === 'string';
            })
        );
    });

    it('sanitizeNumber should always return a safe number or 0', () => {
        // Numeric sanitization must prevent NaN, Infinity, or unsafe integer values
        // Tests that any input produces a finite, safe number within JavaScript's safe range
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
        // URL sanitization must prevent dangerous protocols and characters
        // Tests that any URL input produces a string without dangerous HTML or protocols
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
        // Object sanitization must preserve structure while cleaning content
        // Tests that object structure is maintained and no new keys are added during sanitization
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