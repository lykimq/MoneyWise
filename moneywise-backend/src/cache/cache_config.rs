// Cache configuration module for MoneyWise backend
// This module defines the configuration structure for Redis-based caching
// with TTL settings and connection parameters.

use std::time::Duration;

/// Cache configuration with TTL settings and Redis connection parameters
/// Different data types have different cache durations based on update frequency
///
///
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
    fn default() -> Self {
        let redis_url =
            std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".to_string());

        let overview_ttl = std::env::var("CACHE_OVERVIEW_TTL_SECS")
            .unwrap_or_else(|_| "900".to_string())
            .parse::<u64>()
            .unwrap_or(900);
        let categories_ttl = std::env::var("CACHE_CATEGORIES_TTL_SECS")
            .unwrap_or_else(|_| "300".to_string())
            .parse::<u64>()
            .unwrap_or(300);
        let budget_ttl = std::env::var("CACHE_BUDGET_TTL_SECS")
            .unwrap_or_else(|_| "600".to_string())
            .parse::<u64>()
            .unwrap_or(600);
        let max_connections = std::env::var("REDIS_MAX_CONNECTIONS")
            .unwrap_or_else(|_| "10".to_string())
            .parse::<usize>()
            .unwrap_or(10);
        let connection_timeout = std::env::var("REDIS_CONNECTION_TIMEOUT")
            .unwrap_or_else(|_| "5".to_string())
            .parse::<u64>()
            .unwrap_or(5);
        let retry_attempts = std::env::var("REDIS_RETRY_ATTEMPTS")
            .unwrap_or_else(|_| "3".to_string())
            .parse::<u32>()
            .unwrap_or(3);

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
