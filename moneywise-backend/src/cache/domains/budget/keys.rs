//! Budget domain cache key management.
//!
//! Provides consistent key generation for budget-related cache operations.
//! All keys use the `moneywise:budget:` namespace prefix for organization.

/// Generate cache key for budget overview data with namespace prefix.
/// Key format: "moneywise:budget:overview:{month}:{year}" or with currency
///             "moneywise:budget:overview:{month}:{year}:{currency}"
/// Used for caching monthly budget overview summaries
pub fn overview_key(month: &str, year: &str, currency: Option<&str>) -> String {
    match currency {
        Some(c) => {
            format!("moneywise:budget:overview:{}:{}:{}", month, year, c)
        }
        None => format!("moneywise:budget:overview:{}:{}", month, year),
    }
}

/// Generate cache key for category budget data with namespace prefix.
/// Key format: "moneywise:budget:categories:{month}:{year}" or with currency
///             "moneywise:budget:categories:{month}:{year}:{currency}"
/// Used for caching category-specific budget breakdowns
pub fn categories_key(
    month: &str,
    year: &str,
    currency: Option<&str>,
) -> String {
    match currency {
        Some(c) => {
            format!("moneywise:budget:categories:{}:{}:{}", month, year, c)
        }
        None => format!("moneywise:budget:categories:{}:{}", month, year),
    }
}

/// Generate cache key for individual budget data with namespace prefix.
/// Key format: "moneywise:budget:item:{id}"
/// Used for caching individual budget entries
pub fn budget_key(id: &str) -> String {
    format!("moneywise:budget:item:{}", id)
}
