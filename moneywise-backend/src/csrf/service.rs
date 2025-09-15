//! CSRF Service for secure token generation
//!
//! This service provides cryptographically secure CSRF token generation
//! using industry-standard practices.

use crate::models::{CsrfTokenData, CsrfTokenResponse};
use axum_sessions::extractors::WritableSession;
use base64::{engine::general_purpose, Engine as _};
use chrono::{Duration, Utc};
use rand::Rng;

/// CSRF service for token generation
///
/// This service manages CSRF tokens using:
/// - Cryptographically secure random token generation
/// - Session-based token storage
/// - Configurable token expiry
#[derive(Debug, Clone)]
pub struct CsrfService {
    /// Token expiry duration in seconds (default: 1 hour)
    token_expiry_seconds: u64,
}

impl CsrfService {
    /// Creates a new CSRF service with default configuration
    pub fn new() -> Self {
        Self::with_expiry(3600) // 1 hour default
    }

    /// Creates a new CSRF service with custom token expiry
    ///
    /// # Arguments
    /// * `expiry_seconds` - Token expiry time in seconds
    pub fn with_expiry(expiry_seconds: u64) -> Self {
        Self {
            token_expiry_seconds: expiry_seconds,
        }
    }

    /// Generates a new CSRF token and stores it in the session
    ///
    /// # Arguments
    /// * `session` - Writable session for storing the token
    ///
    /// # Returns
    /// * `CsrfTokenResponse` - Token response for the frontend
    pub async fn generate_token(
        &self,
        session: &mut WritableSession,
    ) -> Result<CsrfTokenResponse, Box<dyn std::error::Error + Send + Sync>> {
        // Generate cryptographically secure random token
        let token = self.generate_secure_token();

        // Calculate expiry times
        let now = Utc::now();
        let expires_at = now + Duration::seconds(self.token_expiry_seconds as i64);

        // Create token data
        let token_data = CsrfTokenData {
            token: token.clone(),
            created_at: now,
            expires_at,
        };

        // Store in session
        session.insert("csrf_token", &token_data)?;

        // Return response in the format expected by frontend
        Ok(CsrfTokenResponse {
            token,
            expires_in: self.token_expiry_seconds * 1000, // Convert to milliseconds
        })
    }


    /// Generates a cryptographically secure random token
    ///
    /// Uses a combination of random bytes and base64 encoding to create
    /// a secure, URL-safe token.
    fn generate_secure_token(&self) -> String {
        // Generate 32 random bytes (256 bits of entropy)
        let mut random_bytes = [0u8; 32];
        rand::thread_rng().fill(&mut random_bytes);

        // Encode as base64 for URL-safe transmission
        general_purpose::URL_SAFE_NO_PAD.encode(random_bytes)
    }


}

impl Default for CsrfService {
    fn default() -> Self {
        Self::new()
    }
}
