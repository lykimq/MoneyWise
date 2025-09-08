/**
 * Secure HTTP Client for MoneyWise API
 *
 * Provides a secure, validated HTTP client with proper error handling,
 * timeout management, and request retry logic.
 *
 * Security Features:
 * - URL validation and sanitization
 * - Environment-based configuration
 * - Request timeout protection
 * - Retry logic with exponential backoff
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
        // Validate configuration on instantiation
        if (!validateApiConfig()) {
            throw new Error('Invalid API configuration detected');
        }

        this.baseUrl = baseUrl || apiConfig.baseUrl;
        this.timeout = apiConfig.timeout;
        this.retryAttempts = apiConfig.retryAttempts;
        this.retryDelay = apiConfig.retryDelay;
    }

    /**
     * Perform a secure JSON HTTP request against the backend API with retry logic.
     *
     * Security Features:
     * - URL validation and sanitization
     * - Request timeout protection
     * - Retry logic with exponential backoff
     * - Rate limiting protection
     * - CSRF protection
     * - Proper error handling and logging
     *
     * @param endpoint - Path under `/api` (e.g., `/budgets`, `/budgets/overview`)
     * @param options - Fetch options; `Content-Type: application/json` is added by default
     * @returns Parsed JSON typed as T
     * @throws Error if request fails after all retry attempts or is rate limited
     */
    /**
     * Sanitizes endpoint to prevent path traversal and injection attacks
     */
    private sanitizeEndpoint(endpoint: string): string {
        const sanitized = sanitizeForUrl(endpoint);
        // Ensure endpoint starts with /
        return sanitized.startsWith('/') ? sanitized : `/${sanitized}`;
    }

    /**
     * Validates that a URL is safe to use
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
     * Determines if a request should be retried based on the error
     */
    private shouldRetry(error: any): boolean {
        // Retry on network errors, timeouts, and 5xx server errors
        if (error.name === 'AbortError') return true; // Timeout
        if (error.message?.includes('Network request failed')) return true; // Network error
        if (error.message?.includes('5')) return true; // 5xx server errors
        return false;
    }

    /**
     * Gets CSRF headers for state-changing requests
     */
    private async getCSRFHeaders(method?: string): Promise<Record<string, string>> {
        // Only add CSRF protection for state-changing methods
        if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
            try {
                return await csrfService.getHeaders();
            } catch (error) {
                // If CSRF fails, continue without it (better than blocking the request)
                console.warn('CSRF token retrieval failed:', error);
                return {};
            }
        }
        return {};
    }

    /**
     * Performs request with retry logic and timeout
     */
    private async requestWithRetry<T>(url: string, options: RequestInit, attempt: number = 1): Promise<T> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            // Get CSRF headers for POST/PUT/DELETE requests
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
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            // Retry logic for network errors and timeouts
            if (attempt < this.retryAttempts && this.shouldRetry(error)) {
                const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.requestWithRetry<T>(url, options, attempt + 1);
            }

            throw error;
        }
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Check rate limiting before making the request
        const rateLimitStatus = getRateLimitStatus(endpoint);
        if (!rateLimitStatus.isAllowed) {
            throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(rateLimitStatus.timeUntilReset / 1000)} seconds.`);
        }

        // Sanitize endpoint to prevent path traversal attacks
        const sanitizedEndpoint = this.sanitizeEndpoint(endpoint);
        const url = `${this.baseUrl}${sanitizedEndpoint}`;

        // Validate URL before making request
        if (!this.isValidUrl(url)) {
            throw new Error(`Invalid URL constructed: ${url}`);
        }

        return this.requestWithRetry<T>(url, options);
    }
}

export const httpClient = new HttpClient();
