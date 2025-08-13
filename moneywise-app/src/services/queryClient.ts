/**
 * TanStack Query Configuration for MoneyWise App
 *
 * EDUCATIONAL OVERVIEW:
 * TanStack Query (formerly React Query) is a powerful data-fetching library that provides:
 *
 * 1. AUTOMATIC CACHING: Stores API responses and reuses them intelligently
 * 2. BACKGROUND UPDATES: Refreshes data when user returns to app
 * 3. ERROR HANDLING: Built-in retry logic and error boundaries
 * 4. LOADING STATES: Automatic loading, error, and success states
 * 5. OPTIMISTIC UPDATES: Update UI immediately, rollback if needed
 *
 * WHY TANSTACK QUERY OVER BASIC useEffect?
 * - No more race conditions or memory leaks
 * - Automatic request deduplication
 * - Built-in caching with smart invalidation
 * - Better user experience with background updates
 * - Less boilerplate code
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * QUERY CLIENT CONFIGURATION
 *
 * These settings are optimized for a financial app like MoneyWise:
 *
 * staleTime: How long data stays "fresh" before considered stale
 * - Budget data doesn't change frequently, so 5 minutes is reasonable
 * - Reduces unnecessary API calls while keeping data reasonably fresh
 *
 * cacheTime: How long unused data stays in memory
 * - 10 minutes allows quick navigation back to screens
 * - Balances memory usage with user experience
 *
 * retry: How many times to retry failed requests
 * - Financial data is important, so retry 3 times
 * - Uses exponential backoff (1s, 2s, 4s delays)
 *
 * refetchOnWindowFocus: Refresh data when user returns to app
 * - Important for financial apps to show current data
 * - Especially useful in React Native when app comes to foreground
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // DATA FRESHNESS CONFIGURATION
            staleTime: 5 * 60 * 1000, // 5 minutes - budget data doesn't change frequently

            // CACHE MANAGEMENT
            gcTime: 10 * 60 * 1000, // 10 minutes - keep unused data in memory

            // ERROR HANDLING & RELIABILITY
            retry: (failureCount, error) => {
                // Don't retry on client errors (4xx), but retry on server errors (5xx)
                if (error && typeof error === 'object' && 'status' in error) {
                    const status = error.status as number;
                    if (status >= 400 && status < 500) {
                        return false; // Don't retry client errors
                    }
                }
                return failureCount < 3; // Retry up to 3 times for other errors
            },

            // BACKGROUND UPDATES
            refetchOnWindowFocus: true,  // Refresh when user returns to app
            refetchOnReconnect: true,    // Refresh when internet reconnects

            // LOADING STATES
            refetchOnMount: true,        // Always fetch fresh data on component mount

            // NETWORK OPTIMIZATION
            networkMode: 'online',       // Only fetch when online
        },
        mutations: {
            // MUTATION ERROR HANDLING
            retry: 1, // Only retry mutations once to avoid duplicate transactions

            // NETWORK OPTIMIZATION
            networkMode: 'online',
        },
    },
});

/**
 * QUERY KEYS FACTORY
 *
 * EDUCATIONAL NOTE:
 * Query keys are used to identify and cache different queries.
 * Think of them as unique identifiers for your API calls.
 *
 * BEST PRACTICES:
 * 1. Use arrays for hierarchical keys: ['budgets', 'overview', { month, year }]
 * 2. Include all parameters that affect the result
 * 3. Use consistent naming conventions
 *
 * WHY THIS PATTERN?
 * - Type-safe with TypeScript
 * - Consistent across the app
 * - Easy to extend when needed
 */
export const queryKeys = {
    // BUDGET-RELATED QUERIES
    budgets: {
        // Budget overview data (used by useBudgetOverview hook)
        overview: (params: { month?: string; year?: string; currency?: string }) =>
            ['budgets', 'overview', params] as const,

        // Complete budget data with categories and insights (used by useBudgetData hook)
        data: (params: { timePeriod: string; month?: string; year?: string; currency?: string }) =>
            ['budgets', 'data', params] as const,
    },
} as const;
