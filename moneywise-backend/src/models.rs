//! Data models for the MoneyWise backend.
//!
//! This module separates database models (used by sqlx) from external models
//! (with Serialize/Deserialize traits). This provides:
//! - Backwards compatibility when the database schema evolves
//! - Flexibility to transform internal types for external consumption
//! - Clear separation between persistence and external interfaces
//!
//! Design trade-offs:
//! - Slightly more code due to model duplication
//! - Lower coupling and better long-term maintainability
//!
//! Usage:
//! - Database models: Used with sqlx for database operations
//! - External models: Used for serialization/deserialization (HTTP, caching, etc.)
//! - Request models: Used for deserializing incoming data
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

//////////////////////////////////////////////////////////////////////
// Database models
//////////////////////////////////////////////////////////////////////

/// Database representation of a budget row.
///
/// - Matches PostgreSQL schema types
/// - Not exposed directly to API; use `BudgetApi`
#[derive(Debug, FromRow)]
pub struct Budget {
    pub id: Uuid,
    pub month: i16, // smallint in PostgreSQL
    pub year: i32,  // integer in PostgreSQL
    pub category_id: Uuid,
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Decimal,        // Default 0 in database
    pub currency: String,          // character(3) in PostgreSQL
    pub created_at: DateTime<Utc>, // timestamptz with default now()
    pub updated_at: DateTime<Utc>, // timestamptz with default now()
}

/// Budget overview with aggregated insights.
///
/// Contains high-level summaries and category breakdowns.
#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetResponse {
    pub overview: BudgetOverviewApi,
    pub categories: Vec<CategoryBudgetApi>,
    pub insights: Vec<BudgetInsight>,
}

/// Payload for creating a new budget entry.
///
/// Month and year are optional; server uses current if not provided.
#[derive(Debug, Deserialize)]
pub struct CreateBudgetRequest {
    pub category_id: String, // Keep as String for API compatibility
    pub planned: Decimal,
    pub currency: String,
    pub month: Option<i16>, // Optional with default
    pub year: Option<i32>,  // Optional with default
}

/// Partial update for an existing budget.
///
/// Only provided fields will be modified.
#[derive(Debug, Deserialize)]
pub struct UpdateBudgetRequest {
    pub planned: Option<Decimal>,
    pub carryover: Option<Decimal>,
}

/// User-facing budget insight for UI guidance.
#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetInsight {
    pub type_: String, // 'warning', 'suggestion', 'positive'
    pub message: String,
    pub icon: String,
    pub color: String,
}

//////////////////////////////////////////////////////////////////////
// Separation of Database and External models
// Trade-offs: More code but better maintainability and interface stability.
//////////////////////////////////////////////////////////////////////

/// External budget representation.
///
/// Decoupled from database schema for interface stability.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BudgetApi {
    pub id: String, // String for JSON compatibility
    pub month: i16, // smallint
    pub year: i32,
    pub category_id: String, // String for JSON compatibility
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Decimal,
    pub currency: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Monthly budget totals for dashboards.
///
/// Remaining = planned - spent + carryover
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BudgetOverviewApi {
    pub planned: Decimal,
    pub spent: Decimal,
    pub remaining: Decimal,
    pub currency: String,
}

/// Per-category budget details for UI.
///
/// Includes progress tracking and grouping information.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CategoryBudgetApi {
    pub id: String,
    pub category_name: String,
    pub group_name: Option<String>, // Nullable group
    pub category_color: String,
    pub group_color: Option<String>, // Nullable group color
    pub planned: Decimal,
    pub spent: Decimal,
    pub remaining: Decimal,
    pub percentage: Decimal,
    pub currency: String,
}
