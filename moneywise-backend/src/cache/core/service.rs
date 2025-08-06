// Generic cache service for MoneyWise backend
// Provides high-level caching operations with Redis backend
// This service is domain-agnostic and can be used by all cache domains

use redis::{Client, aio::ConnectionManager};
use tracing::{info, error};

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

        // Note: ConnectionManager in Redis crate 0.32 doesn't support custom configuration
        // The max_connections and connection_timeout from config are used for logging and
        // potential future configuration when Redis crate supports it
        let connection_manager = ConnectionManager::new(client)
            .await
            .map_err(|e| {
                error!("Failed to create Redis connection manager: {}", e);
                AppError::Internal(format!("Redis connection manager failed: {}", e))
            })?;

        info!("Redis cache service initialized successfully with {} max connections and {}s timeout",
              config.max_connections, config.connection_timeout.as_secs());
        Ok(Self {
            connection_manager,
            config,
        })
    }

    /// Generic method to cache any serializable data with a custom key and TTL
    pub async fn cache_data<T: serde::Serialize>(
        &self,
        key: &str,
        data: &T,
        ttl_seconds: usize,
    ) -> Result<()> {
        let value = serialize(data)?;

        set_with_ttl(
            &self.connection_manager,
            &self.config,
            key,
            &value,
            ttl_seconds,
        ).await
    }

    /// Generic method to retrieve cached data by key
    pub async fn get_cached_data<T: serde::de::DeserializeOwned>(
        &self,
        key: &str,
    ) -> Result<Option<T>> {
        get_value::<T>(
            &self.connection_manager,
            &self.config,
            key,
        ).await
    }

    /// Generic method to invalidate cache by key
    pub async fn invalidate_cache(&self, key: &str) -> Result<()> {
        delete_keys(
            &self.connection_manager,
            &self.config,
            &[key],
        ).await
    }

    /// Generic method to invalidate multiple cache keys
    pub async fn invalidate_multiple_keys(&self, keys: &[&str]) -> Result<()> {
        delete_keys(
            &self.connection_manager,
            &self.config,
            keys,
        ).await
    }

    /// Get the cache configuration
    pub fn config(&self) -> &CacheConfig {
        &self.config
    }
}