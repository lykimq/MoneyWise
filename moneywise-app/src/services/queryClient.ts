/**
 * TanStack Query Configuration for MoneyWise App
 *
 * EDUCATIONAL OVERVIEW:
 * TanStack Query (formerly React Query) is a powerful data-fetching library
 * that provides:
 *
 * 1. AUTOMATIC CACHING: Stores API responses and reuses them intelligently.
 * 2. BACKGROUND UPDATES: Refreshes data when the user returns to the app.
 * 3. ERROR HANDLING: Built-in retry logic and error boundaries.
 * 4. LOADING STATES: Automatic loading, error, and success states.
 * 5. OPTIMISTIC UPDATES: Updates the UI immediately, rolling back if needed.
 *
 * WHY TANSTACK QUERY OVER BASIC useEffect?
 * - Eliminates race conditions and memory leaks.
 * - Provides automatic request deduplication.
 * - Offers built-in caching with smart invalidation.
 * - Enhances user experience with background updates.
 * - Reduces boilerplate code.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * QUERY CLIENT CONFIGURATION
 *
 * These settings are optimized for a financial application like MoneyWise:
 *
 * staleTime: Defines how long data remains "fresh" before being considered
 * stale.
 * - Budget data does not change frequently, so 5 minutes is reasonable.
 * - Reduces unnecessary API calls while keeping data reasonably fresh.
 *
 * gcTime: Determines how long unused data stays in memory.
 * - 10 minutes allows for quick navigation back to previously viewed screens.
 * - Balances memory usage with user experience.
 *
 * retry: Specifies how many times to retry failed requests.
 * - Financial data is critical, so retrying 3 times is appropriate.
 * - Uses exponential backoff (1s, 2s, 4s delays) for retries.
 *
 * refetchOnWindowFocus: Controls whether data refreshes when the user
 * returns to the app.
 * - Important for financial apps to display current data.
 * - Especially useful in React Native when the app comes to the foreground.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // DATA FRESHNESS CONFIGURATION
            staleTime: 5 * 60 * 1000, // 5 minutes - budget data is not frequently updated.

            // CACHE MANAGEMENT
            gcTime: 10 * 60 * 1000, // 10 minutes - keeps unused data in memory.

            // ERROR HANDLING & RELIABILITY
            retry: (failureCount, error) => {
                // Does not retry on client errors (4xx), but retries on server errors (5xx).
                if (error && typeof error === 'object' && 'status' in error) {
                    const status = error.status as number;
                    if (status >= 400 && status < 500) {
                        return false; // Does not retry client errors.
                    }
                }
                return failureCount < 3; // Retries up to 3 times for other errors.
            },

            // BACKGROUND UPDATES
            refetchOnWindowFocus: true,  // Refreshes when the user returns to the app.
            refetchOnReconnect: true,    // Refreshes when the internet reconnects.

            // LOADING STATES
            refetchOnMount: true,        // Always fetches fresh data on component mount.

            // NETWORK OPTIMIZATION
            networkMode: 'online',       // Only fetches when online.
        },
        mutations: {
            // MUTATION ERROR HANDLING
            retry: 1, // Only retries mutations once to avoid duplicate transactions.

            // NETWORK OPTIMIZATION
            networkMode: 'online',
        },
    },
});

/**
 * QUERY KEYS FACTORY
 *
 * EDUCATIONAL NOTE:
 * Query keys are used to identify and cache different queries. Think of them
 * as unique identifiers for your API calls.
 *
 * BEST PRACTICES:
 * 1. Use arrays for hierarchical keys: ['budgets', 'overview', { month, year }].
 * 2. Include all parameters that affect the result.
 * 3. Use consistent naming conventions.
 *
 * WHY THIS PATTERN?
 * - Provides type-safety with TypeScript.
 * - Ensures consistency across the application.
 * - Easy to extend when new queries are needed.
 */
export const queryKeys = {
    // BUDGET-RELATED QUERIES
    budgets: {
        // Budget overview data (used by the useBudgetOverview hook).
        overview: (params: { month?: string; year?: string; currency?: string }) =>
            ['budgets', 'overview', params] as const,

        // Complete budget data with categories and insights (used by useBudgetData hook).
        data: (params: { timePeriod: string; month?: string; year?: string; currency?: string }) =>
            ['budgets', 'data', params] as const,
    },
} as const;
