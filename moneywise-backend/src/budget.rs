// Budget management module for MoneyWise backend
// This module handles all budget-related operations including CRUD operations,
// budget overview calculations, and intelligent insights generation.
//
// Key Design Decisions:
// 1. Uses rust_decimal for precise financial calculations (avoids floating-point errors)
// 2. Implements RESTful API patterns with proper error handling
// 3. Separates database models from API models for better type safety
// 4. Uses async/await for non-blocking database operations
// 5. Implements intelligent budget insights based on spending patterns

use axum::{
    extract::{Path, Query, State},
    response::Json,
    routing::{get, post, put},
    Router,
};
use chrono::{DateTime};
use serde::Deserialize;
use sqlx::PgPool;
use rust_decimal::Decimal;
use uuid::Uuid;

use crate::{
    cache::CacheService,
    error::{AppError, Result},
    models::*,
};

/// Application state containing both database pool and cache service
/// This allows handlers to access both database and cache operations
pub type AppState = (PgPool, CacheService);

/// Query parameters for budget filtering
/// Allows optional month and year filtering with sensible defaults
#[derive(Debug, Deserialize)]
pub struct BudgetQuery {
    pub month: Option<String>,
    pub year: Option<String>,
}

/// Creates and configures the budget router with all budget-related endpoints
///
/// Routes:
/// - GET / - Get all budgets with overview and insights
/// - GET /overview - Get budget overview only
/// - POST / - Create a new budget
/// - PUT /:id - Update an existing budget
/// - GET /:id - Get a specific budget by ID
pub fn budget_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_budgets))
        .route("/overview", get(get_budget_overview))
        .route("/", post(create_budget))
        .route("/:id", put(update_budget))
        .route("/:id", get(get_budget_by_id))
}

/// Generates intelligent budget insights based on spending patterns
///
/// Insight types:
/// - Warning: When spending exceeds budget limits
/// - Positive: When there's remaining budget
/// - Suggestion: Proactive recommendations for better budget management
///
/// Algorithm choices:
/// - Uses percentage-based thresholds for consistent insights
/// - Provides actionable messages with specific amounts
/// - Uses color coding for visual distinction in UI
fn generate_budget_insights(
    overview: &BudgetOverviewApi,
    categories: &[CategoryBudgetApi],
) -> Vec<BudgetInsight> {
    let mut insights = Vec::new();

    // Check for over-budget categories (spending > 100% of planned)
    // This helps users identify problematic spending areas early
    for category in categories {
        if category.percentage > Decimal::from(100) {
            let over_percentage = category.percentage - Decimal::from(100);
            insights.push(BudgetInsight {
                type_: "warning".to_string(),
                message: format!("You're {}% over budget on {}",
                    over_percentage.to_string(), category.category_name),
                icon: "warning-outline".to_string(),
                color: "#FF6B6B".to_string(),
            });
        }
    }

    // Check overall budget status
    // Provides high-level financial health indicators
    if overview.remaining > Decimal::from(0) {
        insights.push(BudgetInsight {
            type_: "positive".to_string(),
            message: format!("You have ${} remaining for other expenses", overview.remaining.to_string()),
            icon: "checkmark-circle-outline".to_string(),
            color: "#4ECDC4".to_string(),
        });
    } else if overview.remaining < Decimal::from(0) {
        insights.push(BudgetInsight {
            type_: "warning".to_string(),
            message: format!("You're ${} over your total budget", overview.remaining.abs().to_string()),
            icon: "warning-outline".to_string(),
            color: "#FF6B6B".to_string(),
        });
    }

    // Add proactive suggestions for better budget management
    // Uses 90% threshold to provide early warnings
    if categories.iter().any(|c| c.percentage > Decimal::from(90)) {
        insights.push(BudgetInsight {
            type_: "suggestion".to_string(),
            message: "Consider reviewing your spending in categories near budget limits".to_string(),
            icon: "bulb-outline".to_string(),
            color: "#007AFF".to_string(),
        });
    }

    insights
}

