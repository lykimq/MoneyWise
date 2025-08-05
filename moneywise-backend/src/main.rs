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

    // Initialize in-memory cache service
    // This provides high-performance caching for frequently accessed budget data
    let cache_config = CacheConfig::default();
    let cache_service = CacheService::new(cache_config).await
        .expect("Failed to create cache service");

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
