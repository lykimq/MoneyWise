// Budget domain cache implementation for MoneyWise backend
// This module provides budget-specific caching functionality

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
/// with budget-specific key generation and TTL management
#[derive(Clone)]
pub struct BudgetCache {
    /// Generic cache service for core operations
    cache_service: CacheService,
}

impl BudgetCache {
    /// Creates a new budget cache service
    pub async fn new(config: CacheConfig) -> Result<Self> {
        let cache_service = CacheService::new(config).await?;
        Ok(Self { cache_service })
    }

    /// Caches budget overview data with appropriate TTL
    pub async fn cache_budget_overview(
        &self,
        month: &str,
        year: &str,
        overview: &BudgetOverviewApi,
    ) -> Result<()> {
        let key = keys::overview_key(month, year);
        let ttl_seconds = self.cache_service.config().overview_ttl.as_secs() as usize;

        self.cache_service.cache_data(&key, overview, ttl_seconds).await
    }

    /// Retrieves cached budget overview data from Redis
    pub async fn get_cached_budget_overview(
        &self,
        month: &str,
        year: &str,
    ) -> Result<Option<BudgetOverviewApi>> {
        let key = keys::overview_key(month, year);

        self.cache_service.get_cached_data::<BudgetOverviewApi>(&key).await
    }

    /// Caches category budget data with appropriate TTL
    pub async fn cache_category_budgets(
        &self,
        month: &str,
        year: &str,
        categories: &[CategoryBudgetApi],
    ) -> Result<()> {
        let key = keys::categories_key(month, year);
        let ttl_seconds = self.cache_service.config().categories_ttl.as_secs() as usize;

        self.cache_service.cache_data(&key, &categories.to_vec(), ttl_seconds).await
    }

    /// Retrieves cached category budget data from Redis
    pub async fn get_cached_category_budgets(
        &self,
        month: &str,
        year: &str,
    ) -> Result<Option<Vec<CategoryBudgetApi>>> {
        let key = keys::categories_key(month, year);

        self.cache_service.get_cached_data::<Vec<CategoryBudgetApi>>(&key).await
    }

    /// Caches individual budget data with TTL
    pub async fn cache_budget(
        &self,
        id: &str,
        budget: &BudgetApi,
    ) -> Result<()> {
        let key = keys::budget_key(id);
        let ttl_seconds = self.cache_service.config().budget_ttl.as_secs() as usize;

        self.cache_service.cache_data(&key, budget, ttl_seconds).await
    }

    /// Retrieves cached individual budget data from Redis
    pub async fn get_cached_budget(
        &self,
        id: &str,
    ) -> Result<Option<BudgetApi>> {
        let key = keys::budget_key(id);

        self.cache_service.get_cached_data::<BudgetApi>(&key).await
    }

    /// Invalidates cache entries for a specific month/year
    pub async fn invalidate_month_cache(
        &self,
        month: &str,
        year: &str,
    ) -> Result<()> {
        let overview_key = keys::overview_key(month, year);
        let categories_key = keys::categories_key(month, year);

        self.cache_service.invalidate_multiple_keys(&[&overview_key, &categories_key]).await
    }

    /// Invalidates cache for a specific budget ID
    pub async fn invalidate_budget_cache(
        &self,
        id: &str,
    ) -> Result<()> {
        let key = keys::budget_key(id);

        self.cache_service.invalidate_cache(&key).await
    }

}