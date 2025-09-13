//! Rate limiting service implementation using Redis

use crate::rate_limiter::config::RateLimitConfig;
use crate::rate_limiter::types::{
    RateLimitError, RateLimitKey, RateLimitResult,
};
use redis::{AsyncCommands, Client};
use std::time::{SystemTime, UNIX_EPOCH};
use tracing::{error, warn};

/// Additional buffer time for Redis key expiry to ensure it outlives the rate limit window.
/// This helps prevent race conditions where a key might expire prematurely.
const REDIS_EXPIRY_BUFFER_SECONDS: i64 = 60;

/// Rate limiting service using Redis for distributed rate limiting
pub struct RateLimitService {
    client: Client,
    config: RateLimitConfig,
}

impl RateLimitService {
    /// Helper function to establish and test Redis connection
    async fn test_redis_connection(
        client: &Client,
    ) -> Result<redis::aio::ConnectionManager, RateLimitError> {
        let mut conn = redis::aio::ConnectionManager::new(client.clone())
            .await
            .map_err(|e| {
                error!("Failed to connect to Redis: {}", e);
                e
            })?;

        // Ping Redis to verify connection
        let _: String = redis::cmd("PING")
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Redis ping failed: {}", e);
                e
            })?;
        Ok(conn)
    }

    /// Create a new rate limiting service
    pub async fn new(config: RateLimitConfig) -> Result<Self, RateLimitError> {
        let client = Client::open(config.redis_url.clone()).map_err(|e| {
            error!("Failed to create Redis client: {}", e);
            e
        })?;

        // Test the connection
        let _conn = Self::test_redis_connection(&client).await?;

        tracing::info!("Rate limiting service initialized with Redis");

        Ok(Self { client, config })
    }

    /// Check if a request is allowed and record it if permitted
    pub async fn check_and_record(
        &self,
        key: RateLimitKey,
    ) -> Result<RateLimitResult, RateLimitError> {
        let tx_type = key.transaction_type;
        let main_limit = tx_type.get_limit();

        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| {
                error!("Failed to get current time: {}", e);
                RateLimitError::RedisError(redis::RedisError::from((
                    redis::ErrorKind::IoError,
                    "SystemTime error",
                )))
            })?
            .as_secs();
        let window_seconds = tx_type.get_window_seconds();

        let mut conn = match Self::test_redis_connection(&self.client).await {
            Ok(c) => c,
            Err(e) => {
                if self.config.graceful_degradation {
                    warn!("Redis connection failed, allowing request: {}", e);
                    return Ok(RateLimitResult::allowed(
                        main_limit - 1, // Assume one request used
                        now + window_seconds,
                        tx_type,
                    ));
                }
                return Err(e);
            }
        };

        let main_key = key.to_redis_key();
        let window_seconds = tx_type.get_window_seconds();

        // Atomically increment and get the new count
        let current_count: u32 = match conn.incr(&main_key, 1).await {
            Ok(count) => count,
            Err(e) => {
                error!(
                    "Failed to increment rate limit counter for key {}: {}",
                    main_key, e
                );
                if self.config.graceful_degradation {
                    warn!("Allowing request due to graceful degradation mode");
                    // Return allowed result with conservative remaining count
                    return Ok(RateLimitResult::allowed(
                        main_limit - 1, // Assume one request used
                        now + window_seconds,
                        tx_type,
                    ));
                }
                return Err(RateLimitError::RedisError(e));
            }
        };

        // Set expiry for automatic cleanup (only on first increment)
        if current_count == 1 {
            if let Err(e) = conn
                .expire::<&str, i64>(
                    &main_key,
                    window_seconds as i64 + REDIS_EXPIRY_BUFFER_SECONDS,
                )
                .await
            {
                // Log the error but don't fail the request - Redis will eventually clean up
                warn!(
                    "Failed to set expiry for rate limit key {}: {}",
                    main_key, e
                );
            }
        }

        if current_count >= main_limit {
            // Request exceeded limit, return rate limited result
            Ok(RateLimitResult::rate_limited(
                now + window_seconds,
                window_seconds,
                tx_type,
            ))
        } else {
            // Request allowed, return success result
            Ok(RateLimitResult::allowed(
                main_limit - current_count,
                now + window_seconds,
                tx_type,
            ))
        }
    }
}
