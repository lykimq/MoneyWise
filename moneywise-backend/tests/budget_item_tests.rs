//! Tests for individual budget item caching + invalidation.

mod common;

use rust_decimal::Decimal;
use moneywise_backend::{cache::CacheConfig, models::BudgetApi};
use common::MockBudgetCache;

/// Test: cache a single budget item, read back, then invalidate
/// Why: verifies roundtrip serialization, keying, and explicit invalidation behavior
/// Impact: prevents regressions in item-level caching and documents the intended API usage
#[tokio::test]
async fn budget_roundtrip_and_invalidate() {
    let cache = MockBudgetCache::new(CacheConfig::default());
    let budget = BudgetApi {
        id: "budget-123".to_string(),
        month: 1,
        year: 2024,
        category_id: "category-1".to_string(),
        planned: Decimal::from(1000),
        spent: Decimal::from(500),
        carryover: Decimal::from(0),
        currency: "USD".to_string(),
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    assert!(cache.get_cached_budget(&budget.id).await.is_none());
    cache.cache_budget(&budget.id, &budget).await;
    let cached_budget = cache.get_cached_budget(&budget.id).await.unwrap();
    assert_eq!(cached_budget.id, budget.id);
    assert_eq!(cached_budget.category_id, budget.category_id);
    assert_eq!(cached_budget.planned, budget.planned);

    cache.invalidate_budget_cache(&budget.id).await;
    assert!(cache.get_cached_budget(&budget.id).await.is_none());
}


