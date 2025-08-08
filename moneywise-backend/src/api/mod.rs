// API module for MoneyWise backend
// This module organizes all API routes and provides a centralized way to manage
// different API endpoints for the application.

use crate::cache::domains::budget::BudgetCache;
use axum::Router;
use sqlx::PgPool;

// Import route modules
pub mod budget;

/// Create the main API router with all available routes
/// This function combines all API routes into a single router
/// and returns the router with state already configured
pub fn create_api_router() -> Router<(PgPool, BudgetCache)> {
    budget::budget_routes()
    // Future API routes can be added here by merging routers:
    // .merge(transactions::create_transaction_routes())
    // .merge(goals::create_goal_routes())
    // .merge(users::create_user_routes())
}