/// Retrieves category-specific budget data with detailed information
///
/// Query optimization:
/// - Uses JOINs to get category and group information in single query
/// - Orders by group sort_order and category name for consistent UI
/// - Calculates percentage and remaining amounts in application layer
/// - Uses proper indexing on month/year columns
async fn get_category_budgets(
    pool: &PgPool,
    month: &str,
    year: &str,
) -> Result<Vec<CategoryBudgetApi>> {
    let rows = sqlx::query!(
        r#"
        SELECT
            b.id,
            c.name as category_name,
            cg.name as group_name,
            c.color as category_color,
            cg.color as group_color,
            b.planned,
            b.spent,
            b.carryover,
            b.currency
        FROM budgets b
        JOIN categories c ON b.category_id = c.id
        JOIN category_groups cg ON c.group_id = cg.id
        WHERE b.month = $1 AND b.year = $2
        ORDER BY cg.sort_order, c.name
        "#,
        month,
        year
    )
    .fetch_all(pool)
    .await?;

    let mut category_budgets = Vec::new();

    for row in rows {
        let planned = row.planned.clone();
        let spent = row.spent.clone();
        let carryover = row.carryover.unwrap_or_default();
        let remaining = &planned - &spent + &carryover;

        // Calculate percentage with proper division handling
        let percentage = if &planned > &Decimal::from(0) {
            (&spent / &planned) * Decimal::from(100)
        } else {
            Decimal::from(0)
        };

        category_budgets.push(CategoryBudgetApi {
            id: row.id,
            category_name: row.category_name,
            group_name: row.group_name,
            category_color: row.category_color,
            group_color: row.group_color,
            planned,
            spent,
            remaining,
            percentage,
            currency: row.currency,
        });
    }

    Ok(category_budgets)
}



/// Retrieves budget overview for a specific month/year
///
/// This endpoint provides a lightweight alternative to the full budget response
/// Useful for dashboard widgets and quick overview displays
async fn get_budget_overview(
    State((pool, cache)): State<AppState>,
    Query(query): Query<BudgetQuery>,
) -> Result<Json<BudgetOverviewApi>> {
    let month = query.month.unwrap_or_else(|| {
        chrono::Utc::now().format("%B").to_string()
    });
    let year = query.year.unwrap_or_else(|| {
        chrono::Utc::now().format("%Y").to_string()
    });

    // Try to get data from cache first
    if let Some(cached_overview) = cache.get_cached_budget_overview(&month, &year).await? {
        return Ok(Json(cached_overview));
    }

    // Cache miss - fetch from database and cache the result
    let overview = get_budget_overview_data(&pool, &month, &year).await?;

    // Cache the result for future requests (don't block on cache write)
    let _ = cache.cache_budget_overview(&month, &year, &overview).await;

    Ok(Json(overview))
}


/// Retrieves all budgets for a given month/year with comprehensive data
///
/// Optimization choices:
/// - Uses default current month/year if not specified (reduces API complexity)
/// - Combines overview, categories, and insights in single response (reduces network calls)
/// - Performs calculations in database queries (better performance than in-memory)
/// - Uses proper indexing on month/year columns for fast filtering
/// - Implements Redis caching for frequently accessed data
async fn get_budgets(
    State((pool, cache)): State<AppState>,
    Query(query): Query<BudgetQuery>,
) -> Result<Json<BudgetResponse>> {
    // Default to current month/year if not provided
    // This provides a better UX by showing relevant data immediately
    let month = query.month.unwrap_or_else(|| {
        chrono::Utc::now().format("%B").to_string()
    });
    let year = query.year.unwrap_or_else(|| {
        chrono::Utc::now().format("%Y").to_string()
    });

    // Try to get cached data first
    let cached_overview = cache.get_cached_budget_overview(&month, &year).await?;
    let cached_categories = cache.get_cached_category_budgets(&month, &year).await?;

    let (overview, categories) = match (cached_overview, cached_categories) {
        (Some(overview), Some(categories)) => {
            // Cache hit for both overview and categories
            (overview, categories)
        }
        _ => {
            // Cache miss - fetch from database and cache the results
            let (overview, categories) = tokio::try_join!(
                get_budget_overview_data(&pool, &month, &year),
                get_category_budgets(&pool, &month, &year),
            )?;

            // Cache the results for future requests (don't block on cache writes)
            let _ = cache.cache_budget_overview(&month, &year, &overview).await;
            let _ = cache.cache_category_budgets(&month, &year, &categories).await;

            (overview, categories)
        }
    };

    // Generate insights based on the retrieved data
    // This is done in-memory since it's lightweight and doesn't require DB access
    let insights = generate_budget_insights(&overview, &categories);

    Ok(Json(BudgetResponse {
        overview,
        categories,
        insights,
    }))
}

