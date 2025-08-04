const API_BASE_URL = 'http://localhost:3000/api';

export interface BudgetOverview {
    planned: number;
    spent: number;
    remaining: number;
    currency: string;
}

export interface CategoryBudget {
    id: string;
    category_name: string;
    group_name: string;
    category_color: string;
    group_color: string;
    planned: number;
    spent: number;
    remaining: number;
    percentage: number;
    currency: string;
}

export interface BudgetInsight {
    type_: string;
    message: string;
    icon: string;
    color: string;
}

export interface BudgetResponse {
    overview: BudgetOverview;
    categories: CategoryBudget[];
    insights: BudgetInsight[];
}

export interface CreateBudgetRequest {
    category_id: string;
    planned: number;
    currency: string;
    month: string;
    year: string;
}

export interface UpdateBudgetRequest {
    planned?: number;
    carryover?: number;
}

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Budget endpoints
    async getBudgets(params?: {
        month?: string;
        year?: string;
        period?: string;
    }): Promise<BudgetResponse> {
        const searchParams = new URLSearchParams();
        if (params?.month) searchParams.append('month', params.month);
        if (params?.year) searchParams.append('year', params.year);
        if (params?.period) searchParams.append('period', params.period);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/budgets?${queryString}` : '/budgets';

        return this.request<BudgetResponse>(endpoint);
    }

    async getBudgetOverview(params?: {
        month?: string;
        year?: string;
        period?: string;
    }): Promise<BudgetOverview> {
        const searchParams = new URLSearchParams();
        if (params?.month) searchParams.append('month', params.month);
        if (params?.year) searchParams.append('year', params.year);
        if (params?.period) searchParams.append('period', params.period);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/budgets/overview?${queryString}` : '/budgets/overview';

        return this.request<BudgetOverview>(endpoint);
    }

    async createBudget(budget: CreateBudgetRequest): Promise<any> {
        return this.request('/budgets', {
            method: 'POST',
            body: JSON.stringify(budget),
        });
    }

    async updateBudget(id: string, budget: UpdateBudgetRequest): Promise<any> {
        return this.request(`/budgets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(budget),
        });
    }

    async getBudgetById(id: string): Promise<any> {
        return this.request(`/budgets/${id}`);
    }
}

export const apiService = new ApiService();
export default apiService;