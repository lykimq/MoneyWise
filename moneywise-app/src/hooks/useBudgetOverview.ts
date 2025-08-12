import { useQuery } from '@tanstack/react-query';
import apiService, { BudgetOverviewApi } from '../services/api';
import { queryKeys } from '../services/queryClient';

/**
 * Custom Hook: useBudgetOverview - Powered by TanStack Query
 *
 * 🎯 PURPOSE: Fetch and manage budget overview data with automatic caching
 *
 * ✅ BENEFITS:
 * - Automatic caching and background updates
 * - Built-in retry logic and error handling
 * - Request deduplication
 * - No race conditions or memory leaks
 * - Better loading and error states
 */

interface UseBudgetOverviewReturn {
    overview: BudgetOverviewApi | undefined;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<any>;
    isStale: boolean;             // Know if data might be outdated
    isFetching: boolean;          // Know if background update is happening
    dataUpdatedAt: number;        // When data was last updated
}
export const useBudgetOverview = (
    month?: string,
    year?: string,
    currency?: string
): UseBudgetOverviewReturn => {

    // Use current month/year if not provided
    const now = new Date();
    const targetMonth = month || String(now.getMonth() + 1);
    const targetYear = year || String(now.getFullYear());

    const queryParams = {
        month: targetMonth,
        year: targetYear,
        currency: currency || 'USD',
    };

    const {
        data: overview,
        isLoading: loading,
        error,
        refetch,
        isStale,
        isFetching,
        dataUpdatedAt,
    } = useQuery({
        queryKey: queryKeys.budgets.overview(queryParams),
        queryFn: () => apiService.getBudgetOverview(queryParams),
        staleTime: 5 * 60 * 1000, // 5 minutes - budget data doesn't change frequently
        enabled: Boolean(targetMonth && targetYear),
    });

    return {
        overview,
        loading,
        error,
        refetch,
        isStale,
        isFetching,
        dataUpdatedAt,
    };
};