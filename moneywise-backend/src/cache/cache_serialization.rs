// JSON serialization utilities for cache data
// Provides consistent serialization/deserialization for Redis storage

use serde_json;
use tracing::{error, warn};

use crate::error::{AppError, Result};

/// Serializes data to JSON for Redis storage
/// Returns serialized JSON string or error
pub fn serialize<T: serde::Serialize>(data: &T) -> Result<String> {
    serde_json::to_string(data).map_err(|e| {
        error!("Failed to serialize data for cache: {}", e);
        AppError::Internal(format!("Cache serialization failed: {}", e))
    })
}

/// Deserializes data from JSON stored in Redis
/// Returns deserialized data or None on corruption
pub fn deserialize<T: serde::de::DeserializeOwned>(json: String) -> Result<Option<T>> {
    match serde_json::from_str::<T>(&json) {
        Ok(data) => Ok(Some(data)),
        Err(e) => {
            warn!("Failed to deserialize cached data: {}", e);
            Ok(None) // Return None instead of error for graceful degradation
        }
    }
}
