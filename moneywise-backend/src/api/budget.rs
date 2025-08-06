// Budget API module for MoneyWise backend
// This module handles all budget-related API routes and endpoints
// providing a clean separation between API routing and business logic

use crate::budget::{budget_routes, AppState};
use axum::Router;

/// Create budget API routes
/// This function returns the budget router with all budget-related endpoints
pub fn create_budget_routes() -> Router<AppState> {
    budget_routes()
}
