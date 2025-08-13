/**
 * Public API surface for service calls used by the app.
 * This file re-exports the Budget domain and provides a single `apiService` facade.
 *
 * Frontend note:
 *   Prefer importing domain-specific clients from `./budget` when you need
 *   richer typing and methods. `apiService` is a convenience wrapper.
 *
 * Backend note:
 *   Methods map to REST endpoints implemented in `moneywise-backend`, e.g.:
 *     GET    /api/budgets
 *     GET    /api/budgets/overview
 *     POST   /api/budgets
 *     PUT    /api/budgets/{id}
 *     GET    /api/budgets/{id}
 *   See `moneywise-backend/src/api/mod.rs` for router setup.
 */
// Thin compatibility wrapper. Prefer importing from './budget'.
export * from './budget';

import { budgetClient } from './budget';
import type {
    BudgetOverviewApi,
    BudgetResponse,
} from './budget';

/**
 * SIMPLIFIED API SERVICE - ONLY ACTIVE ENDPOINTS
 *
 * EDUCATIONAL NOTE:
 * We've removed unused functions (create, update, getById) to keep the API surface clean.
 * Only keeping the functions that are actually used in the app:
 * - getBudgets: Used by useBudgetData hook
 * - getBudgetOverview: Used by useBudgetOverview hook
 *
 * WHY REMOVE UNUSED CODE?
 * - Reduces bundle size
 * - Eliminates maintenance overhead
 * - Makes the API contract clearer
 * - Follows YAGNI principle (You Aren't Gonna Need It)
 */
export const apiService = {
    getBudgets: (params?: { month?: string; year?: string; currency?: string }): Promise<BudgetResponse> =>
        budgetClient.list(params),
    getBudgetOverview: (params?: { month?: string; year?: string; currency?: string }): Promise<BudgetOverviewApi> =>
        budgetClient.overview(params),
};

export default apiService;