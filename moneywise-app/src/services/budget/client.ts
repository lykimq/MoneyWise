import { httpClient } from '../http';
import {
    BudgetOverviewApi,
    BudgetResponse,
} from './types';

/**
 * Client for Budget-related endpoints - STREAMLINED VERSION
 *
 * EDUCATIONAL NOTE:
 * This client has been refined to include only actively used methods.
 * Removed: `create`, `update`, `getById` (not used anywhere in the app).
 * Kept: `list`, `overview` (used by hooks).
 *
 * Frontend Note:
 *   Builds query strings and delegates HTTP calls to `HttpClient`, returning
 *   strongly-typed data structures from `./types`.
 *
 * Backend Note:
 *   Endpoints are expected under `/api/budgets` and `/api/budgets/overview`.
 *   Ensure backend handlers accept `month`, `year`, and `currency` as query
 *   parameters and respond with JSON matching the types in `./types.ts`.
 */
class BudgetClient {
    /**
     * Fetches a list of budgets, including overview, category breakdowns, and
     * insights.
     * Corresponds to: `GET /api/budgets?month=..&year=..&currency=..`
     * Used by: `useBudgetData` hook.
     * @param params - Optional parameters for filtering budgets.
     * @returns A promise that resolves to a `BudgetResponse`.
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
     * Fetches aggregated budget totals for the selected period.
     * Corresponds to: `GET /api/budgets/overview?month=..&year=..&currency=..`
     * Used by: `useBudgetOverview` hook.
     * @param params - Optional parameters for filtering the budget overview.
     * @returns A promise that resolves to a `BudgetOverviewApi` object.
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
