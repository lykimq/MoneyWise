// Database connection management module for MoneyWise backend
// This module handles the initialization of PostgreSQL database connections
// with proper error handling and configuration management.

use crate::database::create_pool;
use sqlx::PgPool;
use tracing;

/// Initialize database connection pool
/// Returns a PostgreSQL connection pool configured from environment variables
pub async fn init_database() -> Result<PgPool, Box<dyn std::error::Error>> {
    tracing::info!("Initializing database connection pool");
    let pool = create_pool().await?;
    tracing::info!("Database connection pool initialized successfully");
    Ok(pool)
}