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
pub fn init_server_config() -> Result<ServerConfig, Box<dyn std::error::Error>>
{
    tracing::info!("Initializing server configuration");

    // Configure server host and port from environment variables
    // Default to 0.0.0.0 if HOST is not set, make host accessible from outside
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());

    // Default to 3000 if PORT is not set
    // Parse the port from the environment variable and convert it to a u16
    let port = parse_port_env_with_default("PORT", 3000)
        .map_err(|e| format!("Port configuration error: {}", e))?;

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

/// Parse a port environment variable with validation.
///
/// Validates that the port is within valid range (1-65535) and returns proper errors
/// for invalid values.
fn parse_port_env_with_default(
    var_name: &str,
    default_value: u16,
) -> Result<u16, String> {
    match std::env::var(var_name) {
        Ok(value) => match value.parse::<u16>() {
            Ok(parsed) => {
                if parsed == 0 {
                    let error_msg = format!(
                        "Invalid port value '{}' for environment variable '{}': port cannot be 0",
                        value, var_name
                    );
                    tracing::error!("{}", error_msg);
                    Err(error_msg)
                } else {
                    Ok(parsed)
                }
            }
            Err(e) => {
                let error_msg = format!(
                    "Invalid port value '{}' for environment variable '{}': {}",
                    value, var_name, e
                );
                tracing::error!("{}", error_msg);
                Err(error_msg)
            }
        },
        Err(_) => Ok(default_value),
    }
}
