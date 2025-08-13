import { httpClient } from '../http';
import {
    BudgetOverviewApi,
    BudgetResponse,
} from './types';

/**
 * Client for Budget-related endpoints - STREAMLINED VERSION
 *
 * EDUCATIONAL NOTE:
 * This client has been cleaned up to only include methods that are actively used.
 * Removed: create, update, getById (not used anywhere in the app)
 * Kept: list, overview (used by hooks)
 *
 * Frontend note:
 *   Builds query strings and delegates HTTP calls to `HttpClient`, returning
 *   strongly-typed data structures from `./types`.
 *
 * Backend note:
 *   Endpoints are expected under `/api/budgets` and `/api/budgets/overview`.
 *   Ensure backend handlers accept `month`, `year`, and `currency` as query
 *   parameters and respond with JSON matching the types in `./types.ts`.
 */
class BudgetClient {
    /**
     * GET /api/budgets?month=..&year=..&currency=..
     * Returns an overview, category breakdowns, and insights.
     * Used by: useBudgetData hook
     */
    async list(params?: { month?: string; year?: string; currency?: string }): Promise<BudgetResponse> {
        const sp = new URLSearchParams();
        if (params?.month) sp.append('month', params.month);
        if (params?.year) sp.append('year', params.year);
        if (params?.currency) sp.append('currency', params.currency);
        const qs = sp.toString();
        return httpClient.request<BudgetResponse>(qs ? `/budgets?${qs}` : '/budgets');
    }

    /**
     * GET /api/budgets/overview?month=..&year=..&currency=..
     * Returns aggregated totals for the selected period.
     * Used by: useBudgetOverview hook
     */
    async overview(params?: { month?: string; year?: string; currency?: string }): Promise<BudgetOverviewApi> {
        const sp = new URLSearchParams();
        if (params?.month) sp.append('month', params.month);
        if (params?.year) sp.append('year', params.year);
        if (params?.currency) sp.append('currency', params.currency);
        const qs = sp.toString();
        return httpClient.request<BudgetOverviewApi>(qs ? `/budgets/overview?${qs}` : '/budgets/overview');
    }
}

export const budgetClient = new BudgetClient();


