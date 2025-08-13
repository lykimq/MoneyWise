import { useQuery } from '@tanstack/react-query';
import apiService, { BudgetOverviewApi } from '../services/api';
import { queryKeys } from '../services/queryClient';
import { buildDateParams } from '../utils/dateUtils';

/**
 * 🏠 useBudgetOverview - Dashboard Summary Hook
 *
 * PURPOSE: Provides lightweight budget summary data for the HomeScreen dashboard.
 * Returns only essential overview metrics (planned, spent, remaining) without
 * heavy category breakdowns or insights.
 *
 * USED BY: HomeScreen component for dashboard cards and summary widgets
 * API ENDPOINT: GET /api/budgets/overview (lightweight response ~200 bytes)
 *
 * DESIGN DECISION: Separate from useBudgetData to optimize performance.
 * HomeScreen doesn't need category details, so we avoid fetching unnecessary data.
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

    // Build date parameters with current month/year as fallbacks
    const dateParams = buildDateParams(month, year);

    const queryParams = {
        month: dateParams.month,
        year: dateParams.year,
        currency: currency || 'USD',
    };

    // Fetch overview data using centralized query configuration
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
        enabled: Boolean(dateParams.month && dateParams.year),
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