//! Rate limiting configuration

use crate::connections::parse_redis_url_from_env;
use serde::{Deserialize, Serialize};

/// Rate limiting configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateLimitConfig {
    pub redis_url: String,
    /// Graceful degradation when Redis is unavailable
    pub graceful_degradation: bool,
}

impl Default for RateLimitConfig {
    /// Build a configuration from environment variables with sensible defaults.
    ///
    /// # Panics
    ///
    /// This function will panic if environment variables contain invalid values
    /// that cannot be parsed as the expected types. This is intentional for
    /// configuration errors that should be caught at startup.
    fn default() -> Self {
        Self {
            redis_url: parse_redis_url_from_env("REDIS_URL"),
            graceful_degradation: true,
        }
    }
}
