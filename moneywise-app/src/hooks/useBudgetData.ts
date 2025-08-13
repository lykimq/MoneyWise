import { useQuery } from '@tanstack/react-query';
import apiService, { BudgetResponse } from '../services/api';
import { queryKeys } from '../services/queryClient';
import { buildDateParams } from '../utils/dateUtils';

/**
 * 📊 useBudgetData - Complete Budget Management Hook
 *
 * PURPOSE: Provides comprehensive budget data for the BudgetsScreen where users
 * manage their detailed budget planning. Includes overview totals, category-by-category
 * breakdowns with progress tracking, and AI-generated insights.
 *
 * USED BY: BudgetsScreen component for detailed budget management interface
 * API ENDPOINT: GET /api/budgets (comprehensive response ~2-5KB with all data)
 *
 * INCLUDES:
 * - Budget overview (planned, spent, remaining totals)
 * - Category breakdowns (each category's budget vs actual spending)
 * - Progress indicators (percentage spent per category)
 * - AI insights and recommendations
 * - Time period filtering (Monthly/Yearly views)
 *
 * DESIGN DECISION: Separate from useBudgetOverview because BudgetsScreen needs
 * full dataset while HomeScreen only needs summary. This prevents over-fetching
 * on the dashboard while providing complete data for budget management.
 */

/**
 * Time period options for budget data filtering
 */
export type BudgetTimePeriod = 'Monthly' | 'Yearly';

/**
 * Parameters for budget data query
 */
interface BudgetQueryParams {
    timePeriod: BudgetTimePeriod;
    month?: string;
    year?: string;
    currency?: string;
}

/**
 * Return type for the budget data hook
 * Provides comprehensive state information for UI components
 */
interface UseBudgetDataReturn {
    // Core data
    budgetData: BudgetResponse | undefined;

    // Loading states
    isLoading: boolean;          // Initial load
    isFetching: boolean;         // Background updates

    // Error handling
    error: Error | null;

    // Data freshness
    isStale: boolean;            // Know if data might be outdated
    dataUpdatedAt: number;       // When data was last updated

    // Actions
    refetch: () => Promise<any>; // Manual refresh

    // Computed values for easier UI usage
    hasData: boolean;
    isEmpty: boolean;
}

/**
 * Convert hook parameters to API parameters based on selected time period
 */
const buildApiParams = (params: BudgetQueryParams) => {
    const dateParams = buildDateParams(params.month, params.year);
    const apiParams: { month?: string; year?: string; currency?: string } = {};

    // Monthly view: send both month and year for specific month data
    if (params.timePeriod === 'Monthly') {
        apiParams.month = dateParams.month;
        apiParams.year = dateParams.year;
    }
    // Yearly view: send only year for annual aggregation
    else if (params.timePeriod === 'Yearly') {
        apiParams.year = dateParams.year;
    }

    if (params.currency) {
        apiParams.currency = params.currency;
    }

    return apiParams;
};

export const useBudgetData = (
    timePeriod: BudgetTimePeriod,
    month?: string,
    year?: string,
    currency?: string
): UseBudgetDataReturn => {

    const queryParams: BudgetQueryParams = {
        timePeriod,
        month,
        year,
        currency,
    };

    // Convert hook params to API format based on time period
    const apiParams = buildApiParams(queryParams);

    // Fetch comprehensive budget data using centralized query configuration
    const {
        data: budgetData,
        isLoading,
        isFetching,
        error,
        refetch,
        isStale,
        dataUpdatedAt,
    } = useQuery({
        queryKey: queryKeys.budgets.data(queryParams),
        queryFn: () => apiService.getBudgets(apiParams),
        enabled: Boolean(timePeriod),
    });

    // Computed values for easier UI usage
    const hasData = Boolean(budgetData);
    const isEmpty = hasData && (!budgetData?.categories?.length && !budgetData?.overview);

    return {
        // Core data
        budgetData,

        // Loading states
        isLoading,
        isFetching,

        // Error handling
        error,

        // Data freshness
        isStale,
        dataUpdatedAt,

        // Actions
        refetch,

        // Computed values
        hasData,
        isEmpty,
    };
};
