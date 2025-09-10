/**
 * Unit Tests for HttpClient Service
 *
 * Purpose:
 * These tests verify the HttpClient implementation in isolation, ensuring it correctly
 * handles HTTP requests, security measures, error cases, and retry logic without making
 * actual network calls.
 *
 * Test Type: Unit Tests
 * - Tests individual components in isolation
 * - Uses mocks for all external dependencies
 * - No real network calls or side effects
 * - Fast and deterministic execution
 *
 * Key Areas Tested:
 * 1. URL Validation & Sanitization
 * 2. CSRF Protection
 * 3. Rate Limiting
 * 4. Request Retry Logic
 * 5. Error Handling
 * 6. Response Processing
 */

import { HttpClient } from '../services/http';
import { csrfService } from '../services/csrf';
import { getRateLimitStatus } from '../services/rateLimiter';

// Mock Dependencies
// We mock all external services to isolate HttpClient behavior and avoid real network calls
jest.mock('../config/api', () => {
    const mockValidateApiConfig = jest.fn().mockReturnValue(true);
    return {
        apiConfig: {
            baseUrl: 'https://api.moneywise.com',
            timeout: 5000,
            retryAttempts: 3,
            retryDelay: 1000,
        },
        validateApiConfig: mockValidateApiConfig,
    };
});

jest.mock('../services/csrf', () => ({
    csrfService: {
        getHeaders: jest.fn().mockResolvedValue({ 'X-CSRF-Token': 'test-token' }),
    },
}));

jest.mock('../services/rateLimiter', () => ({
    getRateLimitStatus: jest.fn().mockReturnValue({ isAllowed: true, timeUntilReset: 0 }),
}));

/**
 * Main test suite for HttpClient class
 * Groups all related test suites that verify different aspects of the HTTP client
 */
