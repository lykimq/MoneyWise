/**
 * Public API surface for service calls used by the MoneyWise application.
 * This file re-exports the Budget domain and provides a single `apiService`
 * facade for convenient access.
 *
 * Frontend Note:
 *   Prefer importing domain-specific clients directly from `./budget` when
 *   richer typing and methods are required. `apiService` serves as a
 *   convenience wrapper for common operations.
 *
 * Backend Note:
 *   Methods defined here map to REST endpoints implemented in the
 *   `moneywise-backend` service. Examples include:
 *     GET    /api/budgets
 *     GET    /api/budgets/overview
 *     POST   /api/budgets
 *     PUT    /api/budgets/{id}
 *     GET    /api/budgets/{id}
 *   Refer to `moneywise-backend/src/api/mod.rs` for the detailed router setup.
 */
// Thin compatibility wrapper. Prefer importing from './budget' for richer types.
export * from './budget';

import { budgetClient } from './budget';
import type { BudgetOverviewApi, BudgetResponse } from './budget';

export const apiService = {
  /**
   * Retrieves a list of budgets based on the provided parameters.
   * @param params - Optional parameters for filtering budgets (month, year, currency).
   * @returns A promise that resolves to a BudgetResponse.
   */
  getBudgets: (params?: {
    month?: string;
    year?: string;
    currency?: string;
  }): Promise<BudgetResponse> => budgetClient.list(params),
  /**
   * Retrieves an overview of budgets based on the provided parameters.
   * @param params - Optional parameters for filtering the overview (month, year, currency).
   * @returns A promise that resolves to a BudgetOverviewApi object.
   */
  getBudgetOverview: (params?: {
    month?: string;
    year?: string;
    currency?: string;
  }): Promise<BudgetOverviewApi> => budgetClient.overview(params),
};

export default apiService;
