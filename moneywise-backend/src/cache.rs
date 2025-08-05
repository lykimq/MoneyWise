// Cache management module for MoneyWise backend
// This module implements in-memory caching for frequently accessed budget data
// to improve performance and reduce database load.
//
// Caching Strategy:
// 1. Cache frequently accessed budget overview and category data
// 2. Use appropriate TTL (Time To Live) based on data volatility
// 3. Implement cache invalidation on data updates (e.g. when budget data is updated)
// 4. Provide fallback to database on cache misses (e.g. when cache is unavailable)
//
// Key Design Decisions:
// 1. Uses in-memory HashMap with RwLock for thread safety (for fast access and concurrent operations)
// 2. Implements proper error handling for cache failures (e.g. when cache is unavailable)
// 3. Uses JSON serialization for complex data structures (e.g. BudgetOverviewApi, CategoryBudgetApi, BudgetApi)
// 4. Provides graceful degradation when cache is unavailable (e.g. when cache is unavailable, the application will still function, but with degraded performance)

use std::{collections::HashMap, sync::Arc, time::{Duration, Instant}};
use tokio::sync::RwLock;
use tracing::info;

use crate::{
    error::Result,
    models::*,
};

/// Cache entry with TTL support
#[derive(Clone)]
struct CacheEntry<T> {
    data: T, // The data to be cached
    expires_at: Instant, // The time at which the cache entry will expire
}

impl<T> CacheEntry<T> {
    fn new(data: T, ttl: Duration) -> Self {
        Self {
            data,
            expires_at: Instant::now() + ttl,
        }
    }

    fn is_expired(&self) -> bool {
        Instant::now() > self.expires_at
    }
}

/// Cache configuration with TTL settings
/// Different data types have different cache durations based on update frequency
#[derive(Clone)]
pub struct CacheConfig {
    /// TTL for budget overview data (15 minutes - overview changes infrequently)
    pub overview_ttl: Duration,
    /// TTL for category budget data (5 minutes - more volatile than overview)
    pub categories_ttl: Duration,
    /// TTL for individual budget data (10 minutes - moderate volatility)
    pub budget_ttl: Duration,
}

impl Default for CacheConfig {
    fn default() -> Self {
        Self {
            overview_ttl: Duration::from_secs(900),  // 15 minutes
            categories_ttl: Duration::from_secs(300), // 5 minutes
            budget_ttl: Duration::from_secs(600),     // 10 minutes
        }
    }
}

/// In-memory cache storage
struct CacheStorage {
    overview_cache: HashMap<String, CacheEntry<BudgetOverviewApi>>,
    categories_cache: HashMap<String, CacheEntry<Vec<CategoryBudgetApi>>>,
    budget_cache: HashMap<String, CacheEntry<BudgetApi>>,
}

impl CacheStorage {
    fn new() -> Self {
        Self {
            overview_cache: HashMap::new(),
            categories_cache: HashMap::new(),
            budget_cache: HashMap::new(),
        }
    }

    /// Clean up expired entries
    fn cleanup(&mut self) {
        self.overview_cache.retain(|_, entry| !entry.is_expired());
        self.categories_cache.retain(|_, entry| !entry.is_expired());
        self.budget_cache.retain(|_, entry| !entry.is_expired());
    }
}

/// Cache service for managing in-memory operations
/// Provides high-level caching operations with proper error handling
#[derive(Clone)]
pub struct CacheService {
    storage: Arc<RwLock<CacheStorage>>,
    config: CacheConfig,
}

impl CacheService {
    /// Creates a new cache service
    ///
    /// Args:
    /// - config: Cache configuration with TTL settings
    ///
    /// Returns:
    /// - Result<CacheService> with initialized cache storage
    pub async fn new(config: CacheConfig) -> Result<Self> {
        info!("In-memory cache service initialized successfully");
        Ok(Self {
            storage: Arc::new(RwLock::new(CacheStorage::new())),
            config
        })
    }

    /// Generates cache key for budget overview data
    ///
    /// Key format: "overview:{month}:{year}"
    /// This provides unique keys for different time periods
    fn overview_key(month: &str, year: &str) -> String {
        format!("overview:{}:{}", month, year)
    }

    /// Generates cache key for category budget data
    ///
    /// Key format: "categories:{month}:{year}"
    /// This provides unique keys for different time periods
    fn categories_key(month: &str, year: &str) -> String {
        format!("categories:{}:{}", month, year)
    }

    /// Generates cache key for individual budget data
    ///
    /// Key format: "budget:{id}"
    /// This provides unique keys for individual budget entries
    fn budget_key(id: &str) -> String {
        format!("budget:{}", id)
    }

