/**
 * Input sanitization utilities to prevent XSS attacks and ensure safe data handling.
 */

/**
 * Removes dangerous characters and HTML tags from input strings.
 */
export const sanitizeString = (
  input: string | number | undefined | null
): string => {
  if (input === null || input === undefined) return '';

  let str = String(input);

  // Remove dangerous HTML elements and event handlers
  str = str.replace(/<script\b[^>]*>.*?<\/script>/gi, '');
  str = str.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  str = str.replace(/\s*(on\w+)\s*=\s*["']?[^"']*["']?/gi, '');
  str = str.replace(/<[^>]+>/g, '');
  str = str.replace(/javascript:/gi, '');

  str = str.trim();

  return str;
};

/**
 * Sanitizes input for safe URL usage by removing path traversal and dangerous protocols.
 */
export const sanitizeForUrl = (
  input: string | number | undefined | null
): string => {
  if (input === null || input === undefined) return '';

  let str = String(input);

  // Decode URI components to catch encoded malicious content
  try {
    str = decodeURIComponent(str);
  } catch (e) {
    console.warn('Failed to decode URI component in sanitizeForUrl:', e);
  }

  // Remove path traversal patterns (../, ..\, and encoded variants)
  str = str.replace(/\.+\.\//g, '/');
  str = str.replace(/\.+\.\\/g, '/');
  str = str.replace(/\.+\.%2f/gi, '/');
  str = str.replace(/\.+\.%5c/gi, '/');
  str = str.replace(/\.+\.%252f/gi, '/');
  str = str.replace(/\.+\.%255c/gi, '/');
  str = str.replace(/^\.+\.\//, '/');
  str = str.replace(/^\.+\.\\/, '/');

  // Normalize slashes and keep URL-safe characters
  str = str.replace(/([^:])\/+/g, '$1/');
  str = str.replace(/[^a-zA-Z0-9\-_.:/?=&%+\s]/g, '');
  str = str.replace(/javascript:/gi, '');

  str = str.trim();

  return str;
};

/**
 * Validates and sanitizes numeric input for safe calculations.
 */
export const sanitizeNumber = (
  input: string | number | undefined | null
): number => {
  if (input === null || input === undefined) return 0;

  const strInput = String(input).trim();

  if (typeof input === 'number') {
    const num = input;
    if (isNaN(num) || !isFinite(num) || Math.abs(num) > Number.MAX_SAFE_INTEGER)
      return 0;
    return num;
  }

  // Validate string contains only valid numeric characters
  if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(strInput)) {
    return 0;
  }

  const num = parseFloat(strInput);
  // Ensure number is valid and within safe range
  if (isNaN(num) || !isFinite(num) || Math.abs(num) > Number.MAX_SAFE_INTEGER) {
    return 0;
  }

  return num;
};

/**
 * Recursively sanitizes objects by applying string/number sanitization to all values.
 */
export const sanitizeObject = (input: any): any => {
  if (input === null || input === undefined) return null;

  if (typeof input === 'string') {
    // Convert numeric strings to numbers, otherwise sanitize as string
    if (/^-?\d+(\.\d+)?$/.test(input.trim())) {
      return sanitizeNumber(input);
    }
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
      // Sanitize object keys by removing dangerous characters
      const sanitizedKey = key
        .replace(/<[^>]+>|[<>]/g, '')
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/[^\w\-_.]/g, '')
        .trim();
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeObject(value);
      }
    }
    return sanitized;
  }

  return input;
};
