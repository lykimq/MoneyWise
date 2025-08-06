// Connection management module for MoneyWise backend
// This module orchestrates the initialization of all connections
// by delegating to specialized modules for database, cache, and server configuration

use crate::cache::connection::init_cache;
use crate::database::connection::init_database;
use crate::server::config::init_server_config;
use sqlx::PgPool;
use tracing;

/// Initialize all connections (database, cache, and server configuration)
/// Returns a tuple containing the database pool, cache service, and server config
pub async fn init_connections() -> Result<(PgPool, crate::cache::domains::budget::BudgetCache, crate::server::config::ServerConfig), Box<dyn std::error::Error>> {
    tracing::info!("Initializing all connections and configurations");

    let pool = init_database().await?;
    let cache_service = init_cache().await?;
    let server_config = init_server_config()?;

    tracing::info!("All connections and configurations initialized successfully");
    Ok((pool, cache_service, server_config))
}