//! Tests for budget overview cache behavior (miss → set → hit, TTL).

mod common;

use std::time::Duration;
use rust_decimal::Decimal;
use moneywise_backend::{cache::CacheConfig, models::BudgetOverviewApi};
use common::MockBudgetCache;

/// Test: miss → set → hit flow for budget overview
/// Why: documents basic cache usage and verifies key construction + serialization
/// Impact: provides a minimal, readable example for learners
#[tokio::test]
async fn overview_miss_set_hit() {
    let cache = MockBudgetCache::new(CacheConfig::default());

    let overview = BudgetOverviewApi {
        planned: Decimal::from(1000),
        spent: Decimal::from(500),
        remaining: Decimal::from(500),
        currency: "USD".to_string(),
    };

    assert!(cache.get_cached_budget_overview("January", "2024", Some("USD")).await.is_none());
    cache.cache_budget_overview("January", "2024", Some("USD"), &overview).await;
    let cached = cache.get_cached_budget_overview("January", "2024", Some("USD")).await;
    assert!(cached.is_some());
    assert_eq!(cached.unwrap().planned, overview.planned);
}

/// Test: TTL expiration is honored for overview entries
/// Why: validates time-based invalidation and tests small TTLs deterministically
/// Impact: avoids stale data lingering beyond configured lifetime
#[tokio::test]
async fn ttl_expiration_observed() {
    let mut cfg = CacheConfig::default();

    // set a small TTL to test expiration
    cfg.overview_ttl = Duration::from_millis(150);

    let cache = MockBudgetCache::new(cfg);

    let overview = BudgetOverviewApi {
        planned: Decimal::from(1),
        spent: Decimal::from(0),
        remaining: Decimal::from(1),
        currency: "USD".to_string(),
    };

    // cache the overview
    cache.cache_budget_overview("Feb", "2025", Some("USD"), &overview).await;

    // verify the overview is cached
    assert!(cache.get_cached_budget_overview("Feb", "2025", Some("USD")).await.is_some());

    // sleep for longer than the TTL
    tokio::time::sleep(Duration::from_millis(250)).await;

    // verify the overview is not cached
    assert!(cache.get_cached_budget_overview("Feb", "2025", Some("USD")).await.is_none());
}

/// Test: corrupt cached overview self-heals by deleting bad data
/// Why: resilience against partial writes or schema mismatches; avoids repeated deserialization errors
/// Impact: favors availability—subsequent reads become clean cache misses
#[tokio::test]
async fn corrupt_overview_self_heals() {
    let cache = MockBudgetCache::new(CacheConfig::default());

    // Manually insert corrupt JSON
    let key = moneywise_backend::cache::domains::budget::keys::overview_key("Mar", "2025", Some("USD"));
    cache.mock.set(key.clone(), "{not-json".to_string(), None).await;

    // First read should observe corruption, delete the key, and return None
    assert!(cache.get_cached_budget_overview("Mar", "2025", Some("USD")).await.is_none());

    // Second read should be a miss (key deleted)
    assert!(cache.get_cached_budget_overview("Mar", "2025", Some("USD")).await.is_none());
}


