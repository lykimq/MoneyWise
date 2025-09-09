/**
 * Secure HTTP Client for MoneyWise API
 *
 * Provides a secure, validated HTTP client with proper error handling,
 * timeout management, and request retry logic for the MoneyWise API.
 *
 * Security Features:
 * - URL validation and sanitization.
 * - Environment-based configuration.
 * - Request timeout protection.
 * - Retry logic with exponential backoff.
 */
import { apiConfig, validateApiConfig } from '../config/api';
import { csrfService } from './csrf';
import { getRateLimitStatus } from './rateLimiter';
import { sanitizeForUrl } from '../utils/sanitization';

export class HttpClient {
    private baseUrl: string;
    private timeout: number;
    private retryAttempts: number;
    private retryDelay: number;

    constructor(baseUrl?: string) {
        // Validates API configuration upon instantiation.
        if (!validateApiConfig()) {
            throw new Error('Invalid API configuration detected.');
        }

        this.baseUrl = baseUrl || apiConfig.baseUrl;
        this.timeout = apiConfig.timeout;
        this.retryAttempts = apiConfig.retryAttempts;
        this.retryDelay = apiConfig.retryDelay;
    }

    /**
     * Sanitizes the endpoint to prevent path traversal and injection attacks.
     * @param endpoint - The API endpoint path.
     * @returns The sanitized endpoint string.
     */
    private sanitizeEndpoint(endpoint: string): string {
        const sanitized = sanitizeForUrl(endpoint);
        // Ensures the endpoint starts with a '/'.
        return sanitized.startsWith('/') ? sanitized : `/${sanitized}`;
    }

    /**
     * Validates that a given URL is safe to use for HTTP requests.
     * @param url - The URL to validate.
     * @returns True if the URL uses 'http:' or 'https:' protocol, false otherwise.
     */
    private isValidUrl(url: string): boolean {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }

    /**
     * Determines if a request should be retried based on the encountered error.
     * @param error - The error object.
     * @returns True if the request should be retried, false otherwise.
     */
    private shouldRetry(error: any): boolean {
        // Retries on network errors, timeouts, and 5xx server errors.
        if (error.name === 'AbortError') return true; // Timeout.
        if (error.message?.includes('Network request failed')) return true; // Network error.
        if (error.message?.includes('5')) return true; // 5xx server errors.
        return false;
    }

    /**
     * Retrieves CSRF headers for state-changing requests (POST, PUT, DELETE, PATCH).
     * @param method - The HTTP method of the request.
     * @returns A promise that resolves to a record of CSRF headers.
     */
    private async getCSRFHeaders(method?: string): Promise<Record<string, string>> {
        // Only adds CSRF protection for state-changing methods.
        if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
            try {
                return await csrfService.getHeaders();
            } catch (error) {
                // If CSRF token retrieval fails, proceeds without it.
                console.warn('CSRF token retrieval failed:', error);
                return {};
            }
        }
        return {};
    }

    /**
     * Performs an HTTP request with retry logic and timeout protection.
     * @param url - The full URL for the request.
     * @param options - Fetch options. `Content-Type: application/json` is added.
     * @param attempt - The current retry attempt number (defaults to 1).
     * @returns A promise that resolves to the parsed JSON response of type T.
     * @throws Error if the request fails after all retry attempts.
     */
    private async requestWithRetry<T>(url: string, options: RequestInit, attempt: number = 1): Promise<T> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            // Retrieves CSRF headers for applicable request methods.
            const csrfHeaders = await this.getCSRFHeaders(options.method);

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...csrfHeaders,
                    ...(options.headers || {})
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ` +
                    `${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            // Applies retry logic for network errors and timeouts.
            if (attempt < this.retryAttempts && this.shouldRetry(error)) {
                const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff.
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.requestWithRetry<T>(url, options, attempt + 1);
            }

            throw error;
        }
    }

    /**
     * Initiates a secure JSON HTTP request to the backend API.
     * @param endpoint - The API endpoint path (e.g., `/budgets`).
     * @param options - Optional fetch options.
     * @returns A promise that resolves to the parsed JSON response of type T.
     * @throws Error if the request fails after all retry attempts or is rate-limited.
     */
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Checks rate limiting status before proceeding with the request.
        const rateLimitStatus = getRateLimitStatus(endpoint);
        if (!rateLimitStatus.isAllowed) {
            throw new Error(`Rate limit exceeded. Try again in ` +
                `${Math.ceil(rateLimitStatus.timeUntilReset / 1000)} seconds.`);
        }

        // Sanitizes the endpoint to prevent path traversal attacks.
        const sanitizedEndpoint = this.sanitizeEndpoint(endpoint);
        const url = `${this.baseUrl}${sanitizedEndpoint}`;

        // Validates the constructed URL before making the request.
        if (!this.isValidUrl(url)) {
            throw new Error(`Invalid URL constructed: ${url}`);
        }

        return this.requestWithRetry<T>(url, options);
    }
}

// Exports a singleton instance of the HttpClient.
export const httpClient = new HttpClient();
