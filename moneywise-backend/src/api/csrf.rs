//! CSRF API routes for MoneyWise backend
//!
//! Provides endpoints for CSRF token management and validation.

use axum::{
    extract::State,
    response::Json,
    routing::get,
    Router,
};
use axum_sessions::extractors::WritableSession;
use tracing::{debug, error};

use crate::csrf::CsrfService;
use crate::models::CsrfTokenResponse;
use crate::cache::domains::budget::BudgetCache;
use sqlx::PgPool;

/// Application state containing database pool, cache service, and CSRF service
pub type CsrfAppState = (PgPool, BudgetCache, CsrfService);

/// Creates and configures the CSRF router with all CSRF-related endpoints
pub fn csrf_routes() -> Router<CsrfAppState> {
    Router::new().route("/csrf-token", get(get_csrf_token))
}

/// Retrieves a new CSRF token for the current session
///
/// This endpoint generates a cryptographically secure CSRF token and stores it
/// in the user's session. The token must be included in subsequent state-changing
/// requests (POST, PUT, DELETE, PATCH) via the X-CSRF-Token header.
///
/// # Security Notes
/// - Tokens are generated using cryptographically secure random number generation
/// - Tokens are stored in the server-side session, not in cookies
/// - Tokens have a configurable expiry time (default: 1 hour)
/// - Each session gets a unique token
///
/// # Examples
///
/// Request:
/// ```bash
/// curl -X GET "http://localhost:3000/api/csrf-token" \
///   -H "Cookie: session=your-session-id"
/// ```
///
/// Response:
/// ```json
/// {
///   "token": "abc123...",
///   "expires_in": 3600000
/// }
/// ```
async fn get_csrf_token(
    State((_pool, _cache, csrf_service)): State<CsrfAppState>,
    mut session: WritableSession,
) -> Result<Json<CsrfTokenResponse>, axum::http::StatusCode> {
    debug!("Generating new CSRF token for session");

    match csrf_service.generate_token(&mut session).await {
        Ok(response) => {
            debug!("CSRF token generated successfully");
            Ok(Json(response))
        }
        Err(e) => {
            error!("Failed to generate CSRF token: {}", e);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
