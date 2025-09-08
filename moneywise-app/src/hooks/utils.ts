/**
 * 🛠️ Shared Utilities for Budget Hooks
 *
 * Common utilities and helper functions used across all budget hooks.
 * This eliminates code duplication and ensures consistent behavior.
 */

import { useMemo } from 'react';
import { buildDateParams } from '../utils/dateUtils';
import type { BaseQueryParams, BudgetQueryParams, BudgetTimePeriod } from './types';

/**
 * Default currency for the application
 * TODO: Make this configurable via user settings or global app config
 * This should be moved to a user preferences system
 */
const DEFAULT_CURRENCY = 'USD';

/**
 * Build standardized query parameters with proper defaults
 * Internal function used by useQueryParams hook
 *
 * @param params - Base query parameters
 * @returns Normalized parameters with defaults applied
 */
const buildQueryParams = (params: BaseQueryParams): Required<BaseQueryParams> => {
    const dateParams = buildDateParams(params.month, params.year);

    return {
        month: dateParams.month,
        year: dateParams.year,
        currency: params.currency || DEFAULT_CURRENCY,
    };
};

/**
 * Convert budget query parameters to API format based on time period
 * Internal function used by useApiParams hook
 *
 * @param params - Budget query parameters including time period
 * @returns API parameters formatted for the specific time period
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

/**
 * Memoized hook for building query parameters
 * Prevents unnecessary recalculations on every render
 *
 * @param params - Base query parameters
 * @returns Memoized query parameters
 */
export const useQueryParams = (params: BaseQueryParams) => {
    return useMemo(() => buildQueryParams(params), [params.month, params.year, params.currency]);
};

/**
 * Memoized hook for building API parameters
 * Prevents unnecessary recalculations on every render
 *
 * @param params - Budget query parameters
 * @returns Memoized API parameters
 */
export const useApiParams = (params: BudgetQueryParams) => {
    return useMemo(() => buildApiParams(params), [
        params.timePeriod,
        params.month,
        params.year,
        params.currency
    ]);
};

/**
 * Check if data is empty based on different data structures
 *
 * @param data - The data to check
 * @param type - Type of data structure
 * @returns True if data is considered empty
 */
export const isDataEmpty = (data: any, type: 'budget' | 'overview' | 'categories'): boolean => {
    if (!data) return true;

    switch (type) {
        case 'budget':
            return !data.categories?.length && !data.overview;
        case 'overview':
            return !data.planned && !data.spent;
        case 'categories':
            return !Array.isArray(data) || data.length === 0;
        default:
            return true;
    }
};

/**
 * Filter categories with spending data
 *
 * @param categories - Array of category budget data
 * @returns Filtered categories with spending > 0
 */
export const filterCategoriesWithSpending = (categories: any[] = []) => {
    return categories.filter(cat => parseFloat(cat.spent || '0') > 0);
};

/**
 * Build budget query parameters for comprehensive data queries
 *
 * @param queryParams - Base query parameters
 * @returns Budget query parameters with time period
 */
export const buildBudgetQueryParams = (queryParams: Required<BaseQueryParams>) => {
    return {
        timePeriod: 'Monthly' as const,
        month: queryParams.month,
        year: queryParams.year,
        currency: queryParams.currency,
    };
};

/**
 * Compute common data validation values (hasData, isEmpty)
 * Helper function to eliminate duplicate logic
 *
 * @param data - The data to validate
 * @param type - Type of data structure for empty check
 * @returns Object with hasData and isEmpty flags
 */
const computeDataValidation = (data: any, type: 'budget' | 'overview' | 'categories') => {
    const hasData = Boolean(data);
    const isEmpty = hasData && isDataEmpty(data, type);

    return { hasData, isEmpty };
};

/**
 * Compute budget data values (hasData, isEmpty)
 *
 * @param budgetData - Budget response data
 * @returns Computed values for budget data
 */
export const computeBudgetDataValues = (budgetData: any) => {
    return computeDataValidation(budgetData, 'budget');
};

/**
 * Compute overview data values (hasData, isEmpty)
 *
 * @param overview - Overview data
 * @returns Computed values for overview data
 */
export const computeOverviewDataValues = (overview: any) => {
    return computeDataValidation(overview, 'overview');
};

/**
 * Compute category spending values (categories, hasData, isEmpty)
 *
 * @param budgetData - Budget response data
 * @returns Computed values for category spending
 */
export const computeCategorySpendingValues = (budgetData: any) => {
    const categories = filterCategoriesWithSpending(budgetData?.categories);
    const { hasData, isEmpty } = computeDataValidation(categories, 'categories');

    return { categories, hasData, isEmpty };
};
