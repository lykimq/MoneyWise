// MoneyWise Backend Library
// This file makes the crate available for integration tests
// by re-exporting the main modules and types.

// Re-export main modules
pub mod cache;
pub mod database;
pub mod error;
pub mod models;
pub mod rate_limiter;

// Re-export main types for convenience
pub use error::*;
pub use models::*;

// Re-export specific items to avoid naming conflicts
pub use cache::CacheConfig;
pub use database::create_pool;
