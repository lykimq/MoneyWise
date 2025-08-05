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
        Self {
            redis_url: "redis://localhost:6379".to_string(),
            overview_ttl: Duration::from_secs(900), // 15 minutes
            categories_ttl: Duration::from_secs(300), // 5 minutes
            budget_ttl: Duration::from_secs(600),   // 10 minutes
            max_connections: 10,
            connection_timeout: Duration::from_secs(5),
            retry_attempts: 3,
        }
    }
}
