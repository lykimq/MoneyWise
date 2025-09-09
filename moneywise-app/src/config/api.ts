/**
 * Secure API Configuration
 *
 * Centralized configuration for API endpoints with proper security
 * validation. This replaces hardcoded URLs with environment-based
 * configuration and validation.
 */

import { Platform } from 'react-native';

/**
 * Validates that a URL is secure and properly formatted.
 * @param url - The URL to validate.
 * @returns True if the URL is valid and secure, false otherwise.
 */
const isValidApiUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);

        // Only allows HTTPS in production; HTTP is permitted in development.
        const isSecure = urlObj.protocol === 'https:' ||
            (urlObj.protocol === 'http:' && __DEV__);

        // Ensures a valid hostname without directory traversal attempts or spaces.
        const hasValidHost = urlObj.hostname.length > 0 &&
            !urlObj.hostname.includes('..') && // Prevents directory traversal.
            !urlObj.hostname.includes(' ');    // No spaces in the hostname.

        return isSecure && hasValidHost;
    } catch {
        return false;
    }
};

/**
 * Retrieves the default API URL based on the platform and environment.
 * @returns A secure default URL for the current platform.
 * @throws Error if in production and `EXPO_PUBLIC_API_BASE_URL` is not set.
 */
const getDefaultApiUrl = (): string => {
    if (__DEV__) {
        // Development URLs - safe for local development.
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:3000/api'; // Android emulator.
        }
        return 'http://localhost:3000/api'; // iOS simulator and web.
    }

    // Production environments must always use HTTPS and an environment variable.
    throw new Error('EXPO_PUBLIC_API_BASE_URL must be set in production.');
};

/**
 * Retrieves the API base URL with proper validation and security checks.
 * @returns A validated, secure API base URL.
 * @throws Error if the environment variable is invalid or missing in production.
 */
export const getApiBaseUrl = (): string => {
    const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    // If an environment variable is provided, validate it.
    if (envUrl && envUrl.length > 0) {
        if (!isValidApiUrl(envUrl)) {
            throw new Error(`Invalid API URL in EXPO_PUBLIC_API_BASE_URL: ${envUrl}.`);
        }
        return envUrl;
    }

    // Falls back to default for development environments.
    if (__DEV__) {
        return getDefaultApiUrl();
    }

    // Production environments require the environment variable to be set.
    throw new Error('EXPO_PUBLIC_API_BASE_URL environment variable is required in production.');
};

/**
 * API configuration object with predefined settings and validation.
 */
export const apiConfig = {
    baseUrl: getApiBaseUrl(),
    timeout: 10000, // 10-second timeout for API requests.
    retryAttempts: 3, // Number of times to retry failed API requests.
    retryDelay: 1000, // Base delay in milliseconds for retry attempts.
} as const;

/**
 * Validates the current API configuration to ensure it is secure and functional.
 * @returns True if the configuration is valid, false otherwise.
 */
export const validateApiConfig = (): boolean => {
    try {
        return isValidApiUrl(apiConfig.baseUrl);
    } catch {
        return false;
    }
};