describe('HttpClient', () => {
    let httpClient: HttpClient;
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
        // Store the original fetch
        originalFetch = global.fetch;

        // Create a new instance for each test
        httpClient = new HttpClient();

        // Mock fetch globally
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data: 'test' }),
        });
    });

    afterEach(() => {
        // Restore the original fetch
        global.fetch = originalFetch;
        jest.clearAllMocks();
    });

    /**
     * Test Suite: Constructor and Initialization
     * Purpose: Verify that the HttpClient is properly initialized and validates its configuration
     *
     * Why these tests:
     * - Ensure proper initialization prevents invalid configurations from being used
     * - Validate URL safety checks are working
     * - Confirm configuration validation is enforced
     */
    describe('Constructor and Initialization', () => {
        it('should initialize with default baseUrl when not provided', async () => {
            const client = new HttpClient();
            expect(client).toBeDefined();
        });

        it('should throw error for invalid base URL', async () => {
            expect(() => new HttpClient('invalid-url')).toThrow('Invalid base URL provided');
        });

        it('should throw error when API config is invalid', () => {
            const { validateApiConfig } = require('../config/api');
            (validateApiConfig as jest.Mock).mockReturnValueOnce(false);
            expect(() => new HttpClient()).toThrow('Invalid API configuration detected');
        });
    });

    /**
     * Test Suite: URL and Endpoint Handling
     * Purpose: Verify that URLs and endpoints are properly sanitized and validated
     *
     * Why these tests:
     * - Prevent security vulnerabilities from malformed URLs
     * - Ensure consistent URL formatting
     * - Protect against path traversal attacks
     * - Validate endpoint requirements
     */
    describe('URL and Endpoint Handling', () => {
        it('should properly sanitize endpoints', async () => {
            await httpClient.request('/test-endpoint');
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.moneywise.com/test-endpoint',
                expect.any(Object)
            );
        });

        it('should add leading slash to endpoints when missing', async () => {
            await httpClient.request('test-endpoint');
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.moneywise.com/test-endpoint',
                expect.any(Object)
            );
        });

        it('should throw error for invalid endpoints', async () => {
            await expect(httpClient.request('')).rejects.toThrow('Endpoint must be a non-empty string');
        });
    });

    /**
     * Test Suite: CSRF Protection
     * Purpose: Verify Cross-Site Request Forgery (CSRF) protection mechanisms
     *
     * Why these tests:
     * - Critical security feature to prevent CSRF attacks
     * - Ensure CSRF tokens are properly included in state-changing requests
     * - Verify graceful handling of CSRF service failures
     * - Confirm CSRF protection is only applied to appropriate HTTP methods
     */
    describe('CSRF Protection', () => {
        it('should include CSRF headers for POST requests', async () => {
            await httpClient.request('/test', { method: 'POST' });
            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-CSRF-Token': 'test-token',
                    }),
                })
            );
        });

        it('should not include CSRF headers for GET requests', async () => {
            await httpClient.request('/test', { method: 'GET' });
            expect(csrfService.getHeaders).not.toHaveBeenCalled();
        });

        it('should continue request if CSRF service fails', async () => {
            (csrfService.getHeaders as jest.Mock).mockRejectedValueOnce(new Error('CSRF Error'));
            const response = await httpClient.request('/test', { method: 'POST' });
            expect(response).toBeDefined();
        });
    });

    /**
     * Test Suite: Rate Limiting
     * Purpose: Verify rate limiting protection to prevent API abuse
     *
     * Why these tests:
     * - Protect backend services from excessive requests
     * - Ensure proper error handling when limits are exceeded
     * - Verify rate limit status checking
     */
    describe('Rate Limiting', () => {
        it('should throw error when rate limited', async () => {
            (getRateLimitStatus as jest.Mock).mockReturnValueOnce({
                isAllowed: false,
                timeUntilReset: 5000,
            });

            await expect(httpClient.request('/test')).rejects.toThrow('Rate limit exceeded');
        });
    });

    /**
     * Test Suite: Request Retry Logic
     * Purpose: Verify automatic retry behavior for transient failures
     *
     * Why these tests:
     * - Ensure resilience against temporary network issues
     * - Verify exponential backoff retry strategy
     * - Confirm proper handling of different error types
     * - Validate maximum retry attempts enforcement
     */
    describe('Request Retry Logic', () => {
        it('should retry on network failure', async () => {
            const networkError = new Error('Network request failed');
            global.fetch = jest.fn()
                .mockRejectedValueOnce(networkError)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ data: 'test' }),
                });

            const result = await httpClient.request('/test');
            expect(result).toEqual({ data: 'test' });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should retry on timeout', async () => {
            const abortError = new Error('AbortError');
            abortError.name = 'AbortError';

            global.fetch = jest.fn()
                .mockRejectedValueOnce(abortError)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ data: 'test' }),
                });

            const result = await httpClient.request('/test');
            expect(result).toEqual({ data: 'test' });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should retry on 500 server errors', async () => {
            global.fetch = jest.fn()
                .mockResolvedValueOnce({
                    ok: false,
                    status: 500,
                    statusText: 'Internal Server Error',
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ data: 'test' }),
                });

            const result = await httpClient.request('/test');
            expect(result).toEqual({ data: 'test' });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should give up after maximum retry attempts', async () => {
            const networkError = new Error('Network request failed');
            global.fetch = jest.fn().mockRejectedValue(networkError);

            await expect(httpClient.request('/test')).rejects.toThrow('Network request failed');
            expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });
    });

    /**
     * Test Suite: Response Handling
     * Purpose: Verify proper handling of different API response types
     *
     * Why these tests:
     * - Ensure correct parsing of successful responses
     * - Verify proper error handling for failed requests
     * - Validate handling of malformed responses
     * - Confirm appropriate error messages for different scenarios
     */
    describe('Response Handling', () => {
        it('should handle successful JSON response', async () => {
            const testData = { message: 'success' };
            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(testData),
            });

            const result = await httpClient.request('/test');
            expect(result).toEqual(testData);
        });

        it('should throw error for non-OK response', async () => {
            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            await expect(httpClient.request('/test')).rejects.toThrow('API request failed: 404');
        });

        it('should handle malformed JSON response', async () => {
            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.reject(new Error('Invalid JSON')),
            });

            await expect(httpClient.request('/test')).rejects.toThrow('Invalid JSON');
        });
    });
});
