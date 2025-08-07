use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

//////////////////////////////////////////////////////////////////////
// Database models
//////////////////////////////////////////////////////////////////////

// Budget model for database storage
#[derive(Debug, FromRow)]
pub struct Budget {
    pub id: Uuid,
    pub month: i16, // smallint in PostgreSQL - matches database schema
    pub year: i32,  // integer in PostgreSQL
    pub category_id: Uuid,
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Decimal, // NOT NULL DEFAULT 0 in database
    pub currency: String,
    pub created_at: DateTime<Utc>, // timestamptz NOT NULL DEFAULT now() in database
    pub updated_at: DateTime<Utc>, // timestamptz NOT NULL DEFAULT now() in database
}

// Budget response wrapper for API responses
#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetResponse {
    pub overview: BudgetOverviewApi,
    pub categories: Vec<CategoryBudgetApi>,
    pub insights: Vec<BudgetInsight>,
}

// Create budget request model for API requests
#[derive(Debug, Deserialize)]
pub struct CreateBudgetRequest {
    pub category_id: String, // Keep as String for API compatibility
    pub planned: Decimal,
    pub currency: String,
    pub month: Option<u8>, // Make optional with default - u8 is more semantically correct
    pub year: Option<i32>, // Make optional with default
}

// Update budget request model for API requests
#[derive(Debug, Deserialize)]
pub struct UpdateBudgetRequest {
    pub planned: Option<Decimal>,
    pub carryover: Option<Decimal>,
}

// Budget insight model for API responses
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

// Budget API model for API responses
// Provide API stability even if database schema changes.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BudgetApi {
    pub id: String, // Keep as String for API compatibility
    pub month: u8,  // u8 is more semantically correct for 1-12
    pub year: i32,
    pub category_id: String, // Keep as String for API compatibility
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Decimal,
    pub currency: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// Budget overview for API responses
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BudgetOverviewApi {
    pub planned: Decimal,
    pub spent: Decimal,
    pub remaining: Decimal,
    pub currency: String,
}

// Category budget details for API responses
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
