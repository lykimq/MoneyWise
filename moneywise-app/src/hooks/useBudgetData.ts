import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import apiService from '../services/api';
import { queryKeys } from '../services/queryClient';
import { useApiParams, computeBudgetDataValues } from './utils';
import type {
  UseBudgetDataReturn,
  BudgetQueryParams,
  BudgetTimePeriod,
} from './types';

/**
 * `useBudgetData` - Complete Budget Management Hook
 *
 * PURPOSE: Provides comprehensive budget data for the `BudgetsScreen` where
 * users manage their detailed budget planning. This includes overview totals,
 * category-by-category breakdowns with progress tracking, and AI-generated
 * insights.
 *
 * USED BY: The `BudgetsScreen` component for its detailed budget management
 * interface.
 * API ENDPOINT: `GET /api/budgets` (provides a comprehensive response,
 * typically 2-5KB, with all necessary data).
 *
 * INCLUDES:
 * - Budget overview (planned, spent, remaining totals).
 * - Category breakdowns (each category's budget versus actual spending).
 * - Progress indicators (percentage spent per category).
 * - AI insights and recommendations.
 * - Time period filtering (Monthly/Yearly views).
 *
 * DESIGN DECISION: This hook is separated from `useBudgetOverview` because
 * `BudgetsScreen` requires a full dataset, whereas `HomeScreen` only needs
 * a summary. This prevents over-fetching on the dashboard while providing
 * complete data for budget management.
 */

// Re-exports types for backward compatibility and easier access.
export type { BudgetTimePeriod, BudgetQueryParams, UseBudgetDataReturn };

export const useBudgetData = (
  timePeriod: BudgetTimePeriod,
  month?: string,
  year?: string,
  currency?: string
): UseBudgetDataReturn => {
  // Constructs query parameters based on the provided arguments.
  const queryParams: BudgetQueryParams = {
    timePeriod,
    month,
    year,
    currency,
  };

  // Converts hook parameters to the API-compatible format based on the
  // selected time period.
  const apiParams = useApiParams(queryParams);

  // Fetches comprehensive budget data using a centralized query configuration.
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
    enabled: Boolean(timePeriod), // Ensures query only runs when timePeriod is defined.
  });

  // Memoizes computed values using an extracted utility function to prevent
  // unnecessary recalculations.
  const computedValues = useMemo(
    () => computeBudgetDataValues(budgetData),
    [budgetData]
  );

  return {
    // Core budget data.
    budgetData,

    // Loading states for data fetching.
    loading: isLoading,
    isFetching,

    // Error handling.
    error,

    // Data freshness indicators.
    isStale,
    dataUpdatedAt,

    // Actions for data management.
    refetch,

    // Computed values (e.g., hasData, isEmpty).
    ...computedValues,
  };
};
