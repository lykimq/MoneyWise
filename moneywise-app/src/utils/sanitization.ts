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

    let str = String(input);

    // Extract content from script tags before removing them
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
        const content = match.replace(/<\/?script>/gi, '');
        return content;
    });

    // Remove iframe tags but keep content
    str = str.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Remove event handlers but keep their values
    str = str.replace(/\s(on\w+)=["']?([^"']*)["']?/gi, (_, __, value) => value);

    // Remove HTML tags but keep their content
    str = str.replace(/<[^>]+>/g, '');

    // Remove javascript: protocol but keep the rest
    str = str.replace(/javascript:/gi, '');

    str = str.trim();

    return str;
};

/**
 * Sanitizes a string for safe use in URLs or API endpoints.
 * @param input - The string to sanitize.
 * @returns A sanitized string safe for URL usage.
 */
export const sanitizeForUrl = (input: string | number | undefined | null): string => {
    if (input === null || input === undefined) return '';

    let str = String(input);

    // Decode URI components first to catch encoded malicious content
    try {
        str = decodeURIComponent(str);
    } catch (e) {
        console.warn('Failed to decode URI component in sanitizeForUrl:', e);
    }

    // Handle path traversal while preserving structure
    str = str.replace(/\/\.\.\/|\.\.\//g, '/');

    // Handle multiple slashes while preserving protocol
    str = str.replace(/([^:])\/+/g, '$1/');

    // Keep more URL-safe characters including encoded characters
    str = str.replace(/[^a-zA-Z0-9\-_.:/?=&%+\s]/g, '');

    // Remove javascript: protocol as a final check
    str = str.replace(/javascript:/gi, '');

    str = str.trim();

    return str;
};

/**
 * Sanitizes a number for safe mathematical operations.
 * @param input - The input to sanitize (string, number, undefined, or null).
 * @returns A safe number, or 0 if the input is invalid or out of range.
 */
export const sanitizeNumber = (input: string | number | undefined | null): number => {
    if (input === null || input === undefined) return 0;

    const strInput = String(input).trim();

    if (typeof input === 'number') {
        const num = input;
        if (isNaN(num) || !isFinite(num) || Math.abs(num) > Number.MAX_SAFE_INTEGER) return 0;
        return num;
    }

    // If it's a string, check if it contains only a valid number.
    if (!/^-?\d+(\.\d+)?$/.test(strInput)) {
        return 0; // Not a purely numeric string
    }

    const num = parseFloat(strInput);

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
        // If the string is purely numeric, sanitize it as a number
        if (/^-?\d+(\.\d+)?$/.test(input.trim())) {
            return sanitizeNumber(input);
        }
        // Otherwise, sanitize as a string
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
            // Sanitize key by removing HTML and dangerous characters
            const sanitizedKey = key.replace(/<[^>]+>|[<>]/g, '');
            if (sanitizedKey) {
                sanitized[sanitizedKey] = sanitizeObject(value);
            }
        }
        return sanitized;
    }

    return input;
};
