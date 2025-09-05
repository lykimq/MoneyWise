import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import apiService from '../services/api';
import { queryKeys } from '../services/queryClient';
import { useApiParams, computeBudgetDataValues } from './utils';
import type {
    UseBudgetDataReturn,
    BudgetQueryParams,
    BudgetTimePeriod
} from './types';

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

// Re-export types for backward compatibility
export type { BudgetTimePeriod, BudgetQueryParams, UseBudgetDataReturn };

export const useBudgetData = (
    timePeriod: BudgetTimePeriod,
    month?: string,
    year?: string,
    currency?: string
): UseBudgetDataReturn => {
    // Build query parameters
    const queryParams: BudgetQueryParams = {
        timePeriod,
        month,
        year,
        currency,
    };

    // Convert hook params to API format based on time period
    const apiParams = useApiParams(queryParams);

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

    // Memoized computed values using extracted function
    const computedValues = useMemo(() =>
        computeBudgetDataValues(budgetData),
        [budgetData]
    );

    return {
        // Core data
        budgetData,

        // Loading states
        loading: isLoading,
        isLoading, // Alias for backward compatibility
        isFetching,

        // Error handling
        error,

        // Data freshness
        isStale,
        dataUpdatedAt,

        // Actions
        refetch,

        // Computed values
        ...computedValues,
    };
};
