// Server configuration module for MoneyWise backend
// This module handles server host and port configuration
// with proper error handling and environment variable management.

use std::net::SocketAddr;
use tracing;

/// Server configuration with host and port settings
#[derive(Debug, Clone)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub addr: SocketAddr,
}

/// Initialize server configuration from environment variables
/// Returns a ServerConfig with host, port, and parsed SocketAddr
pub fn init_server_config() -> Result<ServerConfig, Box<dyn std::error::Error>> {
    tracing::info!("Initializing server configuration");

    // Configure server host and port from environment variables
    // Default to 127.0.0.1 if HOST is not set
    let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());

    // Default to 3000 if PORT is not set
    // Parse the port from the environment variable and convert it to a u16
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid u16");

    // Parse the address string into a SocketAddr for binding
    let addr = format!("{}:{}", host, port)
        .parse::<SocketAddr>()
        .expect("Invalid HOST or PORT configuration");

    let config = ServerConfig { host, port, addr };

    tracing::info!(
        "Server configuration initialized: {}:{}",
        config.host,
        config.port
    );
    Ok(config)
}
