// Main cache service for MoneyWise backend
// Provides high-level caching operations with Redis backend

use redis::{Client, aio::ConnectionManager};
use tracing::{info, error};

use crate::{
    error::{AppError, Result},
    models::*,
};

use crate::cache::{
    cache_config::CacheConfig,
    cache_keys::{overview_key, categories_key, budget_key},
    cache_serialization::serialize,
    cache_operations::{set_with_ttl, get_value, delete_keys},
};

/// Redis-based cache service for managing distributed caching operations
#[derive(Clone)]
pub struct CacheService {
    /// Redis connection manager for efficient connection pooling
    connection_manager: ConnectionManager,
    /// Cache configuration with TTL (time to live) settings and connection parameters
    config: CacheConfig,
}

impl CacheService {
    /// Creates a new Redis cache service with connection pooling
    pub async fn new(config: CacheConfig) -> Result<Self> {
        let client = Client::open(config.redis_url.clone())
            .map_err(|e| {
                error!("Failed to create Redis client: {}", e);
                AppError::Internal(format!("Redis connection failed: {}", e))
            })?;

        let connection_manager = ConnectionManager::new(client)
            .await
            .map_err(|e| {
                error!("Failed to create Redis connection manager: {}", e);
                AppError::Internal(format!("Redis connection manager failed: {}", e))
            })?;

        info!("Redis cache service initialized successfully");
        Ok(Self {
            connection_manager,
            config,
        })
    }

    /// Caches budget overview data with appropriate TTL
    pub async fn cache_budget_overview(
        &self,
        month: &str,
        year: &str,
        overview: &BudgetOverviewApi,
    ) -> Result<()> {
        let key = overview_key(month, year);
        let value = serialize(overview)?;
        let ttl_seconds = self.config.overview_ttl.as_secs() as usize;

        set_with_ttl(
            &self.connection_manager,
            &self.config,
            &key,
            &value,
            ttl_seconds,
        ).await
    }

    /// Retrieves cached budget overview data from Redis
    pub async fn get_cached_budget_overview(
        &self,
        month: &str,
        year: &str,
    ) -> Result<Option<BudgetOverviewApi>> {
        let key = overview_key(month, year);

        get_value::<BudgetOverviewApi>(
            &self.connection_manager,
            &self.config,
            &key,
        ).await
    }

    /// Caches category budget data with appropriate TTL
    pub async fn cache_category_budgets(
        &self,
        month: &str,
        year: &str,
        categories: &[CategoryBudgetApi],
    ) -> Result<()> {
        let key = categories_key(month, year);
        let value = serialize(&categories.to_vec())?;
        let ttl_seconds = self.config.categories_ttl.as_secs() as usize;

        set_with_ttl(
            &self.connection_manager,
            &self.config,
            &key,
            &value,
            ttl_seconds,
        ).await
    }

    /// Retrieves cached category budget data from Redis
    pub async fn get_cached_category_budgets(
        &self,
        month: &str,
        year: &str,
    ) -> Result<Option<Vec<CategoryBudgetApi>>> {
        let key = categories_key(month, year);

        get_value::<Vec<CategoryBudgetApi>>(
            &self.connection_manager,
            &self.config,
            &key,
        ).await
    }

    /// Caches individual budget data with TTL
    pub async fn cache_budget(
        &self,
        id: &str,
        budget: &BudgetApi,
    ) -> Result<()> {
        let key = budget_key(id);
        let value = serialize(budget)?;
        let ttl_seconds = self.config.budget_ttl.as_secs() as usize;

        set_with_ttl(
            &self.connection_manager,
            &self.config,
            &key,
            &value,
            ttl_seconds,
        ).await
    }

    /// Retrieves cached individual budget data from Redis
    pub async fn get_cached_budget(
        &self,
        id: &str,
    ) -> Result<Option<BudgetApi>> {
        let key = budget_key(id);

        get_value::<BudgetApi>(
            &self.connection_manager,
            &self.config,
            &key,
        ).await
    }

    /// Invalidates cache entries for a specific month/year
    pub async fn invalidate_month_cache(
        &self,
        month: &str,
        year: &str,
    ) -> Result<()> {
        let overview_key = overview_key(month, year);
        let categories_key = categories_key(month, year);

        delete_keys(
            &self.connection_manager,
            &self.config,
            &[&overview_key, &categories_key],
        ).await
    }

    /// Invalidates cache for a specific budget ID
    pub async fn invalidate_budget_cache(
        &self,
        id: &str,
    ) -> Result<()> {
        let key = budget_key(id);

        delete_keys(
            &self.connection_manager,
            &self.config,
            &[&key],
        ).await
    }
}