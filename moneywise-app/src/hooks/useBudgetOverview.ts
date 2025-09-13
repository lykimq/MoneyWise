import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import apiService from '../services/api';
import { queryKeys } from '../services/queryClient';
import { useQueryParams, computeOverviewDataValues } from './utils';
import type { UseBudgetOverviewReturn, BaseQueryParams } from './types';

/**
 * `useBudgetOverview` - Dashboard Summary Hook
 *
 * PURPOSE: Provides lightweight budget summary data specifically for the
 * HomeScreen dashboard. It returns only essential overview metrics (planned,
 * spent, remaining) without including heavy category breakdowns or insights.
 *
 * USED BY: The `HomeScreen` component for dashboard cards and summary widgets.
 * API ENDPOINT: `GET /api/budgets/overview` (designed for a lightweight
 * response, typically around 200 bytes).
 *
 * DESIGN DECISION: This hook is separated from `useBudgetData` to optimize
 * performance. The `HomeScreen` does not require detailed category information,
 * thus avoiding the fetching of unnecessary data.
 */
export const useBudgetOverview = (
  month?: string,
  year?: string,
  currency?: string
): UseBudgetOverviewReturn => {
  // Constructs base parameters for the API request.
  const baseParams: BaseQueryParams = { month, year, currency };
  const queryParams = useQueryParams(baseParams);

  // Fetches overview data using a centralized query configuration.
  const {
    data: overview,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: queryKeys.budgets.overview(queryParams),
    queryFn: () => apiService.getBudgetOverview(queryParams),
    enabled: Boolean(queryParams.month && queryParams.year),
  });

  // Memoizes computed values using an extracted utility function to prevent
  // unnecessary recalculations.
  const computedValues = useMemo(
    () => computeOverviewDataValues(overview),
    [overview]
  );

  return {
    overview,
    loading: isLoading,
    error,
    refetch,
    isStale,
    isFetching,
    dataUpdatedAt,
    ...computedValues,
  };
};
