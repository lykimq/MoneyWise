//! Axum middleware for rate limiting

use crate::rate_limiter::service::RateLimitService;
use crate::rate_limiter::types::{RateLimitKey, TransactionType};
use axum::{
    extract::State,
    http::StatusCode,
    middleware::Next,
    response::IntoResponse,
    Json,
};
use serde_json::json;
use std::sync::Arc;

/// Extract rate limit information from request
pub fn extract_rate_limit_info(req: &axum::http::Request<axum::body::Body>) -> RateLimitKey {
    // Get IP address from headers (in production, this should come from a reverse proxy)
    let ip = req
        .headers()
        .get("x-forwarded-for")
        .or_else(|| req.headers().get("x-real-ip"))
        .and_then(|h| h.to_str().ok())
        .unwrap_or("unknown")
        .to_string();

    // Get device ID from headers with validation
    let device_id = req
        .headers()
        .get("x-device-id")
        .and_then(|h| h.to_str().ok())
        .and_then(|s| validate_device_id(s).then_some(s.to_string()));

    // Determine transaction type from path
    let path = req.uri().path();
    let transaction_type = if path.contains("/budgets") {
        TransactionType::BudgetModification
    } else {
        TransactionType::Query
    };

    RateLimitKey::new(ip, device_id, transaction_type)
}

/// Validates device ID format and length
fn validate_device_id(device_id: &str) -> bool {
    // Device ID should be 8-64 characters, alphanumeric with hyphens/underscores
    let len = device_id.len();
    len >= 8 && len <= 64 && device_id.chars().all(|c| c.is_alphanumeric() || c == '-' || c == '_')
}

/// Rate limiting middleware for Axum
pub async fn rate_limit_middleware(
    State(rate_limiter): State<Arc<RateLimitService>>,
    req: axum::http::Request<axum::body::Body>,
    next: Next<axum::body::Body>,
) -> impl IntoResponse {

    // Extract rate limit information
    let rate_limit_key = extract_rate_limit_info(&req);

    // Check rate limit
    match rate_limiter.check_and_record(rate_limit_key).await {
        Ok(result) => {
            if result.allowed {
                // Process request and add rate limit headers
                let mut res = next.run(req).await;
                add_rate_limit_headers(&mut res, &result);
                res
            } else {
                // Return rate limit error
                create_rate_limit_error(&result).into_response()
            }
        }
        Err(e) => {
            // Log error but allow request to proceed (graceful degradation)
            tracing::warn!("Rate limit check failed: {}", e);
            let mut res = next.run(req).await;
            add_error_headers(&mut res);
            res.into_response()
        }
    }
}

/// Add rate limit headers to response
fn add_rate_limit_headers(res: &mut axum::response::Response, result: &crate::rate_limiter::types::RateLimitResult) {
    let headers = res.headers_mut();

    // Safely insert headers with proper error handling
    if let Ok(limit_header) = result.limit_type.get_limit().to_string().parse() {
        headers.insert("X-RateLimit-Limit", limit_header);
    }

    if let Ok(remaining_header) = result.remaining_requests.to_string().parse() {
        headers.insert("X-RateLimit-Remaining", remaining_header);
    }

    if let Ok(reset_header) = result.reset_time.to_string().parse() {
        headers.insert("X-RateLimit-Reset", reset_header);
    }

    if let Some(retry_after) = result.retry_after {
        if let Ok(retry_header) = retry_after.to_string().parse() {
            headers.insert("Retry-After", retry_header);
        }
    }
}

/// Add error headers when rate limiting fails
fn add_error_headers(res: &mut axum::response::Response) {
    let headers = res.headers_mut();
    if let Ok(status_header) = "degraded".parse() {
        headers.insert("X-RateLimit-Status", status_header);
    }
}

/// Create rate limit error response
fn create_rate_limit_error(result: &crate::rate_limiter::types::RateLimitResult) -> impl IntoResponse {
    let error_body = json!({
        "error": "Rate limit exceeded",
        "message": format!("Too many requests for {:?}", result.limit_type),
        "retry_after": result.retry_after,
        "reset_at": result.reset_time,
        "limit_type": result.limit_type
    });

    (StatusCode::TOO_MANY_REQUESTS, Json(error_body))
}