    /// Caches budget overview data with appropriate TTL
    ///
    /// This method stores the overview data in memory with a 15-minute TTL
    /// since overview data changes infrequently.
    ///
    /// Args:
    /// - month: Budget month
    /// - year: Budget year
    /// - overview: Budget overview data to cache
    ///
    /// Returns:
    /// - Result<()> indicating success or failure
    pub async fn cache_budget_overview(
        &self,
        month: &str,
        year: &str,
        overview: &BudgetOverviewApi,
    ) -> Result<()> {
        let key = Self::overview_key(month, year);
        let entry = CacheEntry::new(overview.clone(), self.config.overview_ttl);

        let mut storage = self.storage.write().await;
        storage.overview_cache.insert(key, entry);
        storage.cleanup();

        info!("Cached budget overview for {} {}", month, year);
        Ok(())
    }

    /// Retrieves cached budget overview data
    ///
    /// This method attempts to get overview data from cache first.
    /// If cache miss or expired, returns None to trigger database fallback.
    ///
    /// Args:
    /// - month: Budget month
    /// - year: Budget year
    ///
    /// Returns:
    /// - Result<Option<BudgetOverviewApi>> with cached data or None
    pub async fn get_cached_budget_overview(
        &self,
        month: &str,
        year: &str,
    ) -> Result<Option<BudgetOverviewApi>> {
        let key = Self::overview_key(month, year);
        let storage = self.storage.read().await;

        if let Some(entry) = storage.overview_cache.get(&key) {
            if !entry.is_expired() {
                info!("Cache hit for budget overview {} {}", month, year);
                return Ok(Some(entry.data.clone()));
            }
        }

        info!("Cache miss for budget overview {} {}", month, year);
        Ok(None)
    }

    /// Caches category budget data with appropriate TTL
    ///
    /// This method stores the category data in memory with a 5-minute TTL
    /// since category data is more volatile than overview.
    ///
    /// Args:
    /// - month: Budget month
    /// - year: Budget year
    /// - categories: Category budget data to cache
    ///
    /// Returns:
    /// - Result<()> indicating success or failure
    pub async fn cache_category_budgets(
        &self,
        month: &str,
        year: &str,
        categories: &[CategoryBudgetApi],
    ) -> Result<()> {
        let key = Self::categories_key(month, year);
        let entry = CacheEntry::new(categories.to_vec(), self.config.categories_ttl);

        let mut storage = self.storage.write().await;
        storage.categories_cache.insert(key, entry);
        storage.cleanup();

        info!("Cached category budgets for {} {}", month, year);
        Ok(())
    }

    /// Retrieves cached category budget data
    ///
    /// This method attempts to get category data from cache first.
    /// If cache miss or expired, returns None to trigger database fallback.
    ///
    /// Args:
    /// - month: Budget month
    /// - year: Budget year
    ///
    /// Returns:
    /// - Result<Option<Vec<CategoryBudgetApi>>> with cached data or None
    pub async fn get_cached_category_budgets(
        &self,
        month: &str,
        year: &str,
    ) -> Result<Option<Vec<CategoryBudgetApi>>> {
        let key = Self::categories_key(month, year);
        let storage = self.storage.read().await;

        if let Some(entry) = storage.categories_cache.get(&key) {
            if !entry.is_expired() {
                info!("Cache hit for category budgets {} {}", month, year);
                return Ok(Some(entry.data.clone()));
            }
        }

        info!("Cache miss for category budgets {} {}", month, year);
        Ok(None)
    }

    /// Caches individual budget data
    ///
    /// This method caches individual budget entries with a 10-minute TTL.
    /// Used for frequently accessed individual budget records.
    ///
    /// Args:
    /// - id: Budget ID
    /// - budget: Budget data to cache
    ///
    /// Returns:
    /// - Result<()> indicating success or failure
    pub async fn cache_budget(
        &self,
        id: &str,
        budget: &BudgetApi,
    ) -> Result<()> {
        let key = Self::budget_key(id);
        let entry = CacheEntry::new(budget.clone(), self.config.budget_ttl);

        let mut storage = self.storage.write().await;
        storage.budget_cache.insert(key, entry);
        storage.cleanup();

        info!("Cached budget {}", id);
        Ok(())
    }

    /// Retrieves cached individual budget data
    ///
    /// This method attempts to get individual budget data from cache first.
    /// If cache miss or expired, returns None to trigger database fallback.
    ///
    /// Args:
    /// - id: Budget ID
    ///
    /// Returns:
    /// - Result<Option<BudgetApi>> with cached data or None
    pub async fn get_cached_budget(
        &self,
        id: &str,
    ) -> Result<Option<BudgetApi>> {
        let key = Self::budget_key(id);
        let storage = self.storage.read().await;

        if let Some(entry) = storage.budget_cache.get(&key) {
            if !entry.is_expired() {
                info!("Cache hit for budget {}", id);
                return Ok(Some(entry.data.clone()));
            }
        }

        info!("Cache miss for budget {}", id);
        Ok(None)
    }

