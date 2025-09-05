import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import apiService from '../services/api';
import { queryKeys } from '../services/queryClient';
import { useQueryParams, computeOverviewDataValues } from './utils';
import type { UseBudgetOverviewReturn, BaseQueryParams } from './types';

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
export const useBudgetOverview = (
    month?: string,
    year?: string,
    currency?: string
): UseBudgetOverviewReturn => {
    // Build base parameters
    const baseParams: BaseQueryParams = { month, year, currency };
    const queryParams = useQueryParams(baseParams);

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
        enabled: Boolean(queryParams.month && queryParams.year),
    });

    // Memoized computed values using extracted function
    const computedValues = useMemo(() =>
        computeOverviewDataValues(overview),
        [overview]
    );

    return {
        overview,
        loading,
        error,
        refetch,
        isStale,
        isFetching,
        dataUpdatedAt,
        ...computedValues,
    };
};