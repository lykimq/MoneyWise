/**
 * Secure API configuration with environment-based URL validation.
 */

import { Platform } from 'react-native';

/**
 * Validates URL security and format.
 */
const isValidApiUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);

    // Only allow HTTPS in production, HTTP in development
    const isSecure =
      urlObj.protocol === 'https:' || (urlObj.protocol === 'http:' && __DEV__);

    // Validate hostname without directory traversal or spaces
    const hasValidHost =
      urlObj.hostname.length > 0 &&
      !urlObj.hostname.includes('..') &&
      !urlObj.hostname.includes(' ');

    return isSecure && hasValidHost;
  } catch {
    return false;
  }
};

/**
 * Gets default API URL based on platform and environment.
 */
const getDefaultApiUrl = (): string => {
  if (__DEV__) {
    // Development URLs for local development
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
  }

  // Production requires environment variable
  throw new Error('EXPO_PUBLIC_API_BASE_URL must be set in production.');
};

/**
 * Gets validated API base URL with security checks.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Validate environment variable if provided
  if (envUrl && envUrl.length > 0) {
    if (!isValidApiUrl(envUrl)) {
      throw new Error(
        `Invalid API URL in EXPO_PUBLIC_API_BASE_URL: ${envUrl}.`
      );
    }
    return envUrl;
  }

  // Fallback to default for development
  if (__DEV__) {
    return getDefaultApiUrl();
  }

  // Production requires environment variable
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL environment variable is required in production.'
  );
};

/**
 * API configuration with timeout and retry settings.
 */
export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  timeout: 10000, // 10-second timeout
  retryAttempts: 3, // Retry failed requests
  retryDelay: 1000, // Base retry delay in ms
} as const;

/**
 * Validates current API configuration for security and functionality.
 */
export const validateApiConfig = (): boolean => {
  try {
    return isValidApiUrl(apiConfig.baseUrl);
  } catch {
    return false;
  }
};
