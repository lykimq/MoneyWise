// Auto-generated from rate-limits.json - DO NOT EDIT DIRECTLY


export const BUDGET_MODIFICATION_RATE_LIMIT_CONFIG = {
  maxRequests: 30,
  windowMs: 60000, // Convert seconds to milliseconds
  keyPrefix: 'budget_modification',
} as const;

export const BUDGET_READ_RATE_LIMIT_CONFIG = {
  maxRequests: 100,
  windowMs: 60000, // Convert seconds to milliseconds
  keyPrefix: 'budget_read',
} as const;

export const BUDGET_OVERVIEW_RATE_LIMIT_CONFIG = {
  maxRequests: 200,
  windowMs: 60000, // Convert seconds to milliseconds
  keyPrefix: 'budget_overview',
} as const;

export const RATE_LIMIT_CONFIGS = {
  budget_modification: BUDGET_MODIFICATION_RATE_LIMIT_CONFIG,
  budget_read: BUDGET_READ_RATE_LIMIT_CONFIG,
  budget_overview: BUDGET_OVERVIEW_RATE_LIMIT_CONFIG
} as const;