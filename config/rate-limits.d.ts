/**
 * Rate limit configuration type definitions
 * Auto-generated from rate-limits.json schema
 */

export interface RateLimitConfig {
    max_requests: number;
    window_seconds: number;
    description: string;
}

export interface RateLimitMetadata {
    last_updated: string;
    description: string;
}

export interface RateLimitsSchema {
    version: string;
    rate_limits: {
        [key: string]: RateLimitConfig;
    };
    metadata: RateLimitMetadata;
}

// Available rate limit types
export const RATE_LIMIT_TYPES = ['budget_modification', 'budget_read', 'budget_overview'] as const;
export type RateLimitType = typeof RATE_LIMIT_TYPES[number];