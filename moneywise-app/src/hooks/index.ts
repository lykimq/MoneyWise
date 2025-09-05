/**
 * 🎣 Hooks Index - Centralized Exports
 *
 * Provides a clean, organized interface for all budget-related hooks.
 * This eliminates the need to import from multiple files and ensures
 * consistent usage patterns across the application.
 */

// Hook exports
export { useBudgetData } from './useBudgetData';
export { useBudgetOverview } from './useBudgetOverview';
export { useCategorySpending } from './useCategorySpending';

// Type exports
export type {
    // Base types
    BaseQueryParams,
    BaseHookReturn,

    // Specific hook return types
    UseBudgetDataReturn,
    UseBudgetOverviewReturn,
    UseCategorySpendingReturn,

    // Query parameter types
    BudgetQueryParams,
    BudgetTimePeriod,
} from './types';

// Utility exports (for advanced usage)
export {
    useQueryParams,
    useApiParams,
    isDataEmpty,
    filterCategoriesWithSpending,
    buildBudgetQueryParams,
    computeBudgetDataValues,
    computeOverviewDataValues,
    computeCategorySpendingValues,
} from './utils';
