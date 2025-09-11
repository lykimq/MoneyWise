//! Rate limiting service implementation using Redis

use crate::rate_limiter::config::RateLimitConfig;
use crate::rate_limiter::types::{
    RateLimitError, RateLimitKey, RateLimitResult,
};
use redis::{AsyncCommands, Client};
use std::time::{SystemTime, UNIX_EPOCH};
use tracing::{error, warn};

/// Rate limiting service using Redis for distributed rate limiting
pub struct RateLimitService {
    client: Client,
    config: RateLimitConfig,
}

impl RateLimitService {
    /// Create a new rate limiting service
    pub async fn new(config: RateLimitConfig) -> Result<Self, RateLimitError> {
        let client = Client::open(config.redis_url.clone())
            .map_err(|e| {
                error!("Failed to create Redis client: {}", e);
                e
            })?;

        // Test the connection
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

        let mut conn = redis::aio::ConnectionManager::new(self.client.clone())
            .await
            .map_err(|e| {
                if self.config.graceful_degradation {
                    warn!("Redis connection failed, allowing request: {}", e);
                    return RateLimitError::RedisError(e);
                }
                RateLimitError::RedisError(e)
            })?;

        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let main_key = key.to_redis_key();
        let window_seconds = tx_type.get_window_seconds();

        // Atomically increment and get the new count
        let current_count: u32 = conn
            .incr(&main_key, 1)
            .await
            .unwrap_or(0);

        // Set expiry for automatic cleanup (only on first increment)
        if current_count == 1 {
            let _: () = conn
                .expire(&main_key, (window_seconds + 60) as i64) // Extra 60s buffer
                .await
                .unwrap_or_default();
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
