//! Connection management module for MoneyWise backend.
//!
//! This module orchestrates the initialization of all connections
//! by delegating to specialized modules for database, cache, and server configuration.

use crate::cache::connection::init_cache;
use crate::database::connection::init_database;
use crate::rate_limiter::{RateLimitConfig, RateLimitService};
use crate::server::config::init_server_config;
use sqlx::PgPool;
use tracing;

/// Default Redis URL when no environment variable is set
pub const DEFAULT_REDIS_URL: &str = "redis://localhost:6379";

/// Parse Redis URL from environment variable with validation and fallback.
///
/// Validates that the URL starts with `redis://` or `rediss://` and logs warnings
/// for invalid formats. Falls back to the default URL if the environment variable
/// is missing or invalid.
pub fn parse_redis_url_from_env(env_var: &str) -> String {
    std::env::var(env_var)
        .map(|url| {
            // Basic validation for Redis URL format
            if url.starts_with("redis://") || url.starts_with("rediss://") {
                url
            } else {
                tracing::warn!(
                    "Invalid Redis URL format '{}' for environment variable '{}'. Using default: {}",
                    url, env_var, DEFAULT_REDIS_URL
                );
                DEFAULT_REDIS_URL.to_string()
            }
        })
        .unwrap_or_else(|_| DEFAULT_REDIS_URL.to_string())
}

/// Initialize all connections (database, cache, rate limiter, and server configuration)
/// Returns a tuple containing the database pool, cache service, rate limiter, and server config
pub async fn init_connections() -> Result<
    (
        PgPool,
        crate::cache::domains::budget::BudgetCache,
        RateLimitService,
        crate::server::config::ServerConfig,
    ),
    Box<dyn std::error::Error>,
> {
    tracing::info!("Initializing all connections and configurations");

    let pool = init_database().await?;
    let cache_service = init_cache().await?;
    let server_config = init_server_config()?;

    // Initialize rate limiter
    let rate_limiter_config = RateLimitConfig::default();
    let rate_limiter = RateLimitService::new(rate_limiter_config)
        .await
        .map_err(|e| format!("Failed to initialize rate limiter: {}", e))?;

    tracing::info!(
        "All connections and configurations initialized successfully"
    );
    Ok((pool, cache_service, rate_limiter, server_config))
}
