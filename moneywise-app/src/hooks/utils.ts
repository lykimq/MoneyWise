/**
 * Shared Utilities for Budget Hooks
 *
 * This file contains common utilities and helper functions used across all
 * budget-related hooks. This approach eliminates code duplication and ensures
 * consistent behavior throughout the application.
 */

import { useMemo } from 'react';
import { buildDateParams } from '../utils/dateUtils';
import type { BaseQueryParams, BudgetQueryParams, BudgetTimePeriod } from './types';

/**
 * Default currency for the application.
 * TODO: Make this configurable via user settings or a global app configuration.
 * This value should ideally be managed by a user preferences system.
 */
const DEFAULT_CURRENCY = 'USD';

/**
 * Constructs standardized query parameters with appropriate default values.
 * This is an internal function used by the `useQueryParams` hook.
 *
 * @param params - The base query parameters provided.
 * @returns Normalized parameters with defaults applied for month, year, and
 *          currency.
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
 * Converts budget query parameters into an API-compatible format based on the
 * selected time period. This is an internal function used by `useApiParams`.
 *
 * @param params - Budget query parameters, including the time period.
 * @returns API parameters formatted for the specific time period (monthly or
 *          yearly aggregation).
 */
const buildApiParams = (params: BudgetQueryParams) => {
    const dateParams = buildDateParams(params.month, params.year);
    const apiParams: { month?: string; year?: string; currency?: string } = {};

    // For monthly view, both month and year are sent for specific month data.
    if (params.timePeriod === 'Monthly') {
        apiParams.month = dateParams.month;
        apiParams.year = dateParams.year;
    }
    // For yearly view, only the year is sent for annual aggregation.
    else if (params.timePeriod === 'Yearly') {
        apiParams.year = dateParams.year;
    }

    if (params.currency) {
        apiParams.currency = params.currency;
    }

    return apiParams;
};

/**
 * A memoized hook for constructing query parameters.
 * This prevents unnecessary recalculations on every render, optimizing performance.
 *
 * @param params - The base query parameters.
 * @returns Memoized query parameters.
 */
export const useQueryParams = (params: BaseQueryParams) => {
    return useMemo(() => buildQueryParams(params), [params.month, params.year, params.currency]);
};

/**
 * A memoized hook for constructing API parameters.
 * This prevents unnecessary recalculations on every render, optimizing performance.
 *
 * @param params - The budget query parameters.
 * @returns Memoized API parameters.
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
 * Checks if the provided data is considered empty based on its structure type.
 *
 * @param data - The data object to check.
 * @param type - The type of data structure ('budget', 'overview', or
 *               'categories').
 * @returns True if the data is considered empty, false otherwise.
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
 * Filters an array of categories, returning only those with spending data
 * greater than zero.
 *
 * @param categories - An array of category budget data.
 * @returns Filtered categories where `spent` amount is greater than 0.
 */
export const filterCategoriesWithSpending = (categories: any[] = []) => {
    return categories.filter(cat => parseFloat(cat.spent || '0') > 0);
};

/**
 * Constructs budget query parameters for comprehensive data queries.
 *
 * @param queryParams - The base query parameters.
 * @returns Budget query parameters including a default time period.
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
 * Computes common data validation values (`hasData`, `isEmpty`).
 * This helper function eliminates duplicate logic across different hooks.
 *
 * @param data - The data object to validate.
 * @param type - The type of data structure for the empty check.
 * @returns An object containing `hasData` and `isEmpty` flags.
 */
const computeDataValidation = (data: any, type: 'budget' | 'overview' | 'categories') => {
    const hasData = Boolean(data);
    const isEmpty = hasData && isDataEmpty(data, type);

    return { hasData, isEmpty };
};

/**
 * Computes data validation values (`hasData`, `isEmpty`) for budget data.
 *
 * @param budgetData - The budget response data.
 * @returns Computed validation flags for budget data.
 */
export const computeBudgetDataValues = (budgetData: any) => {
    return computeDataValidation(budgetData, 'budget');
};

/**
 * Computes data validation values (`hasData`, `isEmpty`) for overview data.
 *
 * @param overview - The overview data.
 * @returns Computed validation flags for overview data.
 */
export const computeOverviewDataValues = (overview: any) => {
    return computeDataValidation(overview, 'overview');
};

/**
 * Computes category spending values, including filtered categories and
 * validation flags.
 *
 * @param budgetData - The budget response data.
 * @returns An object containing filtered categories, `hasData`, and `isEmpty`
 *          flags for category spending.
 */
export const computeCategorySpendingValues = (budgetData: any) => {
    const categories = filterCategoriesWithSpending(budgetData?.categories);
    const { hasData, isEmpty } = computeDataValidation(categories, 'categories');

    return { categories, hasData, isEmpty };
};
