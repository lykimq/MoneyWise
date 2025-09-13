// Cache connection management module for MoneyWise backend
// This module handles the initialization of Redis cache connections
// with proper error handling and configuration management.

use crate::cache::{domains::budget::BudgetCache, CacheConfig};
use tracing;

/// Initialize Redis cache service
/// Returns a configured BudgetCache service with Redis connection
pub async fn init_cache() -> Result<BudgetCache, Box<dyn std::error::Error>> {
    tracing::info!("Initializing Redis cache service");

    // Reuse default configuration which reads environment variables.
    let cache_config = CacheConfig::default();

    let cache_service = BudgetCache::new(cache_config).await?;
    tracing::info!("Redis cache service initialized with connection pooling");
    Ok(cache_service)
}
