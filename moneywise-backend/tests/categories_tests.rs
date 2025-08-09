//! Tests for category budgets cache behavior.

mod common;

use rust_decimal::Decimal;
use moneywise_backend::{cache::CacheConfig, models::CategoryBudgetApi};
use common::MockBudgetCache;

/// Test: cache a month of category budgets and fetch the collection back
/// Why: demonstrates the collection shape and ensures ordering/serialization remain stable
/// Impact: gives confidence that category pages can leverage the cache without surprises
#[tokio::test]
async fn categories_roundtrip() {
    let cache = MockBudgetCache::new(CacheConfig::default());
    let categories = vec![
        CategoryBudgetApi {
            id: "1".to_string(),
            category_name: "Food".to_string(),
            group_name: Some("Essentials".to_string()),
            category_color: "#FF0000".to_string(),
            group_color: Some("#CC0000".to_string()),
            planned: Decimal::from(300),
            spent: Decimal::from(150),
            remaining: Decimal::from(150),
            percentage: Decimal::from(50),
            currency: "USD".to_string(),
        },
        CategoryBudgetApi {
            id: "2".to_string(),
            category_name: "Transport".to_string(),
            group_name: Some("Essentials".to_string()),
            category_color: "#00FF00".to_string(),
            group_color: Some("#00CC00".to_string()),
            planned: Decimal::from(200),
            spent: Decimal::from(100),
            remaining: Decimal::from(100),
            percentage: Decimal::from(50),
            currency: "USD".to_string(),
        },
    ];

    assert!(cache.get_cached_category_budgets("January", "2024", Some("USD")).await.is_none());
    cache.cache_category_budgets("January", "2024", Some("USD"), &categories).await;
    let cached = cache.get_cached_category_budgets("January", "2024", Some("USD")).await;
    assert!(cached.is_some());
    let cached_categories = cached.unwrap();
    assert_eq!(cached_categories.len(), 2);
    assert_eq!(cached_categories[0].category_name, "Food");
    assert_eq!(cached_categories[1].category_name, "Transport");
}