/// Calculates budget overview data for a given month/year
///
/// Performance optimizations:
/// - Uses COALESCE to handle NULL values efficiently
/// - Groups by currency to support multi-currency budgets
/// - Calculates remaining amount in SQL (reduces data transfer)
/// - Uses LIMIT 1 since we expect single currency per query
async fn get_budget_overview_data(
    pool: &PgPool,
    month: &str,
    year: &str,
) -> Result<BudgetOverviewApi> {
    let result = sqlx::query!(
        r#"
        SELECT
            COALESCE(SUM(planned), 0) as planned,
            COALESCE(SUM(spent), 0) as spent,
            COALESCE(SUM(carryover), 0) as carryover,
            currency
        FROM budgets
        WHERE month = $1 AND year = $2
        GROUP BY currency
        LIMIT 1
        "#,
        month,
        year
    )
    .fetch_one(pool)
    .await?;

    let planned = result.planned.unwrap_or_default();
    let spent = result.spent.unwrap_or_default();
    let carryover = result.carryover.unwrap_or_default();
    let remaining = &planned - &spent + &carryover;

    Ok(BudgetOverviewApi {
        planned,
        spent,
        remaining,
        currency: result.currency,
    })
}

/// Creates a new budget entry
///
/// Security and validation considerations:
/// - Uses UUID for ID generation (prevents enumeration attacks)
/// - Validates input through serde deserialization
/// - Uses parameterized queries to prevent SQL injection
/// - Returns complete budget object for immediate use
/// - Invalidates related cache entries to ensure data consistency
async fn create_budget(
    State((pool, cache)): State<AppState>,
    Json(payload): Json<CreateBudgetRequest>,
) -> Result<Json<BudgetApi>> {
    // Generate a secure UUID for the budget ID
    // This prevents ID enumeration and provides global uniqueness
    let id = Uuid::new_v4().to_string();

    // Use parameterized query to prevent SQL injection
    // The query_as! macro provides compile-time SQL validation
    let budget = sqlx::query_as!(
        Budget,
        r#"
        INSERT INTO budgets (id, month, year, category_id, planned, currency)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, month, year, category_id, planned, spent, carryover, currency, created_at, updated_at
        "#,
        id,
        payload.month,
        payload.year,
        payload.category_id,
        payload.planned,
        payload.currency
    )
    .fetch_one(&pool)
    .await?;

    // Clone month and year for cache invalidation before moving into budget_api
    let month = budget.month.clone();
    let year = budget.year.clone();

    // Convert database model to API model
    // This separation ensures API stability even if database schema changes
    let budget_api = BudgetApi {
        id: budget.id,
        month: budget.month,
        year: budget.year,
        category_id: budget.category_id,
        planned: budget.planned,
        spent: budget.spent,
        carryover: budget.carryover.unwrap_or_default(),
        currency: budget.currency,
        created_at: budget.created_at.map(|dt| DateTime::from_naive_utc_and_offset(dt, chrono::Utc)).unwrap_or_else(|| chrono::Utc::now()),
        updated_at: budget.updated_at.map(|dt| DateTime::from_naive_utc_and_offset(dt, chrono::Utc)).unwrap_or_else(|| chrono::Utc::now()),
    };

    // Invalidate cache for this month/year since we added a new budget
    // This ensures cache consistency when new data is added
    let _ = cache.invalidate_month_cache(&month, &year).await;

    Ok(Json(budget_api))
}

