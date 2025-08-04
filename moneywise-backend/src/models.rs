use chrono::{DateTime, NaiveDateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

//////////////////////////////////////////////////////////////////////
// Database models
//////////////////////////////////////////////////////////////////////

// Budget model for database storage
#[derive(Debug, FromRow)]
pub struct Budget {
    pub id: String,
    pub month: String,
    pub year: String,
    pub category_id: String,
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Option<Decimal>,
    pub currency: String,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
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
    pub category_id: String,
    pub planned: Decimal,
    pub currency: String,
    pub month: String,
    pub year: String,
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
#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetApi {
    pub id: String,
    pub month: String,
    pub year: String,
    pub category_id: String,
    pub planned: Decimal,
    pub spent: Decimal,
    pub carryover: Decimal,
    pub currency: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// Budget overview for API responses
#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetOverviewApi {
    pub planned: Decimal,
    pub spent: Decimal,
    pub remaining: Decimal,
    pub currency: String,
}

// Category budget details for API responses
#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryBudgetApi {
    pub id: String,
    pub category_name: String,
    pub group_name: String,
    pub category_color: String,
    pub group_color: String,
    pub planned: Decimal,
    pub spent: Decimal,
    pub remaining: Decimal,
    pub percentage: Decimal,
    pub currency: String,
}
