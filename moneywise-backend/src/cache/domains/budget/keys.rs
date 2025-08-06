// Budget domain cache key management for MoneyWise backend
// Provides consistent key generation for budget-related cache operations
// All keys use the "moneywise:budget:" namespace prefix for organization

/// Generates cache key for budget overview data with namespace prefix
/// Key format: "moneywise:budget:overview:{month}:{year}"
/// Used for caching monthly budget overview summaries
pub fn overview_key(month: &str, year: &str) -> String {
    format!("moneywise:budget:overview:{}:{}", month, year)
}

/// Generates cache key for category budget data with namespace prefix
/// Key format: "moneywise:budget:categories:{month}:{year}"
/// Used for caching category-specific budget breakdowns
pub fn categories_key(month: &str, year: &str) -> String {
    format!("moneywise:budget:categories:{}:{}", month, year)
}

/// Generates cache key for individual budget data with namespace prefix
/// Key format: "moneywise:budget:item:{id}"
/// Used for caching individual budget entries
pub fn budget_key(id: &str) -> String {
    format!("moneywise:budget:item:{}", id)
}
