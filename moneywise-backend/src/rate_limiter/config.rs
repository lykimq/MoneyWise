//! Rate limiting configuration

use serde::{Deserialize, Serialize};
use tracing::warn;

/// Rate limiting configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateLimitConfig {
    /// Redis connection URL
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
            redis_url: parse_redis_url_env_with_default(
                "REDIS_URL",
                "redis://localhost:6379",
            ),
            graceful_degradation: true,
        }
    }
}

/// Parse a Redis URL environment variable with validation.
///
/// Validates that the URL starts with `redis://` or `rediss://` and logs warnings
/// for invalid formats.
fn parse_redis_url_env_with_default(
    var_name: &str,
    default_value: &str,
) -> String {
    match std::env::var(var_name) {
        Ok(value) => {
            // Basic validation for Redis URL format
            if value.starts_with("redis://") || value.starts_with("rediss://") {
                value
            } else {
                warn!(
                    "Invalid Redis URL format '{}' for environment variable '{}'. Using default: {}",
                    value, var_name, default_value
                );
                default_value.to_string()
            }
        }
        Err(_) => default_value.to_string(),
    }
}
