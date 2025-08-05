# Learning Rust

## Table of Contents
1. [Setup & Environment](#setup--environment)
2. [Key Libraries](#key-libraries)
3. [Async + Web Framework: Tokio & Axum](#async--web-framework-tokio--axum)
4. [Environment & Tracing](#environment--tracing)
5. [Rust Core Concepts](#rust-core-concepts)
   - [Ownership & Borrowing](#ownership--borrowing)
   - [References & Dereferences](#references--dereferences)
   - [Field/Method Access (`.`)](#fieldmethod-access)
   - [Pattern Bindings (`@`)](#pattern-bindings-)
6. [Error-Handling Helpers](#error-handling-helpers)
7. [Numeric Types & Money](#numeric-types--money)
8. [Caching Strategies](#caching-strategies)
   - [Why Cache?](#why-cache)
   - [Cache-Aside Pattern](#cache-aside-pattern)
   - [In-Memory vs. Redis](#in-memory-vs-redis)
   - [Other Options & Two-Level Cache](#other-options--two-level-cache)
   - [Invalidation](#invalidation)
   - [Rust Example (moka + Redis)](#rust-example-moka--redis)
9. [LRU](#lru-least-recently-used)
   - [How It Works](#how-it-works)
   - [Why Use LRU?](#why-use-lru)
   - [Rust crates](#rust-crates)
   - [Example](#example-using-the-lru-crate)
---

## Setup & Environment
- Install Rust via `rustup`
- Use `cargo new` / `cargo init` for new projects
- Keep secrets in `.env`, load via [`dotenv`](https://crates.io/crates/dotenv)

---

## Key Libraries
- **tokio** – async runtime
- **axum** – ergonomic, modular web framework
- **tower-http** – middleware for Tower-based HTTP services
- **dotenv** – load `.env` files
- **tracing** – structured, async-aware instrumentation
- **tracing-subscriber** – subscriber implementations (fmt, filters, layers)
- **sqlx** – async SQL toolkit

---

## Async + Web Framework: Tokio & Axum
```rust
#[tokio::main]
async fn main() {
    let app = axum::Router::new()
        .route("/health", axum::routing::get(|| async { "OK" }));
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

---
## Environment & Tracing
```rust
use tracing::{info, span, Level};
use tracing_subscriber::{prelude::*, EnvFilter, fmt};

tracing_subscriber::registry()
    .with(EnvFilter::new("app=debug,tower_http=info"))
    .with(fmt::layer())
    .init();

info!("Incoming request"; "path" => path, "user_id" => user_id);
```
- Spans group related events.
- Fields are key-value data for filtering.
- Async-aware: context survives `.await`.

---
## Rust Core Concepts
### Ownership & Borrowing
- **One owner** per value; it drops when owner goes out of scope.
- **Borrow** data with references instead of cloning or moving.

### References & Dereferences
- `&x` – shared (immutable) borrow
- `&mut x` – exclusive (mutable) borrow
- `*r` – dereference pointer `r`
- You cannot mix `&mut` and `&` on the same data.

Example:

```rust
fn greet(name: &String) {
    println!("Hello, {}", name);
}

let mut s = String::from("Alice");
greet(&s);              // shared borrow, output: Hello, Alice

let r: &mut String = &mut s;
r.push_str("!");        // mutable borrow, appends "!" to the String via r
```

```rust
fn main() {
    let mut s = String::from("Alice");
    println!("before: {}", s);    // prints "before: Alice"

    {
        let r: &mut String = &mut s;
        r.push_str("!");          // appends "!" to the String via r
    } // r goes out of scope here

    println!("after:  {}", s);    // prints "after:  Alice!"
}
``

### Field/Method Access (.)
- `obj.field` – access struct field
- `obj.method(args…)` – call method (auto-deref/borrow helps)

### Pattern Bindings (`@`)
Bind entire value while matching part:

```rust
let msg = Some(42);
match msg {
  some_val @ Some(_) => println!("Got {:?}", some_val),
  None => println!("No value"),
}
```

---
## Error-Handling Helpers
On `Option<T>` / `Result<T, E>`:

- `unwrap()` / `expect("msg")` – panic on `None/Err`
- `unwrap_or(default)` / `unwrap_or_else(|| default)` – fallback
- `map(|v| …)` – transform inside `Some/Ok`
- `and_then(|v| …)` – chain another fallible op
- `ok_or(err)` / `ok_or_else(|| err)` – `Option` → `Result`

Prefer `match` or the `?` operator in production to avoid panics.

---
### Numeric Types & Money
- `f64`: fast but binary floats → rounding errors → not for money.
- `rust_decimal::Decimal` or `bigdecimal::BigDecimal`: exact decimal.
++ `rust_decimal` is Serde-friendly and common in finance.

---
## Caching Strategies
### Why Cache?
- Latency: RAM is 10–100× faster than disk/DB
- Throughput: fewer DB hits
- Cost: fewer replicas
- Spike Protection: absorb bursts

### Cache-Aside Pattern
1. Check cache for key
2. On hit: return it
3. On miss: load from DB, populate cache, return
4. On write: invalidate or update cache

### In-Memory vs. Redis
#### In-Memory (per-instance)

- Pros: ultra-low latency, no network
- Cons: not shared, lost on restart
- Crates: `moka`, `lru`, `cached`

#### Redis (distributed)

- Pros: shared, TTL, eviction
- Cons: network hop, extra ops, consistency

### Other Options & Two-Level Cache
- Memcached: simple K/V
- L1 = local cache (moka), L2 = Redis
- CDNs for public assets
- Bloom filters for known-missing keys

### Invalidation
On writes/updates/deletes:

- **Evict** cache key
- **Update** cache with new value
- Use Redis Pub/Sub for cross-node invalidation if needed

### Rust Example (moka + Redis)

```rust
use moka::future::Cache;
use redis::AsyncCommands;
use serde::{Serialize, Deserialize};
use sqlx::PgPool;

#[derive(Serialize, Deserialize, Clone)]
struct Account { id: i64, balance: rust_decimal::Decimal }

async fn get_pg_pool() -> PgPool {
    PgPool::connect(&std::env::var("DATABASE_URL").unwrap()).await.unwrap()
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let l1: Cache<i64, Account> = Cache::builder()
        .max_capacity(10_000)
        .time_to_live(std::time::Duration::from_secs(60))
        .build();

    let client = redis::Client::open("redis://127.0.0.1/")?;
    let mut conn = client.get_async_connection().await?;

    async fn get_account(
        id: i64,
        l1: &Cache<i64, Account>,
        conn: &mut redis::aio::Connection,
        pool: &PgPool
    ) -> anyhow::Result<Account> {
        if let Some(acc) = l1.get(&id) {
            return Ok(acc.clone());
        }
        if let Ok(json) = conn.get::<_, String>(format!("account:{}", id)).await {
            let acc: Account = serde_json::from_str(&json)?;
            l1.insert(id, acc.clone()).await;
            return Ok(acc);
        }
        let acc = sqlx::query_as!(
            Account, "SELECT id, balance FROM accounts WHERE id = $1", id
        )
        .fetch_one(pool).await?;
        let json = serde_json::to_string(&acc)?;
        let _: () = conn.set_ex(format!("account:{}", id), json, 60).await?;
        l1.insert(id, acc.clone()).await;
        Ok(acc)
    }

    Ok(())
}
```

---
### Next Steps and Tips
- Start with a single cache level (e.g. Redis)
- Implement cache-aside reads + explicit invalidation on writes
- Measure hit rates, latencies, memory usage
- If scaling, add L1 (moka) + L2 (Redis)
- Tune TTLs & eviction for freshness vs. performance

## LRU (Least Recently Used)

**Definition**
LRU is a cache eviction policy that discards the **least recently used** items first when the cache reaches capacity.

---

### How It Works

1. The cache maintains an ordering of entries by when they were last accessed.
2. On every **get** or **put**, the accessed entry is moved to the “most recently used” end.
3. When inserting a new entry and capacity is exceeded, the entry at the “least recently used” end is evicted.

---

### Why Use LRU?

- **Temporal Locality**
  Items accessed recently are likely to be accessed again soon.
- **Simplicity**
  Easy to implement and reason about.
- **Effectiveness**
  Performs well in many real‐world workloads (e.g., session caches, web browsers).

---

### Rust Crates

- **`lru`** (sync)
  A straightforward in‐memory LRU cache.
- **`moka`** (async + sync + thread‐safe)
  Supports LRU + TTL, high performance under concurrency.
- **`lru_time_cache`** (sync)
  LRU cache with per‐entry expiration times.

---

### Example (using the `lru` crate)

```rust
use lru::LruCache;

fn main() {
    // Create an LRU cache with capacity = 2
    let mut cache = LruCache::new(2);

    cache.put("a", 1);
    cache.put("b", 2);

    // Access "a" => now "b" is the least recently used
    assert_eq!(cache.get(&"a"), Some(&1));

    // Insert "c" => evicts "b"
    cache.put("c", 3);
    assert!(cache.get(&"b").is_none());

    println!("Cache contains: {:?}", cache);
}
```