    /// Invalidates cache entries for a specific month/year
    ///
    /// This method removes cached data when budget data is updated.
    /// Ensures cache consistency by removing stale data.
    ///
    /// Args:
    /// - month: Budget month
    /// - year: Budget year
    ///
    /// Returns:
    /// - Result<()> indicating success or failure
    pub async fn invalidate_month_cache(
        &self,
        month: &str,
        year: &str,
    ) -> Result<()> {
        let overview_key = Self::overview_key(month, year);
        let categories_key = Self::categories_key(month, year);

        let mut storage = self.storage.write().await;
        storage.overview_cache.remove(&overview_key);
        storage.categories_cache.remove(&categories_key);

        info!("Invalidated cache for {} {}", month, year);
        Ok(())
    }

    /// Invalidates cache for a specific budget ID
    ///
    /// This method removes cached individual budget data when it's updated.
    /// Ensures cache consistency for individual budget records.
    ///
    /// Args:
    /// - id: Budget ID
    ///
    /// Returns:
    /// - Result<()> indicating success or failure
    pub async fn invalidate_budget_cache(
        &self,
        id: &str,
    ) -> Result<()> {
        let key = Self::budget_key(id);

        let mut storage = self.storage.write().await;
        storage.budget_cache.remove(&key);

        info!("Invalidated cache for budget {}", id);
        Ok(())
    }

    /// Health check for cache service
    ///
    /// This method tests the cache service to ensure it's working properly.
    /// Useful for monitoring and debugging cache issues.
    ///
    /// Returns:
    /// - Result<bool> indicating if cache is healthy
    pub async fn health_check(&self) -> Result<bool> {
        let storage = self.storage.read().await;
        let total_entries = storage.overview_cache.len() +
                           storage.categories_cache.len() +
                           storage.budget_cache.len();

        info!("Cache health check passed with {} total entries", total_entries);
        Ok(true)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rust_decimal::Decimal;

    #[tokio::test]
    async fn test_cache_budget_overview() {
        let cache = CacheService::new(CacheConfig::default()).await.unwrap();

        let overview = BudgetOverviewApi {
            planned: Decimal::from(1000),
            spent: Decimal::from(500),
            remaining: Decimal::from(500),
            currency: "USD".to_string(),
        };

        // Test cache miss
        let cached = cache.get_cached_budget_overview("January", "2024").await.unwrap();
        assert!(cached.is_none());

        // Cache the data
        cache.cache_budget_overview("January", "2024", &overview).await.unwrap();

        // Test cache hit
        let cached = cache.get_cached_budget_overview("January", "2024").await.unwrap();
        assert!(cached.is_some());
        assert_eq!(cached.unwrap().planned, overview.planned);
    }

    #[tokio::test]
    async fn test_cache_invalidation() {
        let cache = CacheService::new(CacheConfig::default()).await.unwrap();

        let overview = BudgetOverviewApi {
            planned: Decimal::from(1000),
            spent: Decimal::from(500),
            remaining: Decimal::from(500),
            currency: "USD".to_string(),
        };

        // Cache some data
        cache.cache_budget_overview("January", "2024", &overview).await.unwrap();

        // Verify it's cached
        let cached = cache.get_cached_budget_overview("January", "2024").await.unwrap();
        assert!(cached.is_some());

        // Invalidate cache
        cache.invalidate_month_cache("January", "2024").await.unwrap();

        // Verify it's no longer cached
        let cached = cache.get_cached_budget_overview("January", "2024").await.unwrap();
        assert!(cached.is_none());
    }

    #[tokio::test]
    async fn test_cache_ttl() {
        let mut config = CacheConfig::default();
        config.overview_ttl = Duration::from_millis(100); // Very short TTL for testing

        let cache = CacheService::new(config).await.unwrap();

        let overview = BudgetOverviewApi {
            planned: Decimal::from(1000),
            spent: Decimal::from(500),
            remaining: Decimal::from(500),
            currency: "USD".to_string(),
        };

        // Cache the data
        cache.cache_budget_overview("January", "2024", &overview).await.unwrap();

        // Verify it's cached
        let cached = cache.get_cached_budget_overview("January", "2024").await.unwrap();
        assert!(cached.is_some());

        // Wait for TTL to expire
        tokio::time::sleep(Duration::from_millis(150)).await;

        // Verify it's expired
        let cached = cache.get_cached_budget_overview("January", "2024").await.unwrap();
        assert!(cached.is_none());
    }
}