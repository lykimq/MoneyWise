/**
 * Shared types for budget hooks to ensure consistency across the application.
 */

import type {
  BudgetResponse,
  BudgetOverviewApi,
  CategoryBudgetApi,
} from '../services/api';

/**
 * Common query parameters for budget hooks.
 */
export interface BaseQueryParams {
  month?: string;
  year?: string;
  currency?: string;
}

/**
 * Standardized return type for all budget hooks.
 */
export interface BaseHookReturn {
  loading: boolean;
  isFetching: boolean;
  error: Error | null;
  isStale: boolean;
  dataUpdatedAt: number;
  refetch: () => Promise<any>;
  hasData: boolean;
  isEmpty: boolean;
}

/**
 * Return type for useBudgetData hook.
 */
export interface UseBudgetDataReturn extends BaseHookReturn {
  budgetData: BudgetResponse | undefined;
}

/**
 * Return type for useBudgetOverview hook.
 */
export interface UseBudgetOverviewReturn extends BaseHookReturn {
  overview: BudgetOverviewApi | undefined;
}

/**
 * Return type for useCategorySpending hook.
 */
export interface UseCategorySpendingReturn extends BaseHookReturn {
  categories: CategoryBudgetApi[];
}

/**
 * Available time period options for budget data filtering.
 */
export type BudgetTimePeriod = 'Monthly' | 'Yearly';

/**
 * Budget data query parameters with required timePeriod.
 */
export interface BudgetQueryParams extends BaseQueryParams {
  timePeriod: BudgetTimePeriod;
}
