/**
 * Secure HTTP client with error handling, timeout management, and retry logic.
 */
import { apiConfig, validateApiConfig } from '../config/api';
import { getRateLimiter } from './rateLimiter';
import { sanitizeForUrl } from '../utils/sanitization';
import { Platform, AppState } from 'react-native';
import { rateLimiters } from './rateLimiter';

export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private cleanupListener: any;

  constructor(baseUrl?: string) {
    if (!validateApiConfig()) {
      throw new Error('Invalid API configuration detected.');
    }

    this.baseUrl = baseUrl || apiConfig.baseUrl;

    if (baseUrl && !this.isValidUrl(baseUrl)) {
      throw new Error(`Invalid base URL provided: ${baseUrl}`);
    }

    this.timeout = apiConfig.timeout;
    this.retryAttempts = apiConfig.retryAttempts;
    this.retryDelay = apiConfig.retryDelay;

    // Setup auto-cleanup based on platform
    if (Platform.OS === 'web') {
      this.cleanupListener = this.cleanupRateLimiter.bind(this);
    } else {
      this.cleanupListener = (nextAppState: string) => {
        if (nextAppState === 'background') {
          this.cleanupRateLimiter();
        }
      };
      AppState.addEventListener('change', this.cleanupListener);
    }
  }

  /**
   * Sanitizes the endpoint to prevent path traversal and injection attacks.
   */
  private sanitizeEndpoint(endpoint: string): string {
    const sanitized = sanitizeForUrl(endpoint);
    // Ensure endpoint starts with '/'
    return sanitized.startsWith('/') ? sanitized : `/${sanitized}`;
  }

  /**
   * Validates that a URL is safe for HTTP requests.
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
   * Determines if a request should be retried based on the error.
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error.name === 'AbortError') return true;
    if (error.message?.includes('Network request failed')) return true;

    // Check for 5xx server errors
    if (error.message?.includes('API request failed:')) {
      const statusMatch = error.message.match(/API request failed: (\d{3})/);
      if (statusMatch) {
        const statusCode = parseInt(statusMatch[1], 10);
        return statusCode >= 500 && statusCode < 600;
      }
    }

    return false;
  }


  /**
   * Performs an HTTP request with retry logic and timeout protection.
   */
  private async requestWithRetry<T>(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ` + `${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      // Apply retry logic for network errors and timeouts
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.requestWithRetry<T>(url, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Initiates a secure JSON HTTP request to the backend API.
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Endpoint must be a non-empty string');
    }

    // Check rate limiting
    const limiter = getRateLimiter(endpoint);
    if (!limiter.isAllowed(endpoint)) {
      const timeUntilReset = limiter.getTimeUntilReset(endpoint);
      const seconds = Math.ceil(timeUntilReset / 1000);
      throw new Error(`Rate limit exceeded. Try again in ${seconds} seconds`);
    }

    // Sanitize endpoint and construct URL
    const sanitizedEndpoint = this.sanitizeEndpoint(endpoint);
    const url = `${this.baseUrl}${sanitizedEndpoint}`;

    if (!this.isValidUrl(url)) {
      throw new Error(`Invalid URL constructed: ${url}`);
    }

    return this.requestWithRetry<T>(url, options);
  }

  /**
   * Cleanup method to prevent memory leaks by destroying rate limiters.
   */
  public cleanupRateLimiter(): void {
    if (Platform.OS === 'web') {
      window.removeEventListener('beforeunload', this.cleanupListener);
    }

    Object.values(rateLimiters).forEach((limiter: any) => limiter.destroy());
  }
}

// Singleton instance of the HttpClient
export const httpClient = new HttpClient();
