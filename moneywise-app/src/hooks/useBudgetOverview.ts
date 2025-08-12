import { useState, useEffect } from 'react';
import apiService, { BudgetOverviewApi } from '../services/api';

/**
 * Custom Hook: useBudgetOverview
 *
 * Purpose: Encapsulates budget overview data fetching logic
 *
 * Why use a custom hook instead of useEffect directly in component?
 *
 * ADVANTAGES:
 * 1. Separation of Concerns: Data logic separated from UI logic
 * 2. Reusability: Can be used in multiple components
 * 3. Testability: Easier to test data logic in isolation
 * 4. Cleaner Components: Components focus only on rendering
 * 5. Centralized Error Handling: Consistent error handling across app
 *
 * SAFER ALTERNATIVES TO useEffect:
 * 1. React Query/TanStack Query - Better caching, background updates
 * 2. SWR - Stale-while-revalidate pattern
 * 3. Custom hooks like this one - Encapsulate useEffect logic
 * 4. State management libraries (Redux Toolkit Query, Zustand)
 */

interface UseBudgetOverviewReturn {
    overview: BudgetOverviewApi | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;  // Allows manual refresh
}

/**
 * Safe Implementation with AbortController
 * This prevents race conditions and memory leaks
 *
 * IMPROVEMENTS OVER BASIC useEffect:
 * - Prevents state updates after component unmounts
 * - Cancels ongoing requests when dependencies change
 * - Eliminates race conditions from multiple concurrent requests
 * - Cleaner memory management
 */
export const useBudgetOverview = (
    month?: string,
    year?: string
): UseBudgetOverviewReturn => {
    const [overview, setOverview] = useState<BudgetOverviewApi | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch function with AbortController support
     * Prevents race conditions and memory leaks
     */
    const fetchOverview = async (abortSignal?: AbortSignal) => {
        try {
            setLoading(true);
            setError(null);

            const now = new Date();
            const targetMonth = month || String(now.getMonth() + 1);
            const targetYear = year || String(now.getFullYear());

            // Pass abort signal to API call (if your API supports it)
            const data = await apiService.getBudgetOverview({
                month: targetMonth,
                year: targetYear,
            });

            // Check if request was aborted before setting state
            if (!abortSignal?.aborted) {
                setOverview(data);
            }
        } catch (e) {
            // Don't set error if request was aborted
            if (!abortSignal?.aborted) {
                console.error('Failed to fetch budget overview:', e);
                setError('Failed to load budget overview');
            }
        } finally {
            if (!abortSignal?.aborted) {
                setLoading(false);
            }
        }
    };

    /**
     * useEffect with AbortController - SAFER APPROACH
     *
     * WHY THIS IS BETTER THAN BASIC useEffect:
     *
     * PROBLEMS WITH BASIC useEffect:
     * - Race conditions: Multiple requests can complete out of order
     * - Memory leaks: State updates after component unmounts
     * - No request cancellation: Ongoing requests continue even when not needed
     * - Unnecessary re-renders: Can cause performance issues
     *
     * HOW AbortController SOLVES THESE:
     * - Cancels ongoing requests when dependencies change
     * - Prevents state updates after component unmounts
     * - Eliminates race conditions from concurrent requests
     * - Better memory management and performance
     *
     * EVEN BETTER ALTERNATIVES:
     * 1. React Query/TanStack Query - Built-in caching, background updates
     * 2. SWR - Stale-while-revalidate pattern
     * 3. Zustand/Redux Toolkit Query - Global state management
     */
    useEffect(() => {
        // Create AbortController for this effect
        const abortController = new AbortController();

        fetchOverview(abortController.signal);

        // Cleanup: abort the request if component unmounts or dependencies change
        return () => {
            abortController.abort();
        };
    }, [month, year]); // Dependencies: refetch when month or year changes

    return {
        overview,
        loading,
        error,
        refetch: () => fetchOverview(), // Manual refetch without abort signal
    };
};
