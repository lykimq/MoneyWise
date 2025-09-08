/**
 * Secure API Configuration
 *
 * Centralized configuration for API endpoints with proper security validation.
 * This replaces hardcoded URLs with environment-based configuration and validation.
 */

import { Platform } from 'react-native';

/**
 * Validates that a URL is secure and properly formatted
 * @param url - The URL to validate
 * @returns True if the URL is valid and secure
 */
const isValidApiUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);

        // Only allow HTTPS in production, HTTP allowed in development
        const isSecure = urlObj.protocol === 'https:' ||
            (urlObj.protocol === 'http:' && __DEV__);

        // Must be a valid hostname
        const hasValidHost = urlObj.hostname.length > 0 &&
            !urlObj.hostname.includes('..') && // Prevent directory traversal
            !urlObj.hostname.includes(' ');    // No spaces in hostname

        return isSecure && hasValidHost;
    } catch {
        return false;
    }
};

/**
 * Gets the default API URL based on platform and environment
 * @returns A secure default URL for the current platform
 */
const getDefaultApiUrl = (): string => {
    if (__DEV__) {
        // Development URLs - safe for local development
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:3000/api'; // Android emulator
        }
        return 'http://localhost:3000/api'; // iOS simulator and web
    }

    // Production should always use HTTPS
    throw new Error('EXPO_PUBLIC_API_BASE_URL must be set in production');
};

/**
 * Gets the API base URL with proper validation and security checks
 * @returns A validated, secure API base URL
 */
export const getApiBaseUrl = (): string => {
    const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    // If environment variable is provided, validate it
    if (envUrl && envUrl.length > 0) {
        if (!isValidApiUrl(envUrl)) {
            throw new Error(`Invalid API URL in EXPO_PUBLIC_API_BASE_URL: ${envUrl}`);
        }
        return envUrl;
    }

    // Fall back to default for development
    if (__DEV__) {
        return getDefaultApiUrl();
    }

    // Production requires environment variable
    throw new Error('EXPO_PUBLIC_API_BASE_URL environment variable is required in production');
};

/**
 * API configuration object with validation
 */
export const apiConfig = {
    baseUrl: getApiBaseUrl(),
    timeout: 10000, // 10 second timeout
    retryAttempts: 3,
    retryDelay: 1000, // 1 second base delay
} as const;

/**
 * Validates the current API configuration
 * @returns True if configuration is valid
 */
export const validateApiConfig = (): boolean => {
    try {
        return isValidApiUrl(apiConfig.baseUrl);
    } catch {
        return false;
    }
};
