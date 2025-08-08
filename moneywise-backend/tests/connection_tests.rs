// Connection tests for MoneyWise backend
//
// Scope
// - Validate cache (Redis) and database connection behaviors under normal and error conditions.
// - Keep tests fast and deterministic (no dependency on running services).
//
// Style
// - Each test includes short notes on intent (Test), reason (Why), and production value (Impact).

use std::time::Duration;
use moneywise_backend::{CacheConfig, cache::core::service::CacheService};
use moneywise_backend::database;
use std::env;

#[test]
fn test_cache_config_usage() {
    let config = CacheConfig {
        redis_url: "redis://localhost:6379".to_string(),
        overview_ttl: Duration::from_secs(900),
        categories_ttl: Duration::from_secs(300),
        budget_ttl: Duration::from_secs(600),
        max_connections: 15,
        connection_timeout: Duration::from_secs(10),
        retry_attempts: 5,
    };

    // Test: basic field access on explicit config
    // Why: guards against accidental field/visibility changes during refactors
    // Impact: keeps configuration contracts stable for callers
    assert_eq!(config.max_connections, 15);
    assert_eq!(config.connection_timeout.as_secs(), 10);
    assert_eq!(config.retry_attempts, 5);
}

// Test: malformed Redis URL causes constructor to return an error
// Why: misconfigured `REDIS_URL` must fail fast instead of hanging or partially starting
// Impact: improves operability by surfacing configuration issues immediately
#[tokio::test]
async fn test_cache_service_invalid_url_returns_error() {
    let mut config = CacheConfig::default();
    // Use a clearly malformed URL so `Client::open` fails synchronously.
    config.redis_url = "invalid://".to_string();
    // Keep attempts minimal to fail fast.
    config.max_connections = 1;

    let result = CacheService::new(config).await;
    assert!(result.is_err());
}

// Test: `max_connections = 0` panics on use (connection selection)
// Why: documents current contract for an invalid pool size; encourages future validation
// Impact: prevents silent misconfiguration; future change can turn this into constructor error
#[tokio::test]
#[should_panic]
async fn test_cache_service_zero_pool_panics_on_use() {
    let mut config = CacheConfig::default();
    config.max_connections = 0;

    // Any operation that selects a connection will panic (modulo-by-zero on empty pool).
    if let Ok(service) = CacheService::new(config).await {
        // Trigger connection selection
        let _ = service.invalidate_cache("some-key").await;
    } else {
        panic!("Expected construction to succeed with zero pool (current behavior)");
    }
}

// Test: unreachable database URL returns an error from pool creation
// Why: service should not start when DB is unreachable; error must propagate (no panic)
// Impact: enforces fail-fast behavior and proper error handling at call sites
#[tokio::test]
async fn test_database_pool_unreachable_returns_error() {
    // Preserve and restore DATABASE_URL to avoid side effects.
    let previous = env::var_os("DATABASE_URL");
    env::set_var(
        "DATABASE_URL",
        // Non-listening port to force immediate connection failure.
        "postgresql://postgres:password@127.0.0.1:5999/moneywise",
    );

    let result = database::create_pool().await;

    // Restore env var
    if let Some(old) = previous {
        env::set_var("DATABASE_URL", old);
    } else {
        env::remove_var("DATABASE_URL");
    }

    assert!(result.is_err());
}
