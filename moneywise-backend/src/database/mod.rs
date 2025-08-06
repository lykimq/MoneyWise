// Database module for MoneyWise backend
// This module provides database functionality including connection pooling and operations

use sqlx::postgres::{PgPool, PgPoolOptions};
use std::time::Duration;

/// Create a connection pool to the PostgreSQL database
/// This function initializes a connection pool with configurable settings
/// - `database_url`: The URL of the PostgreSQL database
/// - `max_connections`: The maximum number of connections in the pool
/// - `acquire_timeout`: The maximum time to wait for a connection to be acquired
/// Returns a `Result` containing the connection pool or an error if the connection fails
pub async fn create_pool() -> Result<PgPool, sqlx::Error> {
    // Get the database URL from the environment variable
    // This is required for the connection to the database
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    // Get the maximum number of connections from the environment variable
    // Default to 5 if not set
    // Parse the value as a u32 and expect it to be a valid u32
    let max_connections = std::env::var("DATABASE_MAX_CONNECTIONS")
        .unwrap_or_else(|_| "5".to_string())
        .parse::<u32>()
        .expect("DATABASE_MAX_CONNECTIONS must be a valid u32");

    // Create a connection pool with the specified settings
    // - `max_connections`: The maximum number of connections in the pool
    // - `acquire_timeout`: The maximum time to wait for a connection to be acquired
    // - `connect`: The URL of the PostgreSQL database
    // Returns a `Result` containing the connection pool or an error if the connection fails
    PgPoolOptions::new()
        .max_connections(max_connections)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&database_url)
        .await
}

// Connection management submodule
pub mod connection;