//! Budget API for MoneyWise backend.
//!
//! Contains budget routes, handlers, and helpers.

use axum::{
    extract::{Path, Query, State},
    response::Json,
    routing::{get, post, put},
    Router,
};
use chrono::Datelike;
use rust_decimal::Decimal;
use serde::Deserialize;
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::{
    cache::domains::budget::BudgetCache,
    csrf::CsrfService,
    error::{AppError, Result},
    models::*,
};

/// Application state containing database pool, budget cache service, and CSRF service
pub type AppState = (PgPool, BudgetCache, CsrfService);

/// Query parameters for budget filtering
#[derive(Debug, Deserialize)]
pub struct BudgetQuery {
    pub month: Option<i16>,
    pub year: Option<i32>,
    pub currency: Option<String>,
}

/// Creates and configures the budget router with all budget-related endpoints
pub fn budget_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_budgets))
        .route("/overview", get(get_budget_overview))
        .route("/", post(create_budget))
        .route("/:id", put(update_budget))
        .route("/:id", get(get_budget_by_id))
}

// ================================================================
// 2) Public HTTP handlers
// ================================================================

/// Retrieves budget overview for a specific month/year.
///
/// Lightweight alternative to the full response; great for dashboards/widgets.
///
/// # Examples
///
/// Request (current month/year by default):
/// ```bash
/// curl -s \
///   "http://localhost:3000/budgets/overview?currency=EUR"
/// ```
///
/// Response body (JSON):
/// ```json
/// {
///   "planned": "1200.00",
///   "spent": "850.50",
///   "remaining": "349.50",
///   "currency": "EUR"
/// }
/// ```
async fn get_budget_overview(
    State((pool, cache, _csrf)): State<AppState>,
    Query(query): Query<BudgetQuery>,
) -> Result<Json<BudgetOverviewApi>> {
    let month = query
        .month
        .unwrap_or_else(|| chrono::Utc::now().month() as i16);
    let year = query.year.unwrap_or_else(|| chrono::Utc::now().year());

    // Convert to strings for cache keys
    let month_str = month.to_string();
    let year_str = year.to_string();

    let currency_filter = query.currency.as_deref();

    // Try to get data from cache first
    if let Some(cached_overview) = cache
        .get_cached_budget_overview(&month_str, &year_str, currency_filter)
        .await?
    {
        return Ok(Json(cached_overview));
    }

    // Cache miss - fetch from database and cache the result
    let overview =
        get_budget_overview_data(&pool, month, year, currency_filter).await?;

    // Cache the result for future requests (don't block on cache write)
    let _ = cache
        .cache_budget_overview(
            &month_str,
            &year_str,
            currency_filter,
            &overview,
        )
        .await;

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
///
/// # Examples
///
/// Request:
/// ```bash
/// curl -s \
///   "http://localhost:3000/budgets?month=6&year=2025&currency=EUR"
/// ```
///
/// Response body (JSON):
/// ```json
/// {
///   "overview": { "planned": "1200.00", "spent": "850.50", "remaining": "349.50", "currency": "EUR" },
///   "categories": [
///     {
///       "id": "b8e6...",
///       "category_name": "Groceries",
///       "group_name": "Household",
///       "category_color": "#00AA88",
///       "group_color": "#224466",
///       "planned": "400.00",
///       "spent": "350.25",
///       "remaining": "49.75",
///       "percentage": "87.5625",
///       "currency": "EUR"
///     }
///   ],
///   "insights": [
///     { "type_": "positive", "message": "You have $349.50 remaining for other expenses", "icon": "checkmark-circle-outline", "color": "#4ECDC4" }
///   ]
/// }
/// ```
async fn get_budgets(
    State((pool, cache, _csrf)): State<AppState>,
    Query(query): Query<BudgetQuery>,
) -> Result<Json<BudgetResponse>> {
    // Default to current month/year if not provided
    // This provides a better UX by showing relevant data immediately
    let month = query
        .month
        .unwrap_or_else(|| chrono::Utc::now().month() as i16);
    let year = query.year.unwrap_or_else(|| chrono::Utc::now().year());

    // Convert to strings for cache keys
    let month_str = month.to_string();
    let year_str = year.to_string();

    // Try to get cached data first
    let currency_filter = query.currency.as_deref();
    let cached_overview = cache
        .get_cached_budget_overview(&month_str, &year_str, currency_filter)
        .await?;
    let cached_categories = cache
        .get_cached_category_budgets(&month_str, &year_str, currency_filter)
        .await?;

    let (overview, categories) = match (cached_overview, cached_categories) {
        (Some(overview), Some(categories)) => {
            // Cache hit for both overview and categories
            (overview, categories)
        }
        _ => {
            // Cache miss - fetch from database and cache the results
            let (overview, categories) = tokio::try_join!(
                get_budget_overview_data(&pool, month, year, currency_filter),
                get_category_budgets(&pool, month, year, currency_filter),
            )?;

            // Cache the results for future requests (don't block on cache writes)
            let _ = cache
                .cache_budget_overview(
                    &month_str,
                    &year_str,
                    currency_filter,
                    &overview,
                )
                .await;
            let _ = cache
                .cache_category_budgets(
                    &month_str,
                    &year_str,
                    currency_filter,
                    &categories,
                )
                .await;

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

/// Creates a new budget entry
///
/// Security and validation considerations:
/// - Uses UUID for ID generation (prevents enumeration attacks)
/// - Validates input through serde deserialization
/// - Uses parameterized queries to prevent SQL injection
/// - Returns complete budget object for immediate use
/// - Invalidates related cache entries to ensure data consistency
///
/// # Examples
///
/// Request:
/// ```bash
/// curl -s -X POST "http://localhost:3000/budgets" \
///   -H 'Content-Type: application/json' \
///   -d '{
///         "category_id": "7f1e1c6a-3a3e-4b32-a3d1-8d1cc3dfaa10",
///         "planned": "250.00",
///         "currency": "EUR",
///         "month": 6,
///         "year": 2025
///       }'
/// ```
///
/// Response body (JSON):
/// ```json
/// {
///   "id": "c0a8...",
///   "month": 6,
///   "year": 2025,
///   "category_id": "7f1e1c6a-3a3e-4b32-a3d1-8d1cc3dfaa10",
///   "planned": "250.00",
///   "spent": "0",
///   "carryover": "0",
///   "currency": "EUR",
///   "created_at": "2025-06-10T12:34:56Z",
///   "updated_at": "2025-06-10T12:34:56Z"
/// }
/// ```
async fn create_budget(
    State((pool, cache, _csrf)): State<AppState>,
    Json(payload): Json<CreateBudgetRequest>,
) -> Result<Json<BudgetApi>> {
    // Validate input data
    if payload.planned <= Decimal::from(0) {
        return Err(AppError::Validation(
            "Planned amount must be greater than 0".to_string(),
        ));
    }

    if payload.category_id.is_empty() {
        return Err(AppError::Validation(
            "Category ID is required".to_string(),
        ));
    }

    if payload.currency.is_empty() {
        return Err(AppError::Validation("Currency is required".to_string()));
    }

    // Validate optional month/year range to match database constraints
    if let Some(m) = payload.month {
        if m < 1 || m > 12 {
            return Err(AppError::Validation(
                "Month must be between 1 and 12".to_string(),
            ));
        }
    }
    if let Some(y) = payload.year {
        if y < 2000 {
            return Err(AppError::Validation(
                "Year must be 2000 or later".to_string(),
            ));
        }
    }

    // Validate currency length to match char(3)
    if payload.currency.len() != 3 {
        return Err(AppError::Validation(
            "Currency must be a 3-letter code".to_string(),
        ));
    }

    // Parse category_id to UUID
    let category_id = Uuid::parse_str(&payload.category_id).map_err(|_| {
        AppError::Validation("Invalid category ID format".to_string())
    })?;

    // Use current month/year if not provided
    let month = payload
        .month
        .unwrap_or_else(|| chrono::Utc::now().month() as i16);
    let year = payload.year.unwrap_or_else(|| chrono::Utc::now().year());

    // Generate a secure UUID for the budget ID
    // This prevents ID enumeration and provides global uniqueness
    let id = Uuid::new_v4();

    // Use parameterized query to prevent SQL injection
    // The query_as! macro provides compile-time SQL validation
    let budget = match sqlx::query_as::<_, Budget>(
        r#"
        INSERT INTO budgets (id, month, year, category_id, planned, currency)
        VALUES ($1::uuid, $2, $3, $4::uuid, $5, $6)
        RETURNING id, month, year, category_id, planned, spent, carryover, currency, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(month as i16)
    .bind(year)
    .bind(category_id)
    .bind(payload.planned)
    .bind(&payload.currency)
    .fetch_one(&pool)
    .await {
        Ok(row) => row,
        Err(e) => {
            // Map unique constraint violation (year, month, category_id) to a friendly 400 error
            if let sqlx::Error::Database(db_err) = &e {
                if db_err.code().as_deref() == Some("23505") {
                    return Err(AppError::Validation(
                        "Budget already exists for this year, month, and category".to_string(),
                    ));
                }
            }
            return Err(AppError::Database(e));
        }
    };

    // Convert database model to API model
    // This separation ensures API stability even if database schema changes
    let budget_api = BudgetApi {
        id: budget.id.to_string(),
        month: budget.month,
        year: budget.year,
        category_id: budget.category_id.to_string(),
        planned: budget.planned,
        spent: budget.spent,
        carryover: budget.carryover,
        currency: budget.currency,
        created_at: budget.created_at,
        updated_at: budget.updated_at,
    };

    // Invalidate cache for this month/year since we added a new budget
    // This ensures cache consistency when new data is added
    let month_str = budget.month.to_string();
    let year_str = budget.year.to_string();
    let _ = cache
        .invalidate_month_cache(
            &month_str,
            &year_str,
            Some(payload.currency.as_str()),
        )
        .await;

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
///
/// # Examples
///
/// Request:
/// ```bash
/// curl -s -X PUT "http://localhost:3000/budgets/8d0b9b6f-5cfa-43ef-9a48-6a0f7d6cfb3a" \
///   -H 'Content-Type: application/json' \
///   -d '{ "planned": "300.00", "carryover": "10.00" }'
/// ```
///
/// Response body (JSON):
/// ```json
/// {
///   "id": "8d0b9b6f-5cfa-43ef-9a48-6a0f7d6cfb3a",
///   "month": 6,
///   "year": 2025,
///   "category_id": "7f1e1c6a-3a3e-4b32-a3d1-8d1cc3dfaa10",
///   "planned": "300.00",
///   "spent": "150.00",
///   "carryover": "10.00",
///   "currency": "EUR",
///   "created_at": "2025-06-10T12:34:56Z",
///   "updated_at": "2025-06-11T08:00:00Z"
/// }
/// ```
async fn update_budget(
    State((pool, cache, _csrf)): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateBudgetRequest>,
) -> Result<Json<BudgetApi>> {
    // Parse ID to UUID
    let budget_id = Uuid::parse_str(&id).map_err(|_| {
        AppError::Validation("Invalid budget ID format".to_string())
    })?;

    // Fetch current budget state to ensure it exists
    // This provides better error messages and maintains data consistency
    let mut budget = sqlx::query_as::<_, Budget>(
        "SELECT * FROM budgets WHERE id = $1::uuid",
    )
    .bind(budget_id)
    .fetch_one(&pool)
    .await
    .map_err(|_| AppError::NotFound("Budget not found".to_string()))?;

    // Apply partial updates only for provided fields
    // This allows flexible updates without requiring all fields
    if let Some(planned) = payload.planned {
        if planned <= Decimal::from(0) {
            return Err(AppError::Validation(
                "Planned amount must be greater than 0".to_string(),
            ));
        }
        budget.planned = planned;
    }
    if let Some(carryover) = payload.carryover {
        if carryover < Decimal::from(0) {
            return Err(AppError::Validation(
                "Carryover amount cannot be negative".to_string(),
            ));
        }
        budget.carryover = carryover;
    }

    // Update the budget with new values
    let updated_budget = sqlx::query_as::<_, Budget>(
        r#"
        UPDATE budgets
        SET planned = $1, carryover = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3::uuid
        RETURNING id, month, year, category_id, planned, spent, carryover, currency, created_at, updated_at
        "#,
    )
    .bind(budget.planned)
    .bind(budget.carryover)
    .bind(budget_id)
    .fetch_one(&pool)
    .await?;

    // Convert to API model with proper timezone handling
    let currency_owned = updated_budget.currency.clone();
    let budget_api = BudgetApi {
        id: updated_budget.id.to_string(),
        month: updated_budget.month,
        year: updated_budget.year,
        category_id: updated_budget.category_id.to_string(),
        planned: updated_budget.planned,
        spent: updated_budget.spent,
        carryover: updated_budget.carryover,
        currency: currency_owned.clone(),
        created_at: updated_budget.created_at,
        updated_at: updated_budget.updated_at,
    };

    // Invalidate cache for this budget and the month/year
    // This ensures cache consistency when data is updated
    let month_str = updated_budget.month.to_string();
    let year_str = updated_budget.year.to_string();
    let _ = cache.invalidate_budget_cache(&id).await;
    let _ = cache
        .invalidate_month_cache(
            &month_str,
            &year_str,
            Some(currency_owned.as_str()),
        )
        .await;

    Ok(Json(budget_api))
}

/// Retrieves a specific budget by its ID
///
/// Error handling:
/// - Returns 404 if budget not found (proper REST semantics)
/// - Uses proper error mapping for database errors
/// - Implements caching for frequently accessed individual budgets
///
/// # Examples
///
/// Request:
/// ```bash
/// curl -s "http://localhost:3000/budgets/8d0b9b6f-5cfa-43ef-9a48-6a0f7d6cfb3a"
/// ```
///
/// Response body (JSON):
/// ```json
/// {
///   "id": "8d0b9b6f-5cfa-43ef-9a48-6a0f7d6cfb3a",
///   "month": 6,
///   "year": 2025,
///   "category_id": "7f1e1c6a-3a3e-4b32-a3d1-8d1cc3dfaa10",
///   "planned": "300.00",
///   "spent": "150.00",
///   "carryover": "10.00",
///   "currency": "EUR",
///   "created_at": "2025-06-10T12:34:56Z",
///   "updated_at": "2025-06-11T08:00:00Z"
/// }
/// ```
async fn get_budget_by_id(
    State((pool, cache, _csrf)): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<BudgetApi>> {
    // Try to get data from cache first
    if let Some(cached_budget) = cache.get_cached_budget(&id).await? {
        return Ok(Json(cached_budget));
    }

    // Parse ID to UUID
    let budget_id = Uuid::parse_str(&id).map_err(|_| {
        AppError::Validation("Invalid budget ID format".to_string())
    })?;

    // Cache miss - fetch from database
    let budget = sqlx::query_as::<_, Budget>(
        "SELECT * FROM budgets WHERE id = $1::uuid",
    )
    .bind(budget_id)
    .fetch_one(&pool)
    .await
    .map_err(|_| AppError::NotFound("Budget not found".to_string()))?;

    // Convert to API model with proper timezone handling
    let budget_api = BudgetApi {
        id: budget.id.to_string(),
        month: budget.month,
        year: budget.year,
        category_id: budget.category_id.to_string(),
        planned: budget.planned,
        spent: budget.spent,
        carryover: budget.carryover,
        currency: budget.currency,
        created_at: budget.created_at,
        updated_at: budget.updated_at,
    };

    // Cache the result for future requests (don't block on cache write)
    let _ = cache.cache_budget(&id, &budget_api).await;

    Ok(Json(budget_api))
}

// ================================================================
// 3) Internal data-access helpers (queries/aggregation)
// ================================================================

/// Calculates budget overview data for a given month/year.
///
/// Notes:
/// - SUMs are done in SQL for efficiency and to reduce data transferred
/// - `COALESCE` ensures NULL-safe totals
/// - Grouped by currency to support multi-currency budgets; we pick the first (typical single currency per query)
async fn get_budget_overview_data(
    pool: &PgPool,
    month: i16,
    year: i32,
    currency: Option<&str>,
) -> Result<BudgetOverviewApi> {
    let result = sqlx::query(
        r#"
        SELECT
            COALESCE(SUM(planned), 0) as planned,
            COALESCE(SUM(spent), 0) as spent,
            COALESCE(SUM(carryover), 0) as carryover,
            TRIM(currency) as currency
        FROM budgets
        WHERE month = $1::smallint AND year = $2
        AND ($3::text IS NULL OR currency = $3)
        GROUP BY currency
        LIMIT 1
        "#,
    )
    .bind(month as i16)
    .bind(year)
    .bind(currency)
    .fetch_optional(pool)
    .await?;

    if let Some(result) = result {
        let planned: Decimal = result.try_get("planned")?;
        let spent: Decimal = result.try_get("spent")?;
        let carryover: Decimal = result.try_get("carryover")?;
        let remaining = &planned - &spent + &carryover;

        Ok(BudgetOverviewApi {
            planned,
            spent,
            remaining,
            currency: result
                .try_get::<String, _>("currency")?
                .trim()
                .to_string(),
        })
    } else {
        // No data for this month/year: return zeros and default currency (EUR) if not provided
        let currency_fallback = currency.unwrap_or("EUR").to_string();

        Ok(BudgetOverviewApi {
            planned: Decimal::from(0),
            spent: Decimal::from(0),
            remaining: Decimal::from(0),
            currency: currency_fallback,
        })
    }
}

/// Retrieves category-specific budget rows and enriches them for API consumption.
///
/// Implementation details:
/// - Single query joins categories and optional groups for efficiency
/// - Sorting by group sort_order (NULLs last) then category name for stable UI rendering
/// - Percentage computed in application code to keep SQL simple and precise with decimals
async fn get_category_budgets(
    pool: &PgPool,
    month: i16,
    year: i32,
    currency: Option<&str>,
) -> Result<Vec<CategoryBudgetApi>> {
    let rows = sqlx::query(
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
            TRIM(b.currency) as currency
        FROM budgets b
        JOIN categories c ON b.category_id = c.id
        LEFT JOIN category_groups cg ON c.group_id = cg.id
        WHERE b.month = $1 AND b.year = $2
        AND ($3::text IS NULL OR b.currency = $3)
        ORDER BY COALESCE(cg.sort_order, 999), c.name
        "#,
    )
    .bind(month as i16)
    .bind(year)
    .bind(currency)
    .fetch_all(pool)
    .await?;

    let mut category_budgets = Vec::new();

    for row in rows {
        let planned: Decimal = row.try_get("planned")?;
        let spent: Decimal = row.try_get("spent")?;
        let carryover: Decimal = row.try_get("carryover")?;
        let remaining = &planned - &spent + &carryover;

        // Percentage of budget used; safe when planned is zero
        let percentage = if &planned > &Decimal::from(0) {
            ((&spent / &planned) * Decimal::from(100)).round_dp(2)
        } else {
            Decimal::from(0)
        };

        category_budgets.push(CategoryBudgetApi {
            id: row.try_get::<Uuid, _>("id")?.to_string(),
            category_name: row.try_get("category_name")?,
            group_name: row.try_get("group_name").ok(),
            category_color: row.try_get("category_color")?,
            group_color: row.try_get("group_color").ok(),
            planned,
            spent,
            remaining,
            percentage,
            currency: row.try_get::<String, _>("currency")?.trim().to_string(),
        });
    }

    Ok(category_budgets)
}

// ================================================================
// 4) Insights generator (pure, in-memory)
// ================================================================

/// Generates human-readable insights based on spending progress.
///
/// Categories with spending > 100% trigger warnings; nearing 90% triggers suggestions.
/// The overall remaining amount determines positive or warning messages.
fn generate_budget_insights(
    overview: &BudgetOverviewApi,
    categories: &[CategoryBudgetApi],
) -> Vec<BudgetInsight> {
    let mut insights = Vec::new();

    // Identify categories that exceeded their planned budget
    for category in categories {
        if category.percentage > Decimal::from(100) {
            let over_percentage =
                (category.percentage - Decimal::from(100)).round_dp(2);
            insights.push(BudgetInsight {
                type_: "warning".to_string(),
                message: format!(
                    "You're {}% over budget on {}",
                    over_percentage.to_string(),
                    category.category_name
                ),
                icon: "warning-outline".to_string(),
                color: "#FF6B6B".to_string(),
            });
        }
    }

    // High-level budget health
    if overview.remaining > Decimal::from(0) {
        insights.push(BudgetInsight {
            type_: "positive".to_string(),
            message: format!(
                "You have ${} remaining for other expenses",
                overview.remaining.to_string()
            ),
            icon: "checkmark-circle-outline".to_string(),
            color: "#4ECDC4".to_string(),
        });
    } else if overview.remaining < Decimal::from(0) {
        insights.push(BudgetInsight {
            type_: "warning".to_string(),
            message: format!(
                "You're ${} over your total budget",
                overview.remaining.abs().to_string()
            ),
            icon: "warning-outline".to_string(),
            color: "#FF6B6B".to_string(),
        });
    }

    // Proactive suggestions for categories close to limits
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
