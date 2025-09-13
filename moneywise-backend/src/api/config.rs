//! Configuration API endpoints
//!
//! Provides endpoints for retrieving dynamic configuration settings
//! that can be used by the frontend application.

use axum::{
    response::Json,
    routing::{get, Router},
};
use serde_json::{json, Value};

/// Get application configuration summary
///
/// Returns a summary of all available configuration endpoints
/// and their purposes for API documentation.
///
/// # Returns
/// * `Json<Value>` - Configuration endpoints summary
pub async fn get_config_summary() -> Json<Value> {
    Json(json!({
        "endpoints": {
            "rate_limits": {
                "path": "/api/config/rate-limits",
                "method": "GET",
                "description": "Get current rate limiting configuration",
                "response": {
                    "version": "string",
                    "description": "string",
                    "generated_at": "string",
                    "rate_limits": "object",
                    "client_side": "object",
                    "endpoint_mappings": "object"
                }
            }
        },
        "version": "1.0.0",
        "description": "MoneyWise Configuration API"
    }))
}

/// Get current rate limiting configuration
///
/// Returns the current rate limiting configuration that can be used
/// by the frontend application for client-side rate limiting.
///
/// # Returns
/// * `Json<Value>` - Rate limiting configuration
pub async fn get_rate_limits() -> Json<Value> {
    Json(json!({
        "version": "1.0.0",
        "description": "Rate limiting configuration for MoneyWise budget app",
        "generated_at": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs(),
        "budget_operations": {
            "max_requests": 30,
            "window_seconds": 60,
            "description": "Budget operations (create, update, delete, view budgets)"
        }
    }))
}

/// Create configuration API routes
pub fn create_config_routes(
) -> Router<(sqlx::PgPool, crate::cache::domains::budget::BudgetCache)> {
    Router::new()
        .route("/", get(get_config_summary))
        .route("/rate-limits", get(get_rate_limits))
}
