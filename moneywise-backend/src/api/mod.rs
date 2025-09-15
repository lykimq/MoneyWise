// API module for MoneyWise backend
// This module organizes all API routes and provides a centralized way to manage
// different API endpoints for the application.

use crate::cache::domains::budget::BudgetCache;
use crate::csrf::CsrfService;
use axum::Router;
use sqlx::PgPool;

// Import route modules
pub mod budget;
pub mod csrf;

/// Create the main API router with all available routes
/// This function combines all API routes into a single router
/// and returns the router with state already configured
pub fn create_api_router() -> Router<(PgPool, BudgetCache, CsrfService)> {
    /*
     * Frontend linkage:
     * - The MoneyWise web app consumes these routes via the service client in
     *   `moneywise-app/src/services/budget/client.ts` using paths like:
     *       GET    /api/budgets
     *       GET    /api/budgets/overview
     *       POST   /api/budgets
     *       PUT    /api/budgets/{id}
     *       GET    /api/budgets/{id}
     * - Keep the response JSON shape in sync with the TypeScript types in
     *   `moneywise-app/src/services/budget/types.ts`.
     * - This module is typically mounted under the "/api" prefix in the main
     *   server/router configuration.
     */
    Router::new()
        .nest("/budgets", budget::budget_routes())
        .nest("/", csrf::csrf_routes())
    // Future API routes can be added here by merging routers:
    // .merge(transactions::create_transaction_routes())
    // .merge(goals::create_goal_routes())
    // .merge(users::create_user_routes())
}
