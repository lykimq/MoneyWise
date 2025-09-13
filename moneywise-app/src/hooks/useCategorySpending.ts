import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import apiService from '../services/api';
import { queryKeys } from '../services/queryClient';
import {
  useQueryParams,
  buildBudgetQueryParams,
  computeCategorySpendingValues,
} from './utils';
import type { UseCategorySpendingReturn, BaseQueryParams } from './types';

/**
 * `useCategorySpending` - Category Spending Data Hook
 *
 * PURPOSE: Provides category spending data specifically for the HomeScreen
 * pie chart. It fetches only the categories with spending data, optimized
 * for visualization purposes.
 *
 * USED BY: The `HomeScreen`'s `CategorySpendingSection` for displaying the
 * pie chart.
 * API ENDPOINT: `GET /api/budgets` (utilizes categories from the comprehensive
 * budget response).
 *
 * DESIGN DECISION: This hook is separated from `useBudgetOverview` to avoid
 * over-fetching data on the dashboard. It focuses solely on the category data
 * required for chart rendering.
 */

export const useCategorySpending = (
  month?: string,
  year?: string,
  currency?: string
): UseCategorySpendingReturn => {
  // Constructs base parameters for the API request.
  const baseParams: BaseQueryParams = { month, year, currency };
  const queryParams = useQueryParams(baseParams);

  // Builds query parameters for the comprehensive budget data query using
  // an extracted utility function.
  const budgetQueryParams = buildBudgetQueryParams(queryParams);

  // Fetches comprehensive budget data to extract category information.
  const {
    data: budgetData,
    isLoading,
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

  // Memoizes computed values using an extracted utility function to prevent
  // unnecessary recalculations.
  const computedValues = useMemo(
    () => computeCategorySpendingValues(budgetData),
    [budgetData]
  );

  return {
    ...computedValues,
    loading: isLoading,
    error,
    refetch,
    isStale,
    isFetching,
    dataUpdatedAt,
  };
};
