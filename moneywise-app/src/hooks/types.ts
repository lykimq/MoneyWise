/**
 * 🏗️ Shared Types for Budget Hooks
 *
 * Centralized type definitions to ensure consistency across all budget-related hooks.
 * This eliminates duplication and provides a single source of truth for hook interfaces.
 */

import type { BudgetResponse, BudgetOverviewApi, CategoryBudgetApi } from '../services/api';

/**
 * Common query parameters used across all budget hooks
 */
export interface BaseQueryParams {
    month?: string;
    year?: string;
    currency?: string;
}

/**
 * Standardized return type for all budget hooks
 * Provides consistent interface across the application
 */
export interface BaseHookReturn {
    // Loading states
    loading: boolean;
    isFetching: boolean;

    // Error handling
    error: Error | null;

    // Data freshness
    isStale: boolean;
    dataUpdatedAt: number;

    // Actions
    refetch: () => Promise<any>;

    // Computed values
    hasData: boolean;
    isEmpty: boolean;
}

/**
 * Specific return types for each hook
 */
export interface UseBudgetDataReturn extends BaseHookReturn {
    budgetData: BudgetResponse | undefined;
}

export interface UseBudgetOverviewReturn extends BaseHookReturn {
    overview: BudgetOverviewApi | undefined;
}

export interface UseCategorySpendingReturn extends BaseHookReturn {
    categories: CategoryBudgetApi[];
}

/**
 * Time period options for budget data filtering
 */
export type BudgetTimePeriod = 'Monthly' | 'Yearly';

/**
 * Parameters for budget data query
 */
export interface BudgetQueryParams extends BaseQueryParams {
    timePeriod: BudgetTimePeriod;
}
