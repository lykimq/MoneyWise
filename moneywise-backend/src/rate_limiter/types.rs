//! Rate limiting types and enums

use serde::{Deserialize, Serialize};
use std::fmt;

/// Defines the rate limit for BudgetModification transactions.
const BUDGET_MODIFICATION_LIMIT: u32 = 30; // 30 requests per minute

/// Defines the time window in seconds for rate limits.
const RATE_LIMIT_WINDOW_SECONDS: u64 = 60; // 1-minute window

/// Transaction type for budget operations with specific rate limits
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum TransactionType {
    /// Budget operations (create, update, delete, view budgets)
    BudgetModification,
    // TODO: Add other transaction types as needed:
    // - UserManagement (user registration, profile updates)
    // - Reporting (analytics, reports generation)
    // - Settings (app configuration, preferences)
}

impl TransactionType {
    /// Get the rate limit for budget operations
    pub fn get_limit(&self) -> u32 {
        match self {
            Self::BudgetModification => BUDGET_MODIFICATION_LIMIT,
        }
    }

    /// Get the time window in seconds
    pub fn get_window_seconds(&self) -> u64 {
        RATE_LIMIT_WINDOW_SECONDS
    }
}

/// Display implementation for stable Redis keys.
///
/// Uses explicit string representation instead of `as u8` to avoid fragility
/// from enum reordering. Redis keys become readable: "rate_limit:ip:device:budget_modification"
/// instead of "rate_limit:ip:device:0".
impl fmt::Display for TransactionType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::BudgetModification => write!(f, "budget_modification"),
        }
    }
}

/// Rate limit key components for Redis storage
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct RateLimitKey {
    pub ip_address: String,
    pub device_id: Option<String>,
    pub transaction_type: TransactionType,
}

impl RateLimitKey {
    /// Create a new rate limit key
    pub fn new(
        ip_address: String,
        device_id: Option<String>,
        transaction_type: TransactionType,
    ) -> Self {
        Self {
            ip_address,
            device_id,
            transaction_type,
        }
    }

    /// Convert to Redis key for main rate limit.
    ///
    /// Uses Display trait for stable string representation.
    /// Example: "rate_limit:192.168.1.1:device123:budget_modification"
    pub fn to_redis_key(&self) -> String {
        let device_part = self.device_id.as_deref().unwrap_or("unknown");
        format!(
            "rate_limit:{}:{}:{}",
            self.ip_address, device_part, self.transaction_type
        )
    }
}

/// Rate limit check result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateLimitResult {
    pub allowed: bool,
    pub remaining_requests: u32,
    pub reset_time: u64,          // Unix timestamp
    pub retry_after: Option<u64>, // Seconds to wait
    pub limit_type: TransactionType,
}

impl RateLimitResult {
    /// Create a result for an allowed request
    pub fn allowed(
        remaining: u32,
        reset_time: u64,
        limit_type: TransactionType,
    ) -> Self {
        Self {
            allowed: true,
            remaining_requests: remaining,
            reset_time,
            retry_after: None,
            limit_type,
        }
    }

    /// Create a result for a rate-limited request
    pub fn rate_limited(
        reset_time: u64,
        retry_after: u64,
        limit_type: TransactionType,
    ) -> Self {
        Self {
            allowed: false,
            remaining_requests: 0,
            reset_time,
            retry_after: Some(retry_after),
            limit_type,
        }
    }
}

/// Rate limit error types
#[derive(Debug, thiserror::Error)]
pub enum RateLimitError {
    #[error("Redis connection failed: {0}")]
    RedisError(#[from] redis::RedisError),
}
