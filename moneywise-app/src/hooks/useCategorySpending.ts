import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import apiService from '../services/api';
import { queryKeys } from '../services/queryClient';
import { useQueryParams, buildBudgetQueryParams, computeCategorySpendingValues } from './utils';
import type { UseCategorySpendingReturn, BaseQueryParams } from './types';

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

export const useCategorySpending = (
    month?: string,
    year?: string,
    currency?: string
): UseCategorySpendingReturn => {
    // Build base parameters
    const baseParams: BaseQueryParams = { month, year, currency };
    const queryParams = useQueryParams(baseParams);

    // Build query params for the comprehensive budget data query using extracted function
    const budgetQueryParams = buildBudgetQueryParams(queryParams);

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
        queryKey: queryKeys.budgets.data(budgetQueryParams),
        queryFn: () => apiService.getBudgets(queryParams),
        enabled: Boolean(queryParams.month && queryParams.year),
    });

    // Memoized computed values using extracted function
    const computedValues = useMemo(() =>
        computeCategorySpendingValues(budgetData),
        [budgetData]
    );

    return {
        ...computedValues,
        loading,
        error,
        refetch,
        isStale,
        isFetching,
        dataUpdatedAt,
    };
};
