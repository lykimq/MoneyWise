// MoneyWise Backend Library
// This file makes the crate available for integration tests
// by re-exporting the main modules and types.

// Re-export main modules
pub mod budget;
pub mod cache;
pub mod database;
pub mod error;
pub mod models;

// Re-export main types for convenience
pub use budget::*;
pub use cache::*;
pub use database::*;
pub use error::*;
pub use models::*;
