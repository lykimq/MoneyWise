#![allow(dead_code)]
// Purpose: Shared test utilities for cache-focused integration tests.
// Why: avoids duplication across test files by centralizing mock types.
// Impact: keeps tests concise and consistent, while permitting unused items
// in specific crates without noisy warnings.

pub mod mock_budget_cache;
pub mod mock_redis;

pub use mock_budget_cache::MockBudgetCache;
