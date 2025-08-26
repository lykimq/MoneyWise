//! Data models for the MoneyWise backend.
//!
//! This module intentionally separates database-facing structs (used by sqlx) from
//! API-facing structs (DTOs) that are serialized to/from JSON. This gives us:
//! - Backwards-compatible APIs when the database schema evolves
//! - The ability to hide internal fields or change types for ergonomics (e.g., `Uuid` → `String`)
//! - Clear security boundaries between persistence and public contracts
//!
//! Design trade-offs:
//! - Slightly more code due to model duplication
//! - Lower coupling and better long-term maintainability for real-world apps
//!
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

//////////////////////////////////////////////////////////////////////
// Database models
//////////////////////////////////////////////////////////////////////

/// Database representation of a budget row in table `budgets`.
///
/// Notes:
/// - Types match the PostgreSQL schema (e.g., `i16` for `smallint`)
/// - `currency` is `character(3)` in PostgreSQL - handled by custom Currency wrapper
/// - Do not expose this type to API consumers directly; prefer `BudgetApi`
#[derive(Debug, FromRow)]
pub struct Budget {
    pub id: Uuid,
    pub month: i16, // smallint in PostgreSQL - matches database schema
    pub year: i32,  // integer in PostgreSQL
    pub category_id: Uuid,
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Decimal,        // NOT NULL DEFAULT 0 in database
    pub currency: String,          // character(3) in PostgreSQL - Bpchar maps to String
    pub created_at: DateTime<Utc>, // timestamptz NOT NULL DEFAULT now() in database
    pub updated_at: DateTime<Utc>, // timestamptz NOT NULL DEFAULT now() in database
}

/// Aggregated response returned by the budget endpoints.
///
/// Contains a high-level overview, per-category breakdowns, and generated insights.
#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetResponse {
    pub overview: BudgetOverviewApi,
    pub categories: Vec<CategoryBudgetApi>,
    pub insights: Vec<BudgetInsight>,
}

/// Payload for creating a new budget entry via the HTTP API.
///
/// The `month` and `year` are optional; if omitted, the server uses the current month/year.
#[derive(Debug, Deserialize)]
pub struct CreateBudgetRequest {
    pub category_id: String, // Keep as String for API compatibility
    pub planned: Decimal,
    pub currency: String,
    pub month: Option<i16>, // Make optional with default - matches database schema
    pub year: Option<i32>,  // Make optional with default
}

/// Payload for partially updating an existing budget.
///
/// Only provided fields will be updated.
#[derive(Debug, Deserialize)]
pub struct UpdateBudgetRequest {
    pub planned: Option<Decimal>,
    pub carryover: Option<Decimal>,
}

/// A single insight item that the UI can render to guide users (e.g., warnings or suggestions).
#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetInsight {
    pub type_: String, // 'warning', 'suggestion', 'positive'
    pub message: String,
    pub icon: String,
    pub color: String,
}

//////////////////////////////////////////////////////////////////////
// Separation of Database and API models
// Trade-offs: More code but better maintainability and API versioning.
//////////////////////////////////////////////////////////////////////

/// API-facing representation of a budget.
///
/// Differences vs. `Budget` (DB):
/// - `id` and `category_id` are `String` for convenient JSON interop
/// - This type is safe to expose externally and can remain stable across DB changes
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BudgetApi {
    pub id: String, // Keep as String for API compatibility
    pub month: i16, // smallint to match database schema
    pub year: i32,
    pub category_id: String, // Keep as String for API compatibility
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Decimal,
    pub currency: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// High-level totals for a month/year used by dashboards and summaries.
///
/// `remaining` is computed as `planned - spent + carryover`.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BudgetOverviewApi {
    pub planned: Decimal,
    pub spent: Decimal,
    pub remaining: Decimal,
    pub currency: String,
}

/// Per-category budget breakdown used by the UI for grouping and progress bars.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CategoryBudgetApi {
    pub id: String,
    pub category_name: String,
    pub group_name: Option<String>, // Make optional since group_id can be NULL
    pub category_color: String,
    pub group_color: Option<String>, // Make optional since group can be NULL
    pub planned: Decimal,
    pub spent: Decimal,
    pub remaining: Decimal,
    pub percentage: Decimal,
    pub currency: String,
}
