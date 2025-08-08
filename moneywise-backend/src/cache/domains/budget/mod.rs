//! Budget domain cache implementation for MoneyWise backend.
//!
//! Provides budget-specific caching functionality on top of the generic
//! `CacheService`, including key management and TTL selection.
//!

pub mod keys;

use crate::{
    error::Result,
    models::*,
};

use crate::cache::core::{
    service::CacheService,
    config::CacheConfig,
};

/// Budget-specific cache service that wraps the generic cache service
/// with budget-specific key generation and TTL management.
#[derive(Clone)]
pub struct BudgetCache {
    /// Generic cache service for core operations
    cache_service: CacheService,
}

impl BudgetCache {
    /// Create a new budget cache service.
    pub async fn new(config: CacheConfig) -> Result<Self> {
        let cache_service = CacheService::new(config).await?;
        Ok(Self { cache_service })
    }

    /// Cache budget overview data with appropriate TTL.
    pub async fn cache_budget_overview(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
        overview: &BudgetOverviewApi,
    ) -> Result<()> {
        let key = keys::overview_key(month, year, currency);
        let ttl_seconds = self.cache_service.config().overview_ttl.as_secs() as usize;

        self.cache_service.cache_data(&key, overview, ttl_seconds).await
    }

    /// Retrieve cached budget overview data from Redis.
    pub async fn get_cached_budget_overview(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
    ) -> Result<Option<BudgetOverviewApi>> {
        let key = keys::overview_key(month, year, currency);

        self.cache_service.get_cached_data::<BudgetOverviewApi>(&key).await
    }

    /// Cache category budget data with appropriate TTL.
    pub async fn cache_category_budgets(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
        categories: &[CategoryBudgetApi],
    ) -> Result<()> {
        let key = keys::categories_key(month, year, currency);
        let ttl_seconds = self.cache_service.config().categories_ttl.as_secs() as usize;

        self.cache_service.cache_data(&key, &categories.to_vec(), ttl_seconds).await
    }

    /// Retrieve cached category budget data from Redis.
    pub async fn get_cached_category_budgets(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
    ) -> Result<Option<Vec<CategoryBudgetApi>>> {
        let key = keys::categories_key(month, year, currency);

        self.cache_service.get_cached_data::<Vec<CategoryBudgetApi>>(&key).await
    }

    /// Cache individual budget data with TTL.
    pub async fn cache_budget(
        &self,
        id: &str,
        budget: &BudgetApi,
    ) -> Result<()> {
        let key = keys::budget_key(id);
        let ttl_seconds = self.cache_service.config().budget_ttl.as_secs() as usize;

        self.cache_service.cache_data(&key, budget, ttl_seconds).await
    }

    /// Retrieve cached individual budget data from Redis.
    pub async fn get_cached_budget(
        &self,
        id: &str,
    ) -> Result<Option<BudgetApi>> {
        let key = keys::budget_key(id);

        self.cache_service.get_cached_data::<BudgetApi>(&key).await
    }

    /// Invalidate cache entries for a specific month/year (overview + categories).
    pub async fn invalidate_month_cache(
        &self,
        month: &str,
        year: &str,
        currency: Option<&str>,
    ) -> Result<()> {
        let overview_key = keys::overview_key(month, year, currency);
        let categories_key = keys::categories_key(month, year, currency);

        self.cache_service.invalidate_multiple_keys(&[&overview_key, &categories_key]).await
    }

    /// Invalidate cache for a specific budget ID.
    pub async fn invalidate_budget_cache(
        &self,
        id: &str,
    ) -> Result<()> {
        let key = keys::budget_key(id);

        self.cache_service.invalidate_cache(&key).await
    }

}