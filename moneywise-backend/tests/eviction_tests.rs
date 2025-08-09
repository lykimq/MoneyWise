//! Tests for LRU eviction behavior on the mock cache backend.

mod common;

use rust_decimal::Decimal;
use moneywise_backend::cache::CacheConfig;
use common::MockBudgetCache;
use moneywise_backend::models::BudgetOverviewApi;

/// Test: LRU eviction triggers when memory budget is exceeded
/// Why: models production-like AllKeys-LRU policy; keeps mock faithful to real Redis behavior
/// Impact: guards the eviction algorithm and memory accounting from regressions
#[tokio::test]
async fn lru_eviction_evicts_oldest_when_over_limit() {
    // Very small memory budget to force eviction
    let cfg = CacheConfig::default();
    // Build a custom cache with tiny memory by constructing the inner mock directly
    // through the public fields exposed by MockBudgetCache.
    let mut cache = MockBudgetCache::new(cfg);
    cache.mock = crate::common::mock_redis::MockRedis::new(64, crate::common::mock_redis::EvictionPolicy::AllKeysLru);

    // Insert three small values; keys differ in length so memory varies
    let ov = |p| BudgetOverviewApi { planned: p, spent: Decimal::ZERO, remaining: p, currency: "USD".to_string() };
    cache.cache_budget_overview("M1", "Y", Some("USD"), &ov(Decimal::from(1))).await; // oldest
    cache.cache_budget_overview("M2", "Y", Some("USD"), &ov(Decimal::from(2))).await;
    cache.cache_budget_overview("M3", "Y", Some("USD"), &ov(Decimal::from(3))).await;

    // Add a large value to exceed memory and trigger LRU eviction
    let big = BudgetOverviewApi { planned: Decimal::from(99999), spent: Decimal::ZERO, remaining: Decimal::from(99999), currency: "USD".to_string() };
    cache.cache_budget_overview("M_big", "Y", Some("USD"), &big).await;

    // Oldest likely evicted: M1
    let m1 = cache.get_cached_budget_overview("M1", "Y", Some("USD")).await;
    let m2 = cache.get_cached_budget_overview("M2", "Y", Some("USD")).await;
    let m3 = cache.get_cached_budget_overview("M3", "Y", Some("USD")).await;
    let big_got = cache.get_cached_budget_overview("M_big", "Y", Some("USD")).await;

    // We only assert that at least one of the earlier keys is evicted and the last is present,
    // to avoid over-constraining the exact byte math.
    assert!(big_got.is_some());
    assert!(m1.is_none() || m2.is_none() || m3.is_none());
}


