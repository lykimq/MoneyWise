// Cache connection management module for MoneyWise backend
// This module handles the initialization of Redis cache connections
// with proper error handling and configuration management.

use crate::cache::{CacheConfig, domains::budget::BudgetCache};
use tracing;

/// Initialize Redis cache service
/// Returns a configured BudgetCache service with Redis connection
pub async fn init_cache() -> Result<BudgetCache, Box<dyn std::error::Error>> {
    tracing::info!("Initializing Redis cache service");

    let cache_config = CacheConfig {
        redis_url: std::env::var("REDIS_URL")
            .unwrap_or_else(|_| "redis://localhost:6379".to_string()),
        overview_ttl: std::env::var("CACHE_OVERVIEW_TTL_SECS")
            .unwrap_or_else(|_| "900".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(900)), // 15 minutes default
        categories_ttl: std::env::var("CACHE_CATEGORIES_TTL_SECS")
            .unwrap_or_else(|_| "300".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(300)), // 5 minutes default
        budget_ttl: std::env::var("CACHE_BUDGET_TTL_SECS")
            .unwrap_or_else(|_| "600".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(600)), // 10 minutes default
        max_connections: std::env::var("REDIS_MAX_CONNECTIONS")
            .unwrap_or_else(|_| "10".to_string())
            .parse::<usize>()
            .unwrap_or(10),
        connection_timeout: std::env::var("REDIS_CONNECTION_TIMEOUT_SECS")
            .unwrap_or_else(|_| "5".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(5)),
        retry_attempts: std::env::var("REDIS_RETRY_ATTEMPTS")
            .unwrap_or_else(|_| "3".to_string())
            .parse::<u32>()
            .unwrap_or(3),
    };

    let cache_service = BudgetCache::new(cache_config).await?;
    tracing::info!("Redis cache service initialized with connection pooling");
    Ok(cache_service)
}