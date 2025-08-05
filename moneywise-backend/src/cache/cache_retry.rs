// Retry logic and error handling for Redis operations
// Provides exponential backoff with jitter for transient failures

use std::time::Duration;
use tokio_retry::{
    strategy::{jitter, ExponentialBackoff},
    Retry,
};
use tracing::{warn, error};

use crate::error::{AppError, Result};
use crate::cache::cache_config::CacheConfig;

/// Creates a retry strategy with exponential backoff and jitter
/// Uses configurable retry attempts from CacheConfig
pub fn create_retry_strategy(config: &CacheConfig) -> impl Iterator<Item = Duration> {
    ExponentialBackoff::from_millis(100)
        .max_delay(Duration::from_secs(5))
        .map(jitter)
        .take(config.retry_attempts as usize)
}

/// Determines if a Redis error is transient and should be retried
/// Returns true for network-related errors, false for permanent errors
pub fn is_transient_error(error: &AppError) -> bool {
    match error {
        AppError::Internal(msg) => {
            // Retry on network-related errors
            msg.contains("connection") ||
            msg.contains("timeout") ||
            msg.contains("network") ||
            msg.contains("Redis") ||
            msg.contains("IO error")
        }
        _ => false, // Don't retry on other error types
    }
}

/// Executes a Redis operation with retry logic and exponential backoff
/// Wraps any async Redis operation with transparent retry handling
pub async fn with_retry<F, Fut, T>(
    config: &CacheConfig,
    operation: F
) -> Result<T>
where
    F: Fn() -> Fut + Send + Sync,
    Fut: std::future::Future<Output = Result<T>> + Send,
{
    let retry_strategy = create_retry_strategy(config);

    Retry::spawn(retry_strategy, || {
        let operation = &operation;
        async move {
            match operation().await {
                Ok(result) => Ok(result),
                Err(e) => {
                    // Only retry on transient Redis errors
                    if is_transient_error(&e) {
                        warn!("Redis operation failed, will retry: {}", e);
                        Err(e)
                    } else {
                        // Don't retry on permanent errors, return them directly
                        Err(e)
                    }
                }
            }
        }
    })
    .await
    .map_err(|e| {
        error!("Redis operation failed after {} retries: {}", config.retry_attempts, e);
        e
    })
}