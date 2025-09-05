/**
 * Money is represented as a string to avoid floating point precision errors
 * in JavaScript (e.g., "12.34"). The backend should serialize monetary values
 * as strings for consistency.
 */
export type Money = string;

/**
 * Aggregated totals for a time period.
 * Backend: returned by GET /api/budgets/overview
 */
export interface BudgetOverviewApi {
    planned: Money;
    spent: Money;
    remaining: Money;
    currency: string;
}

/**
 * Per-category budget breakdown and progress.
 * Backend: included in GET /api/budgets
 */
export interface CategoryBudgetApi {
    id: string;
    category_name: string;
    group_name: string | null;
    category_color: string;
    group_color: string | null;
    planned: Money;
    spent: Money;
    remaining: Money;
    percentage: Money;
    currency: string;
}

/**
 * Insight message derived from budget data (e.g., alerts, tips).
 * Backend: included in GET /api/budgets
 */
export interface BudgetInsight {
    type_: string;
    message: string;
    icon: string;
    color: string;
}

/**
 * Composite response for the budgets listing endpoint.
 */
export interface BudgetResponse {
    overview: BudgetOverviewApi;
    categories: CategoryBudgetApi[];
    insights: BudgetInsight[];
}

