/**
 * Money type as string to avoid floating-point precision errors.
 */
export type Money = string;

/**
 * Aggregated budget totals for a specific time period.
 */
export interface BudgetOverviewApi {
  planned: Money;
  spent: Money;
  remaining: Money;
  currency: string;
}

/**
 * Per-category budget breakdown with progress tracking.
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
 * Budget insight message with type, content, and styling.
 */
export interface BudgetInsight {
  type_: string;
  message: string;
  icon: string;
  color: string;
}

/**
 * Complete budget response with overview, categories, and insights.
 */
export interface BudgetResponse {
  overview: BudgetOverviewApi;
  categories: CategoryBudgetApi[];
  insights: BudgetInsight[];
}
