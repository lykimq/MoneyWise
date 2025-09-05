import { useQuery } from '@tanstack/react-query';
import apiService, { CategoryBudgetApi } from '../services/api';
import { queryKeys } from '../services/queryClient';
import { buildDateParams } from '../utils/dateUtils';

/**
 * 📊 useCategorySpending - Category Spending Data Hook
 *
 * PURPOSE: Provides category spending data specifically for the HomeScreen pie chart.
 * Fetches only the categories with spending data, optimized for visualization.
 *
 * USED BY: HomeScreen CategorySpendingSection for pie chart display
 * API ENDPOINT: GET /api/budgets (uses categories from comprehensive response)
 *
 * DESIGN DECISION: Separate from useBudgetOverview to avoid over-fetching
 * on the dashboard. This hook focuses only on category data needed for charts.
 */

interface UseCategorySpendingReturn {
    categories: CategoryBudgetApi[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<any>;
    isStale: boolean;
    isFetching: boolean;
    dataUpdatedAt: number;
    hasData: boolean;
    isEmpty: boolean;
}

export const useCategorySpending = (
    month?: string,
    year?: string,
    currency?: string
): UseCategorySpendingReturn => {

    // Build date parameters with current month/year as fallbacks
    const dateParams = buildDateParams(month, year);

    const queryParams = {
        month: dateParams.month,
        year: dateParams.year,
        currency: currency || 'USD', // TODO: Make default currency configurable via user settings or global app config
    };

    // Fetch comprehensive budget data to get categories
    const {
        data: budgetData,
        isLoading: loading,
        error,
        refetch,
        isStale,
        isFetching,
        dataUpdatedAt,
    } = useQuery({
        queryKey: queryKeys.budgets.data({
            timePeriod: 'Monthly', // TODO: Make timePeriod dynamic based on user selection or component props if other periods are supported
            month: dateParams.month,
            year: dateParams.year,
            currency: queryParams.currency,
        }),
        queryFn: () => apiService.getBudgets(queryParams),
        enabled: Boolean(dateParams.month && dateParams.year),
    });

    // Extract categories and filter out those with no spending
    const categories = budgetData?.categories?.filter(cat =>
        parseFloat(cat.spent) > 0
    ) || [];

    // Computed values for easier UI usage
    const hasData = Boolean(budgetData);
    const isEmpty = hasData && categories.length === 0;

    return {
        categories,
        loading,
        error,
        refetch,
        isStale,
        isFetching,
        dataUpdatedAt,
        hasData,
        isEmpty,
    };
};
