// Import necessary modules from axum for web framework functionality
use axum::{middleware, Router};
// Import CORS layer for handling Cross-Origin Resource Sharing
use tower_http::cors::{Any, CorsLayer};
// Import tracing subscriber for logging and observability
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
// Import session management
use axum_sessions::{async_session::MemoryStore, SessionLayer};

// Import local modules
mod api;
mod cache;
mod connections;
mod csrf;
mod database;
mod error;
mod models;
mod rate_limiter;
mod server;

// Import specific functions from local modules
use api::create_api_router;
use connections::init_connections;
use csrf::CsrfService;
use rate_limiter::middleware::rate_limit_middleware;
use std::sync::Arc;

/// Main entry point for the MoneyWise backend server
/// This function initializes the application, sets up logging, database connection,
/// CORS configuration, and starts the HTTP server
///
/// CI/CD Test: This comment was added to test the fixed backend build workflow
/// with PostgreSQL connection and Supabase API.
#[tokio::main]
async fn main() {
    // Initialize tracing for structured logging
    // This sets up logging with environment-based configuration
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            // Use RUST_LOG environment variable or default to "info" level
            // Exclude sqlx query logs to reduce noise in production
            std::env::var("RUST_LOG")
                .unwrap_or_else(|_| "info,sqlx::query=warn".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables from .env file
    // This allows configuration through environment variables
    dotenv::dotenv().ok();

    // Initialize database, Redis connections, rate limiter, and server configuration
    // This establishes connection pools and server settings from environment variables
    let (pool, cache_service, rate_limiter, server_config) = init_connections()
        .await
        .expect("Failed to initialize connections and configuration");

    // Initialize CSRF service
    let csrf_service = CsrfService::new();

    // Initialize session store and layer
    let store = MemoryStore::new();
    let session_layer = SessionLayer::new(store, b"your-secret-key-must-be-at-least-32-bytes-long");

    // Configure CORS (Cross-Origin Resource Sharing) settings
    // This allows the API to be accessed from different origins (domains)
    let cors = CorsLayer::new()
        .allow_origin(Any) // Allow requests from any origin
        .allow_methods(Any) // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        .allow_headers(Any); // Allow all headers

    // Build the application router with routes and middleware
    let app = Router::new()
        .nest("/api", create_api_router()) // Mount all API routes under /api path
        .layer(session_layer) // Apply session management
        .layer(middleware::from_fn_with_state(
            Arc::new(rate_limiter),
            rate_limit_middleware,
        )) // Apply rate limiting middleware
        .layer(cors) // Apply CORS middleware
        .with_state((pool, cache_service, csrf_service)); // Inject database pool, cache service, and CSRF service as application state

    // Log the server address for debugging and monitoring
    tracing::info!("listening on {}", server_config.addr);

    // Start the HTTP server
    // This binds to the specified address and starts serving requests
    axum::Server::bind(&server_config.addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
