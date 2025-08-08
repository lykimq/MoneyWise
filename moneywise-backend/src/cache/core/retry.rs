//! Retry helpers for Redis operations.
//!
//! Implements exponential backoff with full jitter for transient failures.
//! Classification is based on `redis::ErrorKind` to avoid brittle
//! string matching.
//!

use std::time::Duration;
use tokio_retry::{
    strategy::{jitter, ExponentialBackoff},
    RetryIf,
};
use tracing::{warn, error};

use crate::error::{AppError, Result};
use redis::ErrorKind as RedisErrorKind;
use crate::cache::core::config::CacheConfig;

/// Determine if a Redis error is transient and should be retried.
/// Returns true for network/cluster and redirection issues.
pub fn is_transient_error(error: &AppError) -> bool {
    match error {
        // Redis-specific classification using error kinds
        AppError::Cache(redis_err) => match redis_err.kind() {
            // Network/cluster issues and redirections: retry
            RedisErrorKind::IoError | RedisErrorKind::TryAgain | RedisErrorKind::Moved | RedisErrorKind::Ask | RedisErrorKind::ClusterDown => true,
            // Auth, type, or client-side parse errors are permanent
            RedisErrorKind::AuthenticationFailed | RedisErrorKind::TypeError | RedisErrorKind::ClientError => false,
            // Default: be conservative and do not retry
            _ => false,
        },
        // Internal errors not from Redis are not retried
        _ => false,
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
