/**
 * Client-Side Rate Limiting Service
 *
 * Provides request throttling to prevent accidental API abuse and improve
 * application performance by limiting request frequency from the frontend.
 * Uses static configuration optimized for budget mobile application.
 *
 * SECURITY NOTE: This is client-side only and does not provide security against
 * malicious actors. Backend rate limiting is essential for API protection.
 */

// Static configuration for budget operations - simple and reliable
// IMPORTANT: These limits MUST match the backend rate limiting configuration
// Backend: 30 requests per minute for BudgetModification (see backend/src/rate_limiter/types.rs)
// Backend: 60-second window (see backend/src/rate_limiter/types.rs)
const BUDGET_RATE_LIMIT_CONFIG = {
    maxRequests: 30, // Matches backend TransactionType::BudgetModification.get_limit()
    windowMs: 60000, // 1 minute - matches backend TransactionType::BudgetModification.get_window_seconds()
    keyPrefix: "budget_modification"
};

interface RequestRecord {
    timestamp: number;
}

/**
 * Manages rate limiting for API endpoints with automatic memory cleanup.
 * Uses static configuration for simplicity and reliability.
 */
class RateLimiter {
    private requests: Map<string, RequestRecord[]> = new Map();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.startCleanupTimer();
    }

    /**
     * Checks if a request is allowed and records it if permitted.
     * Automatically cleans up old records to prevent memory leaks.
     *
     * @param endpoint - The API endpoint being requested
     * @returns boolean - True if request is allowed, false if rate limited
     */
    isAllowed(endpoint: string): boolean {
        this.cleanup();

        const { validRequests, now } = this.getValidRequests(endpoint);

        if (validRequests.length >= BUDGET_RATE_LIMIT_CONFIG.maxRequests) {
            return false;
        }

        validRequests.push({ timestamp: now });
        this.requests.set(this.getKey(endpoint), validRequests);
        return true;
    }

    /**
     * Gets the time until the next request is allowed for an endpoint.
     * Used by http.ts to show user-friendly error messages.
     *
     * @param endpoint - The API endpoint
     * @returns number - Milliseconds until next request allowed, or 0 if allowed now
     */
    getTimeUntilReset(endpoint: string): number {
        const { validRequests } = this.getValidRequests(endpoint);

        if (validRequests.length < BUDGET_RATE_LIMIT_CONFIG.maxRequests) {
            return 0;
        }

        const oldestRequest = Math.min(...validRequests.map(req => req.timestamp));
        return Math.max(0, (oldestRequest + BUDGET_RATE_LIMIT_CONFIG.windowMs) - Date.now());
    }

    /**
     * Common logic to get valid requests for an endpoint.
     * Filters out expired requests to prevent memory leaks.
     *
     * @param endpoint - The API endpoint
     * @returns Object with validRequests array and current timestamp
     */
    private getValidRequests(endpoint: string): { validRequests: RequestRecord[], now: number } {
        const key = this.getKey(endpoint);
        const now = Date.now();
        const windowStart = now - BUDGET_RATE_LIMIT_CONFIG.windowMs;

        const requests = this.requests.get(key) || [];
        const validRequests = requests.filter(req => req.timestamp > windowStart);

        return { validRequests, now };
    }

    /**
     * Cleans up old request records to prevent memory leaks.
     * Called automatically every 5 minutes and before each request.
     */
    private cleanup(): void {
        const now = Date.now();
        // Use 2-minute cleanup window to handle edge cases
        const cleanupWindow = 2 * 60 * 1000; // 2 minutes
        const windowStart = now - cleanupWindow;

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
     * Called when the rate limiter is no longer needed.
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.requests.clear();
    }

    /**
     * Generates a unique key for the endpoint.
     *
     * @param endpoint - The API endpoint
     * @returns Unique key for rate limiting purposes
     */
    private getKey(endpoint: string): string {
        return `${BUDGET_RATE_LIMIT_CONFIG.keyPrefix}:${endpoint}`;
    }

}

/**
 * Rate limiter instance for budget operations.
 */
const budgetRateLimiter = new RateLimiter();

/**
 * Get the appropriate rate limiter for an endpoint.
 * All endpoints currently use the same budget rate limiter.
 *
 * @param endpoint - The API endpoint path
 * @returns RateLimiter instance for the endpoint type
 */
export const getRateLimiter = (endpoint: string): RateLimiter => {
    // TODO: Implement specific rate limiters for different endpoint types
    // - User management endpoints (registration, profile)
    // - Reporting endpoints (analytics, exports)
    // - Settings endpoints (configuration, preferences)
    // All endpoints currently use the same budget rate limiter
    //
    // NOTE: When adding new rate limiters, ensure they match backend limits:
    // - Backend rate limits are defined in backend/src/rate_limiter/types.rs
    // - Backend headers are set in backend/src/rate_limiter/middleware.rs
    return budgetRateLimiter;
};

/**
 * Collection of all rate limiters for cleanup purposes.
 */
export const rateLimiters = {
    budget: budgetRateLimiter
};


