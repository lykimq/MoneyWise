/**
 * Client-Side Rate Limiting Service
 *
 * This service provides client-side request throttling to prevent accidental
 * API abuse and improve application performance by limiting the frequency of
 * requests from the frontend.
 *
 * IMPORTANT SECURITY NOTE:
 * This is a CLIENT-SIDE rate limiter and DOES NOT provide security against
 * malicious actors. Malicious users can bypass client-side controls. For
 * robust security, a comprehensive BACKEND RATE LIMITER is essential to
 * protect the API from denial-of-service attacks, brute-force attempts, and
 * other forms of abuse.
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (endpoint: string) => string;
}

interface RequestRecord {
    timestamp: number;
    count: number;
}

/**
 * Manages rate limiting for specific endpoints based on a configured window
 * and maximum requests. This helps in preventing excessive requests from the
 * client, improving user experience and reducing load on the backend from
 * legitimate, but overly frequent, actions.
 */
class RateLimiter {
    private requests: Map<string, RequestRecord[]> = new Map();
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    /**
     * Checks if a request is allowed based on rate limiting rules.
     * @param endpoint - The API endpoint being requested.
     * @returns True if the request is allowed, false if rate limited.
     */
    isAllowed(endpoint: string): boolean {
        const key = this.getKey(endpoint);
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        // Retrieves existing requests for this endpoint.
        let requests = this.requests.get(key) || [];

        // Removes old requests that are outside the current window.
        requests = requests.filter(req => req.timestamp > windowStart);

        // Checks if the number of requests is within the rate limit.
        if (requests.length >= this.config.maxRequests) {
            return false;
        }

        // Adds the new request to the record.
        requests.push({ timestamp: now, count: 1 });
        this.requests.set(key, requests);

        return true;
    }

    /**
     * Gets the time until the next request is allowed for a given endpoint.
     * @param endpoint - The API endpoint.
     * @returns Milliseconds until the next request is allowed, or 0 if allowed now.
     */
    getTimeUntilReset(endpoint: string): number {
        const key = this.getKey(endpoint);
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        const requests = this.requests.get(key) || [];
        const validRequests = requests.filter(req => req.timestamp > windowStart);

        if (validRequests.length < this.config.maxRequests) {
            return 0; // Request is allowed immediately.
        }

        // Finds the timestamp of the oldest request within the current window.
        const oldestRequest = Math.min(...validRequests.map(req => req.timestamp));
        return (oldestRequest + this.config.windowMs) - now;
    }

    /**
     * Gets the number of remaining requests allowed in the current window.
     * @param endpoint - The API endpoint.
     * @returns The number of remaining requests allowed.
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
     * Generates a unique key for the endpoint, which can be customized.
     * @param endpoint - The API endpoint.
     * @returns A unique key for rate limiting purposes.
     */
    private getKey(endpoint: string): string {
        if (this.config.keyGenerator) {
            return this.config.keyGenerator(endpoint);
        }
        return endpoint;
    }
}

export const rateLimitConfigs = {
    // Budget data requests - allows for more frequent updates.
    budget: {
        maxRequests: 30, // 30 requests.
        windowMs: 60 * 1000, // Per minute.
        keyGenerator: (endpoint: string) => `budget:${endpoint}`,
    },

    // General API requests - more conservative rate limiting.
    general: {
        maxRequests: 60, // 60 requests.
        windowMs: 60 * 1000, // Per minute.
        keyGenerator: (endpoint: string) => `general:${endpoint}`,
    },

} as const;

/**
 * Rate limiter instances for different request types.
 */
export const rateLimiters = {
    budget: new RateLimiter(rateLimitConfigs.budget),
    general: new RateLimiter(rateLimitConfigs.general),
};

/**
 * Determines which rate limiter to use based on the provided endpoint.
 * @param endpoint - The API endpoint.
 * @returns The appropriate `RateLimiter` instance.
 */
export const getRateLimiter = (endpoint: string): RateLimiter => {
    if (endpoint.includes('/budgets') || endpoint.includes('/budget')) {
        return rateLimiters.budget;
    }
    return rateLimiters.general;
};

/**
 * Utility function to check rate limit status without making a request.
 * @param endpoint - The API endpoint.
 * @returns An object containing rate limit status information.
 */
export const getRateLimitStatus = (endpoint: string) => {
    const limiter = getRateLimiter(endpoint);
    return {
        isAllowed: limiter.isAllowed(endpoint),
        remainingRequests: limiter.getRemainingRequests(endpoint),
        timeUntilReset: limiter.getTimeUntilReset(endpoint),
    };
};
