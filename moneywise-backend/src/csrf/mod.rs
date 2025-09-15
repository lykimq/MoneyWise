//! CSRF Protection Module for MoneyWise Backend
//!
//! Provides secure CSRF token generation and session management.
//! This module implements industry-standard CSRF protection using cryptographically
//! secure random tokens with proper session management.

pub mod service;

pub use service::CsrfService;
