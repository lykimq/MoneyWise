// Cache key management for MoneyWise backend
// Provides consistent key generation for different cache types

/// Generates cache key for budget overview data with namespace prefix
/// Key format: "moneywise:overview:{month}:{year}"
pub fn overview_key(month: &str, year: &str) -> String {
    format!("moneywise:overview:{}:{}", month, year)
}

/// Generates cache key for category budget data with namespace prefix
/// Key format: "moneywise:categories:{month}:{year}"
pub fn categories_key(month: &str, year: &str) -> String {
    format!("moneywise:categories:{}:{}", month, year)
}

/// Generates cache key for individual budget data with namespace prefix
/// Key format: "moneywise:budget:{id}"
pub fn budget_key(id: &str) -> String {
    format!("moneywise:budget:{}", id)
}
