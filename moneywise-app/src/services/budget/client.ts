import { httpClient } from '../http';
import {
    BudgetApi,
    BudgetOverviewApi,
    BudgetResponse,
    CreateBudgetRequest,
    UpdateBudgetRequest,
} from './types';

/**
 * Client for Budget-related endpoints.
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
     */
    async overview(params?: { month?: string; year?: string; currency?: string }): Promise<BudgetOverviewApi> {
        const sp = new URLSearchParams();
        if (params?.month) sp.append('month', params.month);
        if (params?.year) sp.append('year', params.year);
        if (params?.currency) sp.append('currency', params.currency);
        const qs = sp.toString();
        return httpClient.request<BudgetOverviewApi>(qs ? `/budgets/overview?${qs}` : '/budgets/overview');
    }

    /**
     * POST /api/budgets
     * Body: CreateBudgetRequest
     * Returns the created budget row.
     */
    async create(budget: CreateBudgetRequest): Promise<BudgetApi> {
        return httpClient.request<BudgetApi>('/budgets', {
            method: 'POST',
            body: JSON.stringify(budget),
        });
    }

    /**
     * PUT /api/budgets/{id}
     * Body: UpdateBudgetRequest
     * Returns the updated budget row.
     */
    async update(id: string, budget: UpdateBudgetRequest): Promise<BudgetApi> {
        return httpClient.request<BudgetApi>(`/budgets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(budget),
        });
    }

    /**
     * GET /api/budgets/{id}
     * Returns a single budget row by ID.
     */
    async getById(id: string): Promise<BudgetApi> {
        return httpClient.request<BudgetApi>(`/budgets/${id}`);
    }
}

export const budgetClient = new BudgetClient();


