//! Async-safe mock Redis: TTL + LRU eviction.

use std::collections::{HashMap, VecDeque};
use std::sync::Arc;
use std::time::{Duration, Instant};

use tokio::sync::Mutex;

/// Represents a single cached value with an optional absolute expiration.
/// Why: separates storage from policy; mirrors Redis value + TTL semantics for tests.
#[derive(Debug, Clone)]
pub struct CacheEntry {
    pub value: String,
    pub expiration: Option<Instant>,
}

/// Simplified eviction policy for the mock. We model AllKeys-LRU.
/// Why: keeps behavior predictable for unit tests while capturing the most common production policy.
#[derive(Debug, Clone, Copy)]
pub enum EvictionPolicy {
    AllKeysLru,
}

/// A simple, async-safe mock of Redis with TTL + LRU eviction.
///
/// Why `Arc<Mutex<...>>`?
/// - Tests are async and may call the mock across `.await` points; interior
///   mutability with `Mutex` keeps state consistent.
/// - We clone the mock into helpers and tests; `Arc` allows cheap cloning
///   while sharing the same underlying store/LRU/memory counters.
/// - Mirrors concurrency guarantees used in the real service without
///   introducing a full actor runtime.
#[derive(Clone)]
pub struct MockRedis {
    /// Backing key-value storage shared across clones.
    pub store: Arc<Mutex<HashMap<String, CacheEntry>>>,
    /// Tracks usage order for LRU eviction.
    pub lru_queue: Arc<Mutex<VecDeque<String>>>,
    pub max_memory: usize, // bytes
    /// Approximate memory accounting (key + value lengths) shared across clones.
    pub current_memory: Arc<Mutex<usize>>, // bytes
    pub eviction_policy: EvictionPolicy,
}

impl MockRedis {
    /// Create a mock instance with a memory budget and eviction policy.
    /// Impact: enables deterministic eviction behavior in tests without a live Redis.
    pub fn new(max_memory: usize, eviction_policy: EvictionPolicy) -> Self {
        Self {
            store: Arc::new(Mutex::new(HashMap::new())),
            lru_queue: Arc::new(Mutex::new(VecDeque::new())),
            max_memory,
            current_memory: Arc::new(Mutex::new(0)),
            eviction_policy,
        }
    }

    /// Set a key with optional TTL. Updates LRU and memory counters.
    pub async fn set(&self, key: String, value: String, ex: Option<Duration>) {
        let size = key.len() + value.len();
        self.evict_if_needed(size).await;

        // calculate expiration
        let expiration = ex.map(|d| Instant::now() + d);
        {
            // lock store and current_memory before updating them
            let mut store = self.store.lock().await;
            let mut current = self.current_memory.lock().await;

            // remove old value from current memory
            if let Some(entry) = store.get(&key) {
                // adjust for old value
                *current -= entry.value.len();
            }

            // insert new value
            store.insert(key.clone(), CacheEntry { value: value.clone(), expiration });

            // update current memory
            *current += size;
        }

        // lock lru_queue before updating it
        let mut lru = self.lru_queue.lock().await;

        // remove old key from lru_queue
        lru.retain(|k| k != &key);

        // add new key to lru_queue
        lru.push_back(key);
    }

    /// Get a key, respecting TTL and touching LRU order. Returns None if expired/missing.
    pub async fn get(&self, key: &str) -> Option<String> {
        // check expiry
        let expired = {
            // lock store before checking expiration
            let store = self.store.lock().await;

            // check if key is expired
            if let Some(entry) = store.get(key) {
                // check if key is expired
                if let Some(exp) = entry.expiration {
                    Instant::now() > exp
                } else { false }
            } else { return None; }
        };

        // delete expired key
        if expired {
            self.delete(key).await;
            return None;
        }

        // update LRU and return value
        {
            // lock lru_queue before updating it
            let mut lru = self.lru_queue.lock().await;

            // remove old key from lru_queue
            lru.retain(|k| k != key);

            // add new key to lru_queue
            lru.push_back(key.to_string());
        }

        // lock store before getting value
        let store = self.store.lock().await;

        // return value
        store.get(key).map(|e| e.value.clone())
    }

    /// Delete a key and update memory accounting and LRU queue.
    pub async fn delete(&self, key: &str) {
        let mut removed_size = 0usize;
        {
            // lock store before getting value
            let mut store = self.store.lock().await;

            // remove key from store
            if let Some(entry) = store.remove(key) {
                removed_size = key.len() + entry.value.len();
            }
        }

        // update current memory
        if removed_size > 0 {
            // lock current_memory before updating it
            let mut current = self.current_memory.lock().await;

            // update current memory
            *current = current.saturating_sub(removed_size);
        }

        // lock lru_queue before updating it
        let mut lru = self.lru_queue.lock().await;

        // remove the key from the lru_queue
        lru.retain(|k| k != key);
    }

    /// Evict least-recently-used keys until enough memory is available for an insertion.
    pub async fn evict_if_needed(&self, size_needed: usize) {
        loop {
            // lock current_memory before getting value
            let cur = { *self.current_memory.lock().await };

            // check if we have enough memory
            if cur + size_needed <= self.max_memory { break; }

            // evict the oldest key
            match self.eviction_policy {
                EvictionPolicy::AllKeysLru => {
                    // lock lru_queue before popping the oldest key
                    let oldest = { self.lru_queue.lock().await.pop_front() };

                    // delete the oldest key
                    if let Some(k) = oldest { self.delete(&k).await; } else { break; }
                }
            }
        }
    }
}


