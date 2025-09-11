//! Rate limiting configuration

use serde::{Deserialize, Serialize};

/// Rate limiting configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateLimitConfig {
    /// Redis connection URL
    pub redis_url: String,
    /// Graceful degradation when Redis is unavailable
    pub graceful_degradation: bool,
}

impl Default for RateLimitConfig {
    fn default() -> Self {
        Self {
            redis_url: std::env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://localhost:6379".to_string()),
            graceful_degradation: true,
        }
    }
}