/// Updates an existing budget entry
///
/// Update strategy:
/// - Only updates provided fields (partial updates supported)
/// - Maintains data integrity by fetching current state first
/// - Updates timestamp automatically
/// - Returns complete updated object
/// - Invalidates related cache entries to ensure data consistency
async fn update_budget(
    State((pool, cache)): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateBudgetRequest>,
) -> Result<Json<BudgetApi>> {
    // Fetch current budget state to ensure it exists
    // This provides better error messages and maintains data consistency
    let mut budget = sqlx::query_as!(
        Budget,
        "SELECT * FROM budgets WHERE id = $1",
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| AppError::NotFound("Budget not found".to_string()))?;

    // Apply partial updates only for provided fields
    // This allows flexible updates without requiring all fields
    if let Some(planned) = payload.planned {
        budget.planned = planned;
    }
    if let Some(carryover) = payload.carryover {
        budget.carryover = Some(carryover);
    }

    // Update the budget with new values
    let updated_budget = sqlx::query_as!(
        Budget,
        r#"
        UPDATE budgets
        SET planned = $1, carryover = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, month, year, category_id, planned, spent, carryover, currency, created_at, updated_at
        "#,
        budget.planned,
        budget.carryover.as_ref(),
        id
    )
    .fetch_one(&pool)
    .await?;

    // Clone month and year for cache invalidation before moving into budget_api
    let month = updated_budget.month.clone();
    let year = updated_budget.year.clone();

    // Convert to API model with proper timezone handling
    let budget_api = BudgetApi {
        id: updated_budget.id,
        month: updated_budget.month,
        year: updated_budget.year,
        category_id: updated_budget.category_id,
        planned: updated_budget.planned,
        spent: updated_budget.spent,
        carryover: updated_budget.carryover.unwrap_or_default(),
        currency: updated_budget.currency,
        created_at: updated_budget.created_at.map(|dt| DateTime::from_naive_utc_and_offset(dt, chrono::Utc)).unwrap_or_else(|| chrono::Utc::now()),
        updated_at: updated_budget.updated_at.map(|dt| DateTime::from_naive_utc_and_offset(dt, chrono::Utc)).unwrap_or_else(|| chrono::Utc::now()),
    };

    // Invalidate cache for this budget and the month/year
    // This ensures cache consistency when data is updated
    let _ = cache.invalidate_budget_cache(&id).await;
    let _ = cache.invalidate_month_cache(&month, &year).await;

    Ok(Json(budget_api))
}


/// Retrieves a specific budget by its ID
///
/// Error handling:
/// - Returns 404 if budget not found (proper REST semantics)
/// - Uses proper error mapping for database errors
/// - Implements caching for frequently accessed individual budgets
async fn get_budget_by_id(
    State((pool, cache)): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<BudgetApi>> {
    // Try to get data from cache first
    if let Some(cached_budget) = cache.get_cached_budget(&id).await? {
        return Ok(Json(cached_budget));
    }

    // Cache miss - fetch from database
    let budget = sqlx::query_as!(
        Budget,
        "SELECT * FROM budgets WHERE id = $1",
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| AppError::NotFound("Budget not found".to_string()))?;

    // Convert to API model with proper timezone handling
    let budget_api = BudgetApi {
        id: budget.id,
        month: budget.month,
        year: budget.year,
        category_id: budget.category_id,
        planned: budget.planned,
        spent: budget.spent,
        carryover: budget.carryover.unwrap_or_default(),
        currency: budget.currency,
        created_at: budget.created_at.map(|dt| DateTime::from_naive_utc_and_offset(dt, chrono::Utc)).unwrap_or_else(|| chrono::Utc::now()),
        updated_at: budget.updated_at.map(|dt| DateTime::from_naive_utc_and_offset(dt, chrono::Utc)).unwrap_or_else(|| chrono::Utc::now()),
    };

    // Cache the result for future requests (don't block on cache write)
    let _ = cache.cache_budget(&id, &budget_api).await;

    Ok(Json(budget_api))
}
