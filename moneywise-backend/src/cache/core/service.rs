// Generic cache service for MoneyWise backend
// Provides high-level caching operations with Redis backend
// This service is domain-agnostic and can be used by all cache domains

use redis::{Client, aio::ConnectionManager};
use tracing::{info, error};
use std::sync::{Arc, atomic::{AtomicUsize, Ordering}};

use crate::{
    error::{AppError, Result},
};

use crate::cache::core::{
    config::CacheConfig,
    serialization::serialize,
    operations::{set_with_ttl, get_value, delete_keys},
};

/// Generic Redis-based cache service for managing distributed caching operations
/// This service is domain-agnostic and provides core caching functionality
#[derive(Clone)]
pub struct CacheService {
    /// Simple pool of Redis connection managers for concurrency
    connection_pool: Arc<Vec<ConnectionManager>>,
    /// Next index for round-robin selection
    next_index: Arc<AtomicUsize>,
    /// Cache configuration with TTL (time to live) settings and connection parameters
    config: CacheConfig,
}

impl CacheService {
    /// Creates a new Redis cache service with connection pooling
    pub async fn new(config: CacheConfig) -> Result<Self> {
        // Build a simple pool of ConnectionManager instances to honor max_connections
        let mut pool = Vec::with_capacity(config.max_connections);
        for _ in 0..config.max_connections {
            let client = Client::open(config.redis_url.clone())
                .map_err(|e| {
                    error!("Failed to create Redis client: {}", e);
                    AppError::Cache(e)
                })?;
            let manager = ConnectionManager::new(client).await.map_err(|e| {
                error!("Failed to create Redis connection manager: {}", e);
                AppError::Cache(e)
            })?;
            pool.push(manager);
        }

        info!(
            "Redis cache service initialized with a pool of {} connections (timeout {}s)",
            config.max_connections,
            config.connection_timeout.as_secs()
        );

        Ok(Self {
            connection_pool: Arc::new(pool),
            next_index: Arc::new(AtomicUsize::new(0)),
            config,
        })
    }

    fn select_connection(&self) -> &ConnectionManager {
        let idx = self
            .next_index
            .fetch_add(1, Ordering::Relaxed) % self.connection_pool.len();
        &self.connection_pool[idx]
    }

    /// Generic method to cache any serializable data with a custom key and TTL
    pub async fn cache_data<T: serde::Serialize>(
        &self,
        key: &str,
        data: &T,
        ttl_seconds: usize,
    ) -> Result<()> {
        let value = serialize(data)?;

        let conn = self.select_connection().clone();
        set_with_ttl(
            &conn,
            &self.config,
            key,
            &value,
            ttl_seconds,
        ).await
    }

    /// Generic method to retrieve cached data by key
    pub async fn get_cached_data<T: serde::de::DeserializeOwned + Send + 'static>(
        &self,
        key: &str,
    ) -> Result<Option<T>> {
        let conn = self.select_connection().clone();
        get_value::<T>(
            &conn,
            &self.config,
            key,
        ).await
    }

    /// Generic method to invalidate cache by key
    pub async fn invalidate_cache(&self, key: &str) -> Result<()> {
        let conn = self.select_connection().clone();
        delete_keys(
            &conn,
            &self.config,
            &[key],
        ).await
    }

    /// Generic method to invalidate multiple cache keys
    pub async fn invalidate_multiple_keys(&self, keys: &[&str]) -> Result<()> {
        let conn = self.select_connection().clone();
        delete_keys(
            &conn,
            &self.config,
            keys,
        ).await
    }

    /// Get the cache configuration
    pub fn config(&self) -> &CacheConfig {
        &self.config
    }
}