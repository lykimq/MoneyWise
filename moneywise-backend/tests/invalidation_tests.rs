//! Tests focused on invalidation flows.

mod common;

use rust_decimal::Decimal;
use moneywise_backend::{cache::CacheConfig, models::{BudgetOverviewApi, CategoryBudgetApi}};
use common::MockBudgetCache;

/// Test: invalidating a month removes both overview and categories entries
/// Why: asserts multi-key invalidation contract so UI doesn't mix fresh and stale data
/// Impact: ensures coherence of month views and documents invalidation breadth
#[tokio::test]
async fn month_invalidation_removes_overview_and_categories() {
    let cache = MockBudgetCache::new(CacheConfig::default());

    let overview = BudgetOverviewApi {
        planned: Decimal::from(1000),
        spent: Decimal::from(500),
        remaining: Decimal::from(500),
        currency: "USD".to_string(),
    };
    cache.cache_budget_overview("January", "2024", Some("USD"), &overview).await;
    let categories: Vec<CategoryBudgetApi> = vec![];
    cache.cache_category_budgets("January", "2024", Some("USD"), &categories).await;

    assert!(cache.get_cached_budget_overview("January", "2024", Some("USD")).await.is_some());
    assert!(cache.get_cached_category_budgets("January", "2024", Some("USD")).await.is_some());

    cache.invalidate_month_cache("January", "2024", Some("USD")).await;

    assert!(cache.get_cached_budget_overview("January", "2024", Some("USD")).await.is_none());
    assert!(cache.get_cached_category_budgets("January", "2024", Some("USD")).await.is_none());
}


