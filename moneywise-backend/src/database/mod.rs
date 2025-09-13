// Database module for MoneyWise backend
// This module provides database functionality including connection pooling and operations

use sqlx::postgres::{PgPool, PgPoolOptions};
use std::time::Duration;
use tracing;

/// Create a connection pool to the PostgreSQL database
/// This function initializes a connection pool with configurable settings
/// - `database_url`: The URL of the PostgreSQL database
/// - `max_connections`: The maximum number of connections in the pool
/// - `acquire_timeout`: The maximum time to wait for a connection to be acquired
pub async fn create_pool() -> Result<PgPool, sqlx::Error> {
    // Get the database URL from the environment variable
    // This is required for the connection to the database
    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Get the maximum number of connections from the environment variable
    let max_connections = std::env::var("DATABASE_MAX_CONNECTIONS")
        .unwrap_or_else(|_| "5".to_string())
        .parse::<u32>()
        .map_err(|e| {
            tracing::error!("Invalid DATABASE_MAX_CONNECTIONS value: {}", e);
            sqlx::Error::Configuration(
                format!("DATABASE_MAX_CONNECTIONS must be a valid u32: {}", e)
                    .into(),
            )
        })?;

    // Create a connection pool with the specified settings
    PgPoolOptions::new()
        .max_connections(max_connections)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&database_url)
        .await
}

// Connection management submodule
pub mod connection;
