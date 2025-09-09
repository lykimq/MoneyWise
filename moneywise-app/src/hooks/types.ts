/**
 * Shared Types for Budget Hooks
 *
 * This file centralizes type definitions to ensure consistency across all
 * budget-related hooks. This approach eliminates duplication and provides a
 * single source of truth for hook interfaces.
 */

import type { BudgetResponse, BudgetOverviewApi, CategoryBudgetApi } from '../services/api';

/**
 * Defines common query parameters used across all budget hooks.
 */
export interface BaseQueryParams {
    month?: string;
    year?: string;
    currency?: string;
}

/**
 * Standardized return type for all budget hooks, providing a consistent
 * interface across the application.
 */
export interface BaseHookReturn {
    // Loading states for data fetching.
    loading: boolean;
    isFetching: boolean;

    // Error handling for failed data operations.
    error: Error | null;

    // Data freshness indicators.
    isStale: boolean;
    dataUpdatedAt: number;

    // Actions available for data management.
    refetch: () => Promise<any>;

    // Computed values for data presence and emptiness.
    hasData: boolean;
    isEmpty: boolean;
}

/**
 * Specific return type for the `useBudgetData` hook.
 */
export interface UseBudgetDataReturn extends BaseHookReturn {
    budgetData: BudgetResponse | undefined;
}

/**
 * Specific return type for the `useBudgetOverview` hook.
 */
export interface UseBudgetOverviewReturn extends BaseHookReturn {
    overview: BudgetOverviewApi | undefined;
}

/**
 * Specific return type for the `useCategorySpending` hook.
 */
export interface UseCategorySpendingReturn extends BaseHookReturn {
    categories: CategoryBudgetApi[];
}

/**
 * Defines the available time period options for budget data filtering.
 */
export type BudgetTimePeriod = 'Monthly' | 'Yearly';

/**
 * Parameters specifically for budget data queries, extending `BaseQueryParams`
 * with a required `timePeriod`.
 */
export interface BudgetQueryParams extends BaseQueryParams {
    timePeriod: BudgetTimePeriod;
}
