/**
 * Money is represented as a string to avoid floating-point precision errors
 * in JavaScript (e.g., "12.34"). The backend should serialize monetary values
 * as strings for consistency across the application.
 */
export type Money = string;

/**
 * Represents aggregated totals for a specific time period.
 * Backend: Returned by `GET /api/budgets/overview`.
 */
export interface BudgetOverviewApi {
  planned: Money;
  spent: Money;
  remaining: Money;
  currency: string;
}

/**
 * Provides a per-category budget breakdown and progress.
 * Backend: Included in the response from `GET /api/budgets`.
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
 * Represents an insight message derived from budget data, such as alerts or
 * tips for the user.
 * Backend: Included in the response from `GET /api/budgets`.
 */
export interface BudgetInsight {
  type_: string;
  message: string;
  icon: string;
  color: string;
}

/**
 * The composite response structure for the budgets listing endpoint.
 * Contains an overview, category-specific budgets, and relevant insights.
 */
export interface BudgetResponse {
  overview: BudgetOverviewApi;
  categories: CategoryBudgetApi[];
  insights: BudgetInsight[];
}
