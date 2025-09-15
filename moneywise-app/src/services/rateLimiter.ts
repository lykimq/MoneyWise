/**
 * Client-side rate limiting service for request throttling and performance optimization.
 */

// Import generated rate limit configuration
import { RATE_LIMIT_CONFIGS } from './generated/rateLimits';

interface RequestRecord {
  timestamp: number;
}

/**
 * Rate limiter with automatic memory cleanup and static configuration.
 */
class RateLimiter {
  private requests: Map<string, RequestRecord[]> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
  }

  /**
   * Checks if a request is allowed and records it if permitted.
   */
  isAllowed(endpoint: string): boolean {
    this.cleanup();

    const config = this.getConfigForEndpoint(endpoint);
    const { validRequests, now } = this.getValidRequests(endpoint, config);

    if (validRequests.length >= config.maxRequests) {
      return false;
    }

    validRequests.push({ timestamp: now });
    this.requests.set(this.getKey(endpoint), validRequests);
    return true;
  }

  /**
   * Gets the time until the next request is allowed for an endpoint.
   */
  getTimeUntilReset(endpoint: string): number {
    const config = this.getConfigForEndpoint(endpoint);
    const { validRequests } = this.getValidRequests(endpoint, config);

    if (validRequests.length < config.maxRequests) {
      return 0;
    }

    const oldestRequest = Math.min(
      ...validRequests.map((req) => req.timestamp)
    );
    return Math.max(
      0,
      oldestRequest + config.windowMs - Date.now()
    );
  }

  /**
   * Gets valid requests for an endpoint, filtering out expired ones.
   */
  private getValidRequests(endpoint: string, config: typeof RATE_LIMIT_CONFIGS.budget_modification | typeof RATE_LIMIT_CONFIGS.budget_read | typeof RATE_LIMIT_CONFIGS.budget_overview): {
    validRequests: RequestRecord[];
    now: number;
  } {
    const key = this.getKey(endpoint);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter((req) => req.timestamp > windowStart);

    return { validRequests, now };
  }

  /**
   * Cleans up old request records to prevent memory leaks.
   */
  private cleanup(): void {
    const now = Date.now();
    // Use 2-minute cleanup window to handle edge cases
    const cleanupWindow = 2 * 60 * 1000; // 2 minutes
    const windowStart = now - cleanupWindow;

    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(
        (req) => req.timestamp > windowStart
      );
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }

  /**
   * Starts automatic cleanup timer to prevent memory leaks.
   */
  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    ); // 5 minutes
  }

  /**
   * Stops the cleanup timer and cleans up resources.
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.requests.clear();
  }

  /**
   * Determines the appropriate rate limit configuration for an endpoint.
   */
  private getConfigForEndpoint(endpoint: string): typeof RATE_LIMIT_CONFIGS.budget_modification | typeof RATE_LIMIT_CONFIGS.budget_read | typeof RATE_LIMIT_CONFIGS.budget_overview {
    if (endpoint.includes('/budgets/overview')) {
      return RATE_LIMIT_CONFIGS.budget_overview;
    } else if (endpoint.includes('/budgets') && (endpoint.includes('POST') || endpoint.includes('PUT'))) {
      return RATE_LIMIT_CONFIGS.budget_modification;
    } else if (endpoint.includes('/budgets')) {
      return RATE_LIMIT_CONFIGS.budget_read;
    } else {
      // Default to budget read for non-budget endpoints
      return RATE_LIMIT_CONFIGS.budget_read;
    }
  }

  /**
   * Generates a unique key for the endpoint.
   */
  private getKey(endpoint: string): string {
    const config = this.getConfigForEndpoint(endpoint);
    return `${config.keyPrefix}:${endpoint}`;
  }
}

/**
 * Rate limiter instance for budget operations.
 */
const budgetRateLimiter = new RateLimiter();

/**
 * Gets the appropriate rate limiter for an endpoint.
 */
export const getRateLimiter = (endpoint: string): RateLimiter => {
  // Rate limiter automatically determines configuration based on endpoint path
  return budgetRateLimiter;
};

/**
 * Collection of all rate limiters for cleanup purposes.
 */
export const rateLimiters = {
  budget: budgetRateLimiter,
};
