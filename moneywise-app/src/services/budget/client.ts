import { httpClient } from '../http';
import { BudgetOverviewApi, BudgetResponse } from './types';

/**
 * Budget client for API endpoints with query string building and type-safe responses.
 */
class BudgetClient {
  /**
   * Fetches budget list with overview, categories, and insights.
   */
  async list(params?: {
    month?: string;
    year?: string;
    currency?: string;
  }): Promise<BudgetResponse> {
    const sp = new URLSearchParams();
    if (params?.month) sp.append('month', params.month);
    if (params?.year) sp.append('year', params.year);
    if (params?.currency) sp.append('currency', params.currency);
    const qs = sp.toString();
    return httpClient.request<BudgetResponse>(
      qs ? `/budgets?${qs}` : '/budgets'
    );
  }

  /**
   * Fetches aggregated budget totals for the selected period.
   */
  async overview(params?: {
    month?: string;
    year?: string;
    currency?: string;
  }): Promise<BudgetOverviewApi> {
    const sp = new URLSearchParams();
    if (params?.month) sp.append('month', params.month);
    if (params?.year) sp.append('year', params.year);
    if (params?.currency) sp.append('currency', params.currency);
    const qs = sp.toString();
    return httpClient.request<BudgetOverviewApi>(
      qs ? `/budgets/overview?${qs}` : '/budgets/overview'
    );
  }
}

export const budgetClient = new BudgetClient();
