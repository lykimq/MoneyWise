//! Rate Limiting Service for MoneyWise Backend
//!
//! Provides server-side rate limiting using Redis with:
//! - Budget operations limit (30/min)
//! - IP and device-based tracking
//! - Graceful degradation when Redis is unavailable
//!
//! TODO: Add rate limiting for other endpoint types:
//! - User management endpoints (registration, profile updates)
//! - Reporting endpoints (analytics, exports)
//! - Settings endpoints (configuration, preferences)

pub mod config;
pub mod middleware;
pub mod service;
pub mod types;

pub use config::RateLimitConfig;
pub use service::RateLimitService;
