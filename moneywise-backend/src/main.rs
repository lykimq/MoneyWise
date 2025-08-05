// Import necessary modules from axum for web framework functionality
use axum::{
    Router,
};
// Import SocketAddr for network address handling
use std::net::SocketAddr;
// Import CORS layer for handling Cross-Origin Resource Sharing
use tower_http::cors::{Any, CorsLayer};
// Import tracing subscriber for logging and observability
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// Import local modules
mod budget;
mod cache;
mod database;
mod error;
mod models;

// Import specific functions from local modules
use budget::budget_routes;
use cache::{CacheConfig, CacheService};
use database::create_pool;

/// Main entry point for the MoneyWise backend server
/// This function initializes the application, sets up logging, database connection,
/// CORS configuration, and starts the HTTP server
#[tokio::main]
async fn main() {
    // Initialize tracing for structured logging
    // This sets up logging with environment-based configuration
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            // Use RUST_LOG environment variable or default to "info" level
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables from .env file
    // This allows configuration through environment variables
    dotenv::dotenv().ok();

    // Create database connection pool
    // This establishes a connection pool for efficient database operations
    let pool = create_pool().await.expect("Failed to create database pool");

    // Initialize Redis cache service with configuration from environment variables
    // This provides distributed, persistent caching for production environments
    let cache_config = CacheConfig {
        redis_url: std::env::var("REDIS_URL")
            .unwrap_or_else(|_| "redis://localhost:6379".to_string()),
        overview_ttl: std::env::var("CACHE_OVERVIEW_TTL_SECS")
            .unwrap_or_else(|_| "900".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(900)), // 15 minutes default
        categories_ttl: std::env::var("CACHE_CATEGORIES_TTL_SECS")
            .unwrap_or_else(|_| "300".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(300)), // 5 minutes default
        budget_ttl: std::env::var("CACHE_BUDGET_TTL_SECS")
            .unwrap_or_else(|_| "600".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(600)), // 10 minutes default
        max_connections: std::env::var("REDIS_MAX_CONNECTIONS")
            .unwrap_or_else(|_| "10".to_string())
            .parse::<usize>()
            .unwrap_or(10),
        connection_timeout: std::env::var("REDIS_CONNECTION_TIMEOUT_SECS")
            .unwrap_or_else(|_| "5".to_string())
            .parse::<u64>()
            .map(|secs| std::time::Duration::from_secs(secs))
            .unwrap_or_else(|_| std::time::Duration::from_secs(5)),
        retry_attempts: std::env::var("REDIS_RETRY_ATTEMPTS")
            .unwrap_or_else(|_| "3".to_string())
            .parse::<u32>()
            .unwrap_or(3),
    };

    let cache_service = CacheService::new(cache_config).await
        .expect("Failed to create Redis cache service");

    // Log cache configuration for debugging and monitoring
    tracing::info!("Redis cache service initialized with connection pooling");

    // Configure CORS (Cross-Origin Resource Sharing) settings
    // This allows the API to be accessed from different origins (domains)
    let cors = CorsLayer::new()
        .allow_origin(Any)      // Allow requests from any origin
        .allow_methods(Any)     // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        .allow_headers(Any);    // Allow all headers

    // Build the application router with routes and middleware
    let app = Router::new()
        .nest("/api/budgets", budget_routes())  // Mount budget routes under /api/budgets path
        .layer(cors)                            // Apply CORS middleware
        .with_state((pool, cache_service));     // Inject database pool and cache service as application state

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
    let addr = format!("{}:{}", host, port).parse::<SocketAddr>()
        .expect("Invalid HOST or PORT configuration");

    // Log the server address for debugging and monitoring
    tracing::info!("listening on {}", addr);

    // Start the HTTP server
    // This binds to the specified address and starts serving requests
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
