/**
 * Client-Side Rate Limiting Service
 *
 * Provides request throttling to prevent accidental API abuse and improve
 * application performance by limiting request frequency from the frontend.
 *
 * SECURITY NOTE: This is client-side only and does not provide security against
 * malicious actors. Backend rate limiting is essential for API protection.
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (endpoint: string) => string;
}

interface RequestRecord {
    timestamp: number;
}

/**
 * Manages rate limiting for API endpoints with automatic memory cleanup
 * and comprehensive error handling to prevent memory leaks and improve reliability.
 */
class RateLimiter {
    private requests: Map<string, RequestRecord[]> = new Map();
    private config: RateLimitConfig;
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(config: RateLimitConfig) {
        this.config = config;
        this.startCleanupTimer();
    }

    /**
     * Checks if a request is allowed and records it if permitted.
     * Automatically cleans up old records to prevent memory leaks.
     *
     * @param endpoint - The API endpoint being requested
     * @returns True if request is allowed, false if rate limited
     */
    isAllowed(endpoint: string): boolean {
        this.cleanup();

        const key = this.getKey(endpoint);
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        const requests = this.requests.get(key) || [];
        const validRequests = requests.filter(req => req.timestamp > windowStart);

        if (validRequests.length >= this.config.maxRequests) {
            return false;
        }

        validRequests.push({ timestamp: now });
        this.requests.set(key, validRequests);
        return true;
    }

    /**
     * Gets the time until the next request is allowed for an endpoint.
     *
     * @param endpoint - The API endpoint
     * @returns Milliseconds until next request allowed, or 0 if allowed now
     */
    getTimeUntilReset(endpoint: string): number {
        const key = this.getKey(endpoint);
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        const requests = this.requests.get(key) || [];
        const validRequests = requests.filter(req => req.timestamp > windowStart);

        if (validRequests.length < this.config.maxRequests) {
            return 0;
        }

        const oldestRequest = Math.min(...validRequests.map(req => req.timestamp));
        return Math.max(0, (oldestRequest + this.config.windowMs) - now);
    }

    /**
     * Gets the number of remaining requests allowed in the current window.
     *
     * @param endpoint - The API endpoint
     * @returns Number of remaining requests allowed
     */
    getRemainingRequests(endpoint: string): number {
        const key = this.getKey(endpoint);
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        const requests = this.requests.get(key) || [];
        const validRequests = requests.filter(req => req.timestamp > windowStart);

        return Math.max(0, this.config.maxRequests - validRequests.length);
    }

    /**
     * Gets user-friendly status information for an endpoint.
     *
     * @param endpoint - The API endpoint
     * @returns User-friendly status message
     */
    getUserStatus(endpoint: string): string {
        const remaining = this.getRemainingRequests(endpoint);
        const timeUntilReset = this.getTimeUntilReset(endpoint);

        if (remaining > 0) {
            return `Requests remaining: ${remaining}`;
        }

        const seconds = Math.ceil(timeUntilReset / 1000);
        return `Rate limit exceeded. Try again in ${seconds} seconds`;
    }

    /**
     * Cleans up old request records to prevent memory leaks.
     * Called automatically every 5 minutes and before each request.
     */
    private cleanup(): void {
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        for (const [key, requests] of this.requests.entries()) {
            const validRequests = requests.filter(req => req.timestamp > windowStart);
            if (validRequests.length === 0) {
                this.requests.delete(key);
            } else {
                this.requests.set(key, validRequests);
            }
        }
    }

    /**
     * Starts automatic cleanup timer to prevent memory leaks.
     * Runs cleanup every 5 minutes to remove old request records.
     */
    private startCleanupTimer(): void {
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Stops the cleanup timer and cleans up resources.
     * Should be called when the rate limiter is no longer needed.
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.requests.clear();
    }

    /**
     * Generates a unique key for the endpoint using the configured key generator.
     *
     * @param endpoint - The API endpoint
     * @returns Unique key for rate limiting purposes
     */
    private getKey(endpoint: string): string {
        return this.config.keyGenerator ? this.config.keyGenerator(endpoint) : endpoint;
    }


}

/**
 * Rate limiting configurations for different types of API operations.
 *
 * Two separate rate limit configurations are defined:
 * 1. Budget Modification Operations (30 req/min):
 *    - Lower limit because budget operations are more resource-intensive
 *    - Applies to all /budgets endpoints
 *    - Example: fetching budget overviews, updating budget items
 *
 * 2. Query Operations (60 req/min):
 *    - Higher limit for standard API operations
 *    - Applies to all non-budget related endpoints
 *    - Example: user settings, general app operations
 *
 * Each configuration includes:
 * - maxRequests: Maximum number of requests allowed in the time window
 * - windowMs: Time window in milliseconds (both use 1-minute windows)
 * - keyGenerator: Function to create unique keys for rate limit tracking
 */
export const rateLimitConfigs = {
    budgetModification: {
        maxRequests: 30,    // 30 requests per minute for budget operations
        windowMs: 60 * 1000, // 1 minute window
        keyGenerator: (endpoint: string) => `budget_modification:${endpoint}`, // Prefixes budget endpoints for tracking
    },
    query: {
        maxRequests: 60,    // 60 requests per minute for general operations
        windowMs: 60 * 1000, // 1 minute window
        keyGenerator: (endpoint: string) => `query:${endpoint}`, // Prefixes general endpoints for tracking
    },
} as const;

/**
 * Rate limiter instances for different request types.
 * Each instance manages its own request history and cleanup.
 */
export const rateLimiters = {
    budgetModification: new RateLimiter(rateLimitConfigs.budgetModification),
    query: new RateLimiter(rateLimitConfigs.query),
};

/**
 * Determines which rate limiter to use based on the endpoint path.
 *
 * This function routes requests to the appropriate rate limiter:
 * - Budget endpoints (/budgets): 30 requests/minute limit (budgetModification)
 * - All other endpoints: 60 requests/minute limit (query)
 *
 * Example routing:
 * - /budgets/overview → budgetModification rate limiter (30 req/min)
 * - /budgets/123 → budgetModification rate limiter (30 req/min)
 * - /settings → query rate limiter (60 req/min)
 * - /user-budgets → query rate limiter (60 req/min) - NOT a budget endpoint
 *
 * @param endpoint - The API endpoint path
 * @returns The appropriate RateLimiter instance
 */
export const getRateLimiter = (endpoint: string): RateLimiter => {
    // Use regex to match exact budget endpoints: /budgets followed by / or end of string
    // This prevents false positives like /user-budgets or /my-budgets
    // Note: This matches the backend regex pattern in middleware.rs
    const budgetEndpointRegex = /^\/budgets(\/|$)/;

    // Route to budgetModification rate limiter (30 req/min) for budget-related endpoints
    if (budgetEndpointRegex.test(endpoint)) {
        return rateLimiters.budgetModification;
    }
    // All other endpoints use query rate limiter (60 req/min)
    return rateLimiters.query;
};


