// Core Redis operations for cache management
// Provides low-level Redis operations with proper error handling

use redis::{aio::ConnectionManager, AsyncCommands};
use tracing::{debug, warn, error};

use crate::error::{AppError, Result};
use crate::cache::core::retry::with_retry;
use crate::cache::core::serialization::deserialize;
use crate::cache::core::config::CacheConfig;

/// Sets a key-value pair in Redis with TTL
/// Uses SETEX for atomic TTL setting
pub async fn set_with_ttl(
    conn: &ConnectionManager,
    config: &CacheConfig,
    key: &str,
    value: &str,
    ttl_seconds: usize,
) -> Result<()> {
    let conn = conn.clone();
    let key = key.to_string();
    let value = value.to_string();

    with_retry(config, || {
        let key = key.clone();
        let value = value.clone();
        let mut conn = conn.clone();

        async move {
            match conn.set_ex::<_, _, ()>(&key, &value, ttl_seconds as u64).await {
                Ok(_) => {
                    debug!("Cached data for key {} with TTL {}s", key, ttl_seconds);
                    Ok(())
                }
                Err(e) => {
                    warn!("Failed to cache data for key {}: {}", key, e);
                    Err(AppError::from(e))
                }
            }
        }
    }).await
}

/// Gets a value from Redis by key
/// Returns deserialized data or None if not found
pub async fn get_value<T: serde::de::DeserializeOwned + Send + 'static>(
    conn: &ConnectionManager,
    config: &CacheConfig,
    key: &str,
) -> Result<Option<T>> {
    let conn = conn.clone();
    let key = key.to_string();

    match with_retry(config, || {
        let key = key.clone();
        let mut conn = conn.clone();

        async move {
            match conn.get::<_, Option<String>>(&key).await {
                Ok(Some(json)) => {
                    match deserialize::<T>(json) {
                        Ok(Some(data)) => {
                            debug!("Cache hit for key {}", key);
                            Ok(Some(data))
                        }
                        Ok(None) => {
                            warn!("Invalid cached data for key {}", key);
                            Ok(None)
                        }
                        Err(e) => {
                            error!("Failed to deserialize cached data for key {}: {}", key, e);
                            // Self-heal: purge the corrupt key and return None
                            // Clone again inside to satisfy Send bounds for retry wrapper
                            let inner_conn = conn.clone();
                            let inner_key = key.clone();
                            let keys: [&str; 1] = [&inner_key];
                            let _ = delete_keys(&inner_conn, config, &keys).await;
                            Ok(None)
                        }
                    }
                }
                Ok(None) => {
                    debug!("Cache miss for key {}", key);
                    Ok(None)
                }
                Err(e) => {
                    warn!("Redis error for key {}: {}", key, e);
                    Err(AppError::from(e))
                }
            }
        }
    }).await {
        Ok(result) => Ok(result),
        Err(_) => {
            // Graceful degradation - fall back to database on retry failure
            warn!("Redis retry failed for key {}, falling back to database", key);
            Ok(None)
        }
    }
}

/// Deletes keys from Redis
/// Supports single key or multiple keys deletion
pub async fn delete_keys(
    conn: &ConnectionManager,
    config: &CacheConfig,
    keys: &[&str],
) -> Result<()> {
    let conn = conn.clone();
    let keys: Vec<String> = keys.iter().map(|k| k.to_string()).collect();

    match with_retry(config, || {
        let keys = keys.clone();
        let mut conn = conn.clone();

        async move {
            match conn.del::<_, ()>(&keys).await {
                Ok(_) => {
                    debug!("Deleted keys: {:?}", keys);
                    Ok(())
                }
                Err(e) => {
                    warn!("Failed to delete keys {:?}: {}", keys, e);
                    Err(AppError::from(e))
                }
            }
        }
    }).await {
        Ok(_) => Ok(()),
        Err(_) => {
            // Don't fail the operation if cache deletion fails
            warn!("Redis retry failed for key deletion {:?}, continuing anyway", keys);
            Ok(())
        }
    }
}