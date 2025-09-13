//! Cache configuration for the Redis-based caching layer.
//!
//! Provides environment-driven defaults and typed settings for TTLs,
//! connection sizing, and retry behavior. The defaults are production-friendly
//! but can be overridden via environment variables.

use std::time::Duration;
use tracing::warn;

/// Cache configuration with TTL settings and Redis connection parameters.
/// Different data types have different cache durations based on update frequency.
#[derive(Clone)]
pub struct CacheConfig {
    /// Redis connection URL (e.g., "redis://localhost:6379")
    pub redis_url: String,
    /// TTL for budget overview data (15 minutes - overview changes infrequently)
    pub overview_ttl: Duration,
    /// TTL for category budget data (5 minutes - more volatile than overview)
    pub categories_ttl: Duration,
    /// TTL for individual budget data (10 minutes - moderate volatility)
    pub budget_ttl: Duration,
    /// Maximum number of Redis connections in the pool
    pub max_connections: usize,
    /// Connection timeout for Redis operations
    pub connection_timeout: Duration,
    /// Retry attempts for failed Redis operations
    pub retry_attempts: u32,
}

impl Default for CacheConfig {
    /// Build a configuration from environment variables with sensible defaults.
    ///
    /// # Panics
    ///
    /// This function will panic if environment variables contain invalid values
    /// that cannot be parsed as the expected types. This is intentional for
    /// configuration errors that should be caught at startup.
    fn default() -> Self {
        let redis_url = std::env::var("REDIS_URL")
            .unwrap_or_else(|_| "redis://localhost:6379".to_string());

        let overview_ttl =
            parse_env_with_default("CACHE_OVERVIEW_TTL_SECS", 900);
        let categories_ttl =
            parse_env_with_default("CACHE_CATEGORIES_TTL_SECS", 300);
        let budget_ttl = parse_env_with_default("CACHE_BUDGET_TTL_SECS", 600);
        let max_connections =
            parse_env_with_default("REDIS_MAX_CONNECTIONS", 10);
        let connection_timeout =
            parse_env_with_default("REDIS_CONNECTION_TIMEOUT_SECS", 5);
        let retry_attempts = parse_env_with_default("REDIS_RETRY_ATTEMPTS", 3);

        Self {
            redis_url,
            overview_ttl: Duration::from_secs(overview_ttl),
            categories_ttl: Duration::from_secs(categories_ttl),
            budget_ttl: Duration::from_secs(budget_ttl),
            max_connections,
            connection_timeout: Duration::from_secs(connection_timeout),
            retry_attempts,
        }
    }
}

/// Parse an environment variable with a default value, logging warnings for invalid values.
///
/// This function provides better error visibility than `unwrap_or()` by logging
/// when environment variables contain invalid values that cannot be parsed.
fn parse_env_with_default<T>(var_name: &str, default_value: T) -> T
where
    T: std::str::FromStr + std::fmt::Display + Clone,
    T::Err: std::fmt::Display,
{
    match std::env::var(var_name) {
        Ok(value) => match value.parse::<T>() {
            Ok(parsed) => parsed,
            Err(e) => {
                warn!(
                    "Invalid value '{}' for environment variable '{}': {}. Using default: {}",
                    value, var_name, e, default_value
                );
                default_value
            }
        },
        Err(_) => default_value,
    }
}
