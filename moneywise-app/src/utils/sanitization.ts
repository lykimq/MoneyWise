/**
 * Input Sanitization Utilities
 *
 * Provides secure input sanitization functions to prevent XSS attacks and
 * ensure safe string interpolation throughout the application.
 */

/**
 * Sanitizes a string by removing potentially dangerous characters.
 * @param input - The string to sanitize.
 * @returns A sanitized string safe for display in UI components.
 */
export const sanitizeString = (input: string | number | undefined | null): string => {
    if (input === null || input === undefined) return '';

    const str = String(input);

    // Removes potentially dangerous characters to prevent injection attacks.
    return str
        .replace(/[<>]/g, '')         // Removes < and > to prevent HTML injection.
        .replace(/javascript:/gi, '') // Removes 'javascript:' protocol.
        .replace(/on\w+=/gi, '')      // Removes event handlers like 'onclick='.
        .replace(/script/gi, '')      // Removes 'script' tags.
        .replace(/iframe/gi, '')      // Removes 'iframe' tags.
        .trim();
};

/**
 * Sanitizes a string for safe use in URLs or API endpoints.
 * @param input - The string to sanitize.
 * @returns A sanitized string safe for URL usage.
 */
export const sanitizeForUrl = (input: string | number | undefined | null): string => {
    if (input === null || input === undefined) return '';

    const str = String(input);

    // Removes dangerous characters and encodes special characters for URLs.
    return str
        // Keeps alphanumeric, hyphens, underscores, slashes, question marks,
        // equals, and ampersands.
        .replace(/[^a-zA-Z0-9\-_/?=&]/g, '')
        .replace(/\.\./g, '') // Removes path traversal attempts (e.g., '..').
        .replace(/\/+/g, '/') // Collapses multiple slashes into a single slash.
        .trim();
};

/**
 * Sanitizes a number for safe mathematical operations.
 * @param input - The input to sanitize (string, number, undefined, or null).
 * @returns A safe number, or 0 if the input is invalid or out of range.
 */
export const sanitizeNumber = (input: string | number | undefined | null): number => {
    if (input === null || input === undefined) return 0;

    const num = typeof input === 'number' ? input : parseFloat(String(input));

    // Checks for a valid number and a reasonable range to prevent issues.
    if (isNaN(num) || !isFinite(num)) return 0;
    if (Math.abs(num) > Number.MAX_SAFE_INTEGER) return 0;

    return num;
};

/**
 * Recursively sanitizes an object for safe JSON serialization and display.
 * This function applies `sanitizeString` to string values and keys, and
 * `sanitizeNumber` to number values.
 * @param input - The object to sanitize.
 * @returns A sanitized object safe for JSON operations.
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
