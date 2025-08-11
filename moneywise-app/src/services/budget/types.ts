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

/**
 * Single budget row as stored/returned by the backend.
 * Backend: commonly returned by POST/PUT/GET /api/budgets/{id}
 */
export interface BudgetApi {
    id: string;
    month: number;
    year: number;
    category_id: string;
    planned: Money;
    spent: Money;
    carryover: Money;
    currency: string;
    created_at: string;
    updated_at: string;
}

/**
 * Payload for creating a budget entry.
 * Note: `month` and `year` may be null if the backend infers them from context.
 */
export interface CreateBudgetRequest {
    category_id: string;
    planned: Money;
    currency: string;
    month: number | null;
    year: number | null;
}

/**
 * Partial update payload for a budget entry.
 * Optional fields allow targeted updates.
 */
export interface UpdateBudgetRequest {
    planned?: Money | null;
    carryover?: Money | null;
}


