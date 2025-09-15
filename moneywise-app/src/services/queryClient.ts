/**
 * TanStack Query configuration for MoneyWise app with caching and error handling.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query client with optimized settings for financial data caching and reliability.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry client errors (4xx), retry server errors (5xx)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: 'online',
    },
    mutations: {
      retry: 1, // Avoid duplicate transactions
      networkMode: 'online',
    },
  },
});

/**
 * Query keys factory for consistent cache identification.
 */
export const queryKeys = {
  budgets: {
    overview: (params: { month?: string; year?: string; currency?: string }) =>
      ['budgets', 'overview', params] as const,
    data: (params: {
      timePeriod: string;
      month?: string;
      year?: string;
      currency?: string;
    }) => ['budgets', 'data', params] as const,
  },
} as const;
