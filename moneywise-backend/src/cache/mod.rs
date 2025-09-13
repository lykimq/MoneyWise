// Cache management module for MoneyWise backend
// This module provides Redis-based caching functionality with domain-specific organization:
//
// Core Infrastructure:
// - core/ - Generic caching infrastructure
//   - config.rs: Configuration structures and settings
//   - operations.rs: Core Redis operations
//   - retry.rs: Retry logic and error handling
//   - serialization.rs: JSON serialization/deserialization utilities
//   - service.rs: Main caching service with high-level operations
//
// Domain-Specific Caches:
// - domains/ - Domain-specific cache implementations
//   - budget/ - Budget-related caching
//   - transactions/ - Transaction-related caching (future)
//   - goals/ - Goal-related caching (future)
//   - users/ - User-related caching (future)
//
// The module implements distributed caching for frequently accessed data
// to improve performance, scalability, and reliability in production environments.

// Core infrastructure
pub mod connection;
pub mod core;
pub mod domains;

// Re-export the main components for easy access
pub use core::config::CacheConfig;
