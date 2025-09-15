/**
 * Unit Tests for HttpClient Service
 *
 * Tests HTTP client functionality in isolation with mocked dependencies.
 * Verifies URL validation, rate limiting, retry logic, and error handling.
 */

import { HttpClient } from '../http';

// Mock external dependencies to isolate HttpClient behavior
jest.mock('../../config/api', () => {
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


jest.mock('../rateLimiter', () => ({
  getRateLimiter: jest.fn().mockReturnValue({
    isAllowed: jest.fn().mockReturnValue(true),
    getTimeUntilReset: jest.fn().mockReturnValue(0),
  }),
}));

// Main test suite for HttpClient class
describe('HttpClient', () => {
  let httpClient: HttpClient;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    httpClient = new HttpClient();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  // Tests HttpClient initialization and configuration validation
  describe('Constructor and Initialization', () => {
    it('should initialize with default baseUrl when not provided', async () => {
      const client = new HttpClient();
      expect(client).toBeDefined();
    });

    it('should throw error for invalid base URL', async () => {
      expect(() => new HttpClient('invalid-url')).toThrow(
        'Invalid base URL provided'
      );
    });

    it('should throw error when API config is invalid', () => {
      const { validateApiConfig } = require('../../config/api');
      (validateApiConfig as jest.Mock).mockReturnValueOnce(false);
      expect(() => new HttpClient()).toThrow(
        'Invalid API configuration detected'
      );
    });
  });

  // Tests URL sanitization and endpoint validation for security
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
      await expect(httpClient.request('')).rejects.toThrow(
        'Endpoint must be a non-empty string'
      );
    });
  });


  // Tests rate limiting to prevent API abuse
  describe('Rate Limiting', () => {
    it('should throw error when rate limited', async () => {
      const { getRateLimiter } = require('../rateLimiter');
      const mockLimiter = {
        isAllowed: jest.fn().mockReturnValue(false),
        getTimeUntilReset: jest.fn().mockReturnValue(5000),
      };
      (getRateLimiter as jest.Mock).mockReturnValueOnce(mockLimiter);

      await expect(httpClient.request('/test')).rejects.toThrow(
        'Rate limit exceeded'
      );
    });
  });

  // Tests retry logic for network failures and server errors
  describe('Request Retry Logic', () => {
    it('should retry on network failure', async () => {
      const networkError = new Error('Network request failed');
      global.fetch = jest
        .fn()
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

      global.fetch = jest
        .fn()
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
      global.fetch = jest
        .fn()
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

      await expect(httpClient.request('/test')).rejects.toThrow(
        'Network request failed'
      );
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  // Tests response parsing and error handling
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

      await expect(httpClient.request('/test')).rejects.toThrow(
        'API request failed: 404'
      );
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
