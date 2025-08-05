// Cache management module for MoneyWise backend
// This module provides Redis-based caching functionality split into logical components:
// - cache_config.rs: Configuration structures and settings
// - cache_keys.rs: Cache key generation functions
// - cache_serialization.rs: JSON serialization/deserialization utilities
// - cache_retry.rs: Retry logic and error handling
// - cache_operations.rs: Core Redis operations
// - cache_service.rs: Main caching service with high-level operations
//
// The module implements distributed caching for frequently accessed budget data
// to improve performance, scalability, and reliability in production environments.

// Re-export the main components for easy access
pub mod cache_config;
pub mod cache_keys;
pub mod cache_operations;
pub mod cache_retry;
pub mod cache_serialization;
pub mod cache_service;

// Re-export the main types for convenience
pub use cache_config::CacheConfig;
pub use cache_service::CacheService;
