//! Domain-aligned cache wrapper over the mock Redis backend.

use moneywise_backend::cache::core::serialization::{deserialize, serialize};
use moneywise_backend::cache::{domains::budget::keys, CacheConfig};
use moneywise_backend::models::{
    BudgetApi, BudgetOverviewApi, CategoryBudgetApi,
};

use crate::common::mock_redis::MockRedis;

/// Lightweight, domain-specific cache façade used only within tests.
///
/// Why this type?
/// - Keeps tests focused on domain keys and models (`BudgetOverviewApi`, `CategoryBudgetApi`, `BudgetApi`).
/// - Delegates low-level behaviors (TTL, LRU, memory) to `MockRedis` while mirroring production APIs.
/// - Encodes self-healing on corrupt data to match real cache service behavior.
#[derive(Clone)]
pub struct MockBudgetCache {
    pub mock: MockRedis,
    pub config: CacheConfig,
}

impl MockBudgetCache {
    pub fn new(config: CacheConfig) -> Self {
        let mock = MockRedis::new(
            64 * 1024,
            crate::common::mock_redis::EvictionPolicy::AllKeysLru,
        );
        Self { mock, config }
    }

    /// Store a month-level `BudgetOverviewApi` under a stable domain key.
    /// Uses `overview_ttl` from `CacheConfig`.
    pub async fn cache_budget_overview(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
        overview: &BudgetOverviewApi,
    ) {
        let key = keys::overview_key(month, year, currency);
        let json = serialize(overview).unwrap();
        self.mock
            .set(key, json, Some(self.config.overview_ttl))
            .await;
    }

    /// Fetch a month-level `BudgetOverviewApi`, self-healing on corrupt payloads.
    pub async fn get_cached_budget_overview(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
    ) -> Option<BudgetOverviewApi> {
        let key = keys::overview_key(month, year, currency);
        if let Some(json) = self.mock.get(&key).await {
            match deserialize::<BudgetOverviewApi>(json) {
                Ok(Some(v)) => Some(v),
                // Self-heal on corrupt data: delete and return None
                _ => {
                    self.mock.delete(&key).await;
                    None
                }
            }
        } else {
            None
        }
    }

    /// Store category-level budgets slice for a given month/year.
    /// Uses `categories_ttl` from `CacheConfig`.
    pub async fn cache_category_budgets(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
        categories: &[CategoryBudgetApi],
    ) {
        let key = keys::categories_key(month, year, currency);
        let json = serialize(&categories.to_vec()).unwrap();
        self.mock
            .set(key, json, Some(self.config.categories_ttl))
            .await;
    }

    /// Fetch category-level budgets, deleting the key if deserialization fails.
    pub async fn get_cached_category_budgets(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
    ) -> Option<Vec<CategoryBudgetApi>> {
        let key = keys::categories_key(month, year, currency);
        if let Some(json) = self.mock.get(&key).await {
            match deserialize::<Vec<CategoryBudgetApi>>(json) {
                Ok(Some(v)) => Some(v),
                _ => {
                    self.mock.delete(&key).await;
                    None
                }
            }
        } else {
            None
        }
    }

    /// Store an individual `BudgetApi` by id. Uses `budget_ttl`.
    pub async fn cache_budget(&self, id: &str, budget: &BudgetApi) {
        let key = keys::budget_key(id);
        let json = serialize(budget).unwrap();
        self.mock.set(key, json, Some(self.config.budget_ttl)).await;
    }

    /// Fetch an individual `BudgetApi` by id, deleting corrupt entries.
    pub async fn get_cached_budget(&self, id: &str) -> Option<BudgetApi> {
        let key = keys::budget_key(id);
        if let Some(json) = self.mock.get(&key).await {
            match deserialize::<BudgetApi>(json) {
                Ok(Some(v)) => Some(v),
                _ => {
                    self.mock.delete(&key).await;
                    None
                }
            }
        } else {
            None
        }
    }

    /// Invalidate both overview and categories for a given month/year.
    pub async fn invalidate_month_cache(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
    ) {
        let overview_key = keys::overview_key(month, year, currency);
        let categories_key = keys::categories_key(month, year, currency);
        self.mock.delete(&overview_key).await;
        self.mock.delete(&categories_key).await;
    }

    /// Invalidate a single budget item by id.
    pub async fn invalidate_budget_cache(&self, id: &str) {
        let key = keys::budget_key(id);
        self.mock.delete(&key).await;
    }
}
