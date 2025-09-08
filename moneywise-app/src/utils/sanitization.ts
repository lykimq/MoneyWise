/**
 * Input Sanitization Utilities
 *
 * Provides secure input sanitization functions to prevent XSS attacks
 * and ensure safe string interpolation throughout the application.
 */

/**
 * Sanitizes a string by removing potentially dangerous characters
 * @param input - The string to sanitize
 * @returns A sanitized string safe for display
 */
export const sanitizeString = (input: string | number | undefined | null): string => {
    if (input === null || input === undefined) return '';

    const str = String(input);

    // Remove potentially dangerous characters
    return str
        .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
        .replace(/script/gi, '') // Remove script tags
        .replace(/iframe/gi, '') // Remove iframe tags
        .trim();
};

/**
 * Sanitizes a string for use in URLs or API endpoints
 * @param input - The string to sanitize
 * @returns A sanitized string safe for URL usage
 */
export const sanitizeForUrl = (input: string | number | undefined | null): string => {
    if (input === null || input === undefined) return '';

    const str = String(input);

    // Remove dangerous characters and encode special characters
    return str
        .replace(/[^a-zA-Z0-9\-_/?=&]/g, '') // Keep alphanumeric, hyphens, underscores, slashes, question marks, equals, and ampersands
        .replace(/\.\./g, '') // Remove path traversal attempts
        .replace(/\/+/g, '/') // Collapse multiple slashes
        .trim();
};

/**
 * Sanitizes a string for display in UI components
 * @param input - The string to sanitize
 * @returns A sanitized string safe for UI display
 */
/**
 * Sanitizes a number for safe mathematical operations
 * @param input - The input to sanitize
 * @returns A safe number or 0 if invalid
 */
export const sanitizeNumber = (input: string | number | undefined | null): number => {
    if (input === null || input === undefined) return 0;

    const num = typeof input === 'number' ? input : parseFloat(String(input));

    // Check for valid number and reasonable range
    if (isNaN(num) || !isFinite(num)) return 0;
    if (Math.abs(num) > Number.MAX_SAFE_INTEGER) return 0;

    return num;
};

/**
 * Sanitizes an object for safe JSON serialization
 * @param input - The object to sanitize
 * @returns A sanitized object safe for JSON operations
 */
export const sanitizeObject = (input: any): any => {
    if (input === null || input === undefined) return null;

    if (typeof input === 'string') {
        return sanitizeString(input);
    }

    if (typeof input === 'number') {
        return sanitizeNumber(input);
    }

    if (Array.isArray(input)) {
        return input.map(sanitizeObject);
    }

    if (typeof input === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(input)) {
            const sanitizedKey = sanitizeString(key);
            if (sanitizedKey) {
                sanitized[sanitizedKey] = sanitizeObject(value);
            }
        }
        return sanitized;
    }

    return input;
};
