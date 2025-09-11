/**
 * Custom hook for managing and displaying rate limit status
 *
 * This hook provides real-time rate limit information for API endpoints,
 * including remaining requests, countdown timers, and user-friendly messages.
 * It uses TanStack Query for safe and efficient data synchronization.
 */

import { useQuery } from '@tanstack/react-query';
import { getRateLimitStatus, rateLimitConfigs, getRateLimiter } from '../services/rateLimiter';

interface RateLimitStatus {
    isAllowed: boolean;
    remainingRequests: number;
    timeUntilReset: number;
    userStatus: string;
}

interface UseRateLimitStatusResult extends RateLimitStatus {
    formattedTimeUntilReset: string;
    isLimited: boolean;
    maxRequests: number;
    hasRecentActivity: boolean;
}

/**
 * Format milliseconds into a human-readable duration string
 */
const formatTimeUntilReset = (ms: number): string => {
    if (ms === 0) return '';
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Hook for tracking and displaying rate limit status for an endpoint
 *
 * Uses TanStack Query for safe and efficient data fetching with automatic
 * background updates and cache management. Only updates status when there
 * is recent activity.
 *
 * @param endpoint - The API endpoint to monitor
 * @param updateInterval - Optional interval (ms) to update status (default: 1000ms)
 * @returns Rate limit status information and formatted display values
 */
export const useRateLimitStatus = (
    endpoint: string,
    updateInterval: number = 1000
): UseRateLimitStatusResult => {
    // Get the appropriate rate limiter and config for this endpoint
    const limiter = getRateLimiter(endpoint);
    const config = endpoint.includes('/budgets')
        ? rateLimitConfigs.budget
        : rateLimitConfigs.general;

    // Query key includes both endpoint and interval for proper cache management
    const queryKey = ['rateLimitStatus', endpoint, updateInterval];

    // Use TanStack Query for safe data fetching and caching
    const { data: status = getRateLimitStatus(endpoint) } = useQuery({
        queryKey,
        queryFn: () => getRateLimitStatus(endpoint),
        // Only poll if there's recent activity
        refetchInterval: limiter.hasRecentActivity(endpoint) ? updateInterval : false,
        // Prevent unnecessary background refetches
        staleTime: updateInterval / 2,
        // Don't refetch on window focus since we're already polling when needed
        refetchOnWindowFocus: false,
        // Ensure we always have initial data
        initialData: getRateLimitStatus(endpoint),
        // Cache configuration
        gcTime: updateInterval * 2,
    });

    return {
        ...status,
        formattedTimeUntilReset: formatTimeUntilReset(status.timeUntilReset),
        isLimited: !status.isAllowed,
        maxRequests: config.maxRequests,
        hasRecentActivity: limiter.hasRecentActivity(endpoint)
    };
};