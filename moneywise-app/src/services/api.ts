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
// Re-export budget domain for convenience
export * from './budget';

import { budgetClient } from './budget';
import type { BudgetOverviewApi, BudgetResponse } from './budget';

export const apiService = {
  /**
   * Retrieves budget list with optional filtering parameters.
   */
  getBudgets: (params?: {
    month?: string;
    year?: string;
    currency?: string;
  }): Promise<BudgetResponse> => budgetClient.list(params),
  /**
   * Retrieves budget overview with optional filtering parameters.
   */
  getBudgetOverview: (params?: {
    month?: string;
    year?: string;
    currency?: string;
  }): Promise<BudgetOverviewApi> => budgetClient.overview(params),
};

export default apiService;
