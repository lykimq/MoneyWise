//! Rate Limiting Service for MoneyWise Backend
//!
//! Provides server-side rate limiting using Redis with:
//! - Transaction-type specific limits (Query: 60/min, Budget: 30/min)
//! - IP and device-based tracking
//! - Graceful degradation when Redis is unavailable

pub mod config;
pub mod middleware;
pub mod service;
pub mod types;

pub use config::RateLimitConfig;
pub use service::RateLimitService;
