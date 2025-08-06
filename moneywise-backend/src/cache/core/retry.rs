// Retry logic and error handling for Redis operations
// Provides exponential backoff with jitter for transient failures

use std::time::Duration;
use tokio_retry::{
    strategy::{jitter, ExponentialBackoff},
    RetryIf,
};
use tracing::{warn, error};

use crate::error::{AppError, Result};
use crate::cache::core::config::CacheConfig;

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

/// Wrap an async Redis operation in a retry loop that:
/// 1. uses exponential backoff + full jitter
/// 2. only retries if `is_transient_error` returns true
/// 3. stops immediately on permanent errors
/// 4. logs each failure and the final give-up
pub async fn with_retry<F, Fut, T>(
    config: &CacheConfig,
    mut operation: F
) -> Result<T>
where
    // FnMut is enough, we only need to call it, not clone it.
    F: FnMut() -> Fut + Send,
    Fut: std::future::Future<Output = Result<T>> + Send,
{
    // Build an exponential backoff strategy with full jitter
    let retry_strategy = ExponentialBackoff::from_millis(100)
        .max_delay(Duration::from_secs(5))
        .take(config.retry_attempts as usize)
        .map(jitter);

    // RetryIf lets us decide per-error whether we should retry
    let result =
    RetryIf::spawn(
        retry_strategy,
        // this closure is re-invoked on each attempt
        ||{
            let fut = operation();
            async move {
                match fut.await{
                    Ok(val) => Ok (val),
                    Err(e) if is_transient_error(&e) => {
                        // instruct RetryIf to retry
                        warn!("Transient Redis operation failed, will retry: {}", e);
                        Err(e)
                    }
                    Err(e) => {
                        // instruct RetryIf to stop immediately
                        error!("Permanent Redis operation failed after {} retries: {}", config.retry_attempts, e);
                        Err(e)
                    }
                }
            }
        },

        // this predicate decides whether to retry when our inner Future returns Err(e)
        |err: &AppError| is_transient_error(err),
    ).await;

    match result {
        Ok(val) => Ok(val),
        Err(e) => {
            // either exhausted all attempts or permenant error
            error!("Redis operation failed after {} retries: {}", config.retry_attempts, e);
            Err(e)
        }
    }
}
