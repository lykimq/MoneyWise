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
```

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
  - `rust_decimal` is Serde-friendly and common in finance.

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

#### K/V (Key–Value) Store
- A Key–Value store is the simplest form of database: you “put” a value under a unique key and later “get” that value by key.
- Examples:
  - Memcached – purely in‐memory, very fast, no persistence, used as a cache layer.
  - Redis – also in‐memory (with optional persistence), richer data types (lists, sets, hashes), used as L2 cache or lightweight datastore.
- In your stack:
  - L1 = a local in‐process cache (e.g. Moka for JVM apps) to avoid any network hop.
  - L2 = Redis (remote) to share cached entries across multiple app instances.

#### CDN (Content Delivery Network)
- A CDN is a geographically distributed network of proxy servers and their data centers.
- It caches and serves static (and sometimes dynamic) assets—images, JavaScript/CSS, videos—closer to end users to reduce latency and offload your origin servers.
- Common CDNs: Cloudflare, Akamai, Fastly, AWS CloudFront.

#### Bloom Filter
- A Bloom filter is a probabilistic, space-efficient data structure for testing set membership.
- You can ask “Is key X definitely not present?” or “Might key X be present?”
  - If it says “no,” you’re 100% certain X isn’t in your set (no false negatives).
  - If it says “yes,” X is probably in the set, but there’s a tunable chance of a false positive.
- Use case in caching:
  - Before hitting Redis (or backing store) for a key, check the Bloom filter.
  - If the filter says “definitely not,” you skip the cache/database lookup entirely.
  - If it says “maybe,” you go ahead and query Redis or the DB.

#### JVM (Java Virtual Machine)
- A process-level runtime that executes Java bytecode (and bytecode from other JVM-compatible languages, e.g. Kotlin, Scala).
- It provides services like:
  - Just-In-Time (JIT) compilation of bytecode into native machine code
  - Automatic memory management (the garbage collector)
  - A stable, platform-independent execution environment—write your code once, run it anywhere there’s a JVM

#### Network hop
- Each time a packet travels from one network device (router, switch, gateway) to the next on its way from source to destination, that counts as one “hop.”
- The more hops in a route, generally the higher the end-to-end latency—and the more potential points of failure or congestion.
- Tools like traceroute report the sequence of hops (and round-trip time to each) so you can see how your traffic traverses the internet.
`
### Invalidation
On writes/updates/deletes:

- **Evict** cache key
- **Update** cache with new value
- Use Redis Pub/Sub for cross-node invalidation if needed

#### Evict cache key

Evicting a cache key simply means removing that key (and its value) from your cache so that subsequent reads will miss and fall back to the “source of truth” (e.g. database or origin service). You can trigger eviction for several reasons:

1. Automatic eviction
- Capacity-based (LRU, LFU, FIFO, size-bound): when the cache reaches its max size, the policy kicks out “old” entries.
- Time-based (TTL/expire): entries live only for a configured duration; after that they’re evicted.

##### a. LRU (Least Recently Used)

- Tracks the last‐access time of each entry.
- When the cache is full, it drops the entry that hasn’t been read or written for the longest time.
- Good for workloads where “hot” items tend to be reused soon.

##### b. LFU (Least Frequently Used)

- Counts how often each entry is accessed.
- When capacity is exceeded, it evicts the entry with the lowest usage count.
- Favours items with consistently high access rates, but may “lock in” stale hot items if you don’t age counts.

##### c. FIFO (First In, First Out)

- Maintains a queue of entries in insertion order.
- On eviction, it removes the oldest‐inserted entry regardless of access frequency or recency.
- Very simple, but can evict items that are still “hot.”

##### d. Size‐bound (weight‐based)

- Instead of counting entries, you weight them by size (e.g. in bytes, or custom cost).
- The cache enforces a maximum total weight; when exceeded, it evicts according to a chosen policy (often LRU by weight).
- Useful when entries vary greatly in memory footprint.

All of these kick in only when your cache reaches its maximum configured capacity. You choose a policy based on your access patterns and freshness requirements.

2. Manual eviction (explicit invalidation)
- You know the underlying data has changed (e.g. a user updated their profile), so you invalidate the old cache entry.


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
