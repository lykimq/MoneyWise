# Learning Rust


## Libraries

- `tokio-rs/axum`: is a web application framework that focuses on ergonomics and modularity.
- `tower-http`: Tower middleware and utilities for HTTP clients and servers.
- `tokio`: an async runtime for Rust.
- `dotenv`: loads environment variables from a `.env` file.
- `tracing`: is a framework for instrumenting Rust programs to collect structured, event-based diagnostic information. `tracing` is maintained by the Tokio project, but does not require the `tokio` runtime to be used. The `Subscriber` trait represents the functionality necessary to collect this trace data. This crate contains tools for composing subscribers out of smaller units of behaviour, and batteries-included implementations of common subscriber functionality.
- `tracing-subscriber`: is intended for use by both `Subscriber` authors and application authors using `tracing` to instrument their applications.

## Tracing
Traditional loggin (e.g., `printn!`, `log`) is flat and string-based, which becomes limiting in complex, asynchronous, or concurrent systems (like web servers, async tasks, or microservices). `tracing` addresses these limitations with:
- Structured Logging: Instead of writing flat strings, we can log **key-value pairs**, enabling better filtering and analysis.
- Contextual Span-Based Tracing:
`tracing` introduces **spans**, which represent logical operations or scopes (like a function or requires lifecycle). This gives us a hierarchy of what's happening and when.
- Asynchronous-Aware: Unlike some traditional logging approaches, `tracing` is built with the **async/await** in mind, preserving context even across `.await` points.
- High Performance: `tracing` is designed for a **low overhead**, especially when logging is disabled at runtime, thanks to compile-time filtering.

## `tracing-subscriber`
This is the subscriber implementation, which determines **what happens to the data** we collect with `tracing`.

It provides:
- `FmtSubscriber`: logs to stdout/stderr (with formatting)
- `EnvFilter`: filter logs by level or target (like `RUST_LOG`)
- Layers: modular support for filtering, formatting, storing, etc.


## Some understand about the way to write function in Rust
### Understand `.with(...)`

```rust
tracing_subscriber::registry()
    .with(...) // add EnvFilter
    .with(...) // add fmt layer
    .init(); // finalize and activate
```
This is **builder pattern + method chaining**.

Each `.with(...)` is a method call on the return value of the previous call, and each one returns something that also supports `.with(...)` again - very common in Rust for configuration code.

In Rust, **method calls are made using dot notation** on values.

Here's a step-by-step version with types added

```rust
let registry = tracing_subscriber::registry();

let with_env_filter = registry.with(EnvFilter::new(...));

let with_fmt_layer = with_env_filter.with(fmt::layer());

with_fmt_layer.init();
```

### Understand `.unwrap`
In Rust `.unwrap`, `.unwrap_or`, `.unwrap_or_else` and similar methods are commonly used on `Option<T>` and `Result<T, E>` types to extract their contents.

- `Option<T>`: represents an optional value:
++ `Some(T)` means there is a value.
++ `None` means there is no value.

- `Result<T, E>` represents a value that may be an error:
++ `Ok(T)` means it is successful.
++ `Err(E)` means an error occurred.

1. `unwrap()`
For `Option<T>`

```rust
let name = Some("Alice");
let result = name.unwrap(); //Alice
```
- If it is `Some`, returns the value.
- If it is `None`, panics.

For `Result<T, E>`

```rust
let result: Result<i32, &str> = Ok(10);
let value = result.unwrap(); //10
```
- If it is `Ok`, returns the value.
- If it is `Err`, panics with the error message.

Use iwth caution: Use `.unwrap()` only when we are sure the value is `Some` or `Ok`.

2. `unwrap_or(default)`
For `Option<T>`

```rust
let name : Option<&str> = None;
let result = name.unwrap_or("Default"); // Default
```
- If it is `Some`, returns the value.
- If it is `None`, returns the provided default.

For `Result<T, E>`

```rust
let result: Result<i32, &str> = Err("oops");
let value = result.unwrap_or(0); // 0
```

Good for fallback: Use when we have a sensible default to use if the value is missing.

3. `unwrap_or_else(closure)`
This is like `.unwrap_or`, but instead of passing a value directly, we provide a **closure** (a function or lambda) that returns the default value.

For `Option<T>`

```rust
let name: Option<String> = None;
let result = name.unwrap_or_else (|| "Generated".to_string()); // "Generated"
```

For `Result<T, E>`

```rust
let result: Result<i32, &str> = Err ("error");
let value = result.unwrap_or_else(|e| {
    println!("Handling error: {}", e);
    42
})
```

Use when the fallback is expensive or requires logic:
- `unwrap_or("Default".to_string())`: creates a String every time, even if not used.
- `unwrap_or_else(|| "Default".to_string())`: creates only if needed.


### Understand `.expect(msg)`
Like `.unwrap()`, but with a custom panic message

For `Option<T>`

```rust
let name = Some ("Alice");
let value = name.expect("Expected a name"); // returns "Alice"

let name : Option<&str> = None;
let value = name.expect("No name provided"); // panic with : "thread panicked at 'No name provided'
```

For `Result<T, E>`

```rust
let result : Result<i32, &str> = Err("bad data");
let value = result.expect("Failed to parse");
// panics with: "Failed to parse: bad data"
```

Use when we are sure the value exists and want a helpful error if it doesn't

### Understand `.map()`
Transform the value inside `Option` or `Result`

For `Option<T>`

```rust
let name = Some("Alice")
let upper = name.map(|s| s.to_uppercase());; Some("ALICE")
```

For `Result<T, E>`

```rust
let result: Result<i32, &str> = Ok(10);
let doubled = result.map(|x| x * 2); // 20
```

Think: if it is `Some` or `Ok`, apply a function to the value

`.map_err(f)` - For `Result<T, E>`

```rust
let result: Result<i32, &str> = Err("bad input");
let mapped = result.map_err (|e| format!("Error: {}", e));

// Result<i32, String> = Err("Error: bad input")
```


### Understand `.and_then()`
Chain operations that may also fail

This is like `.map()`, but the function returns another `Option` or `Result`

For `Option<T>`

```rust
fn to_number(s: &str) -> Option<i32> {
    s.parse().ok()
}

let maybe_str = Some("42");
let number = maybe_str.and_then(to_number); // Some(42)
```

For `Result<T, E>`

```rust
fn div(x: i32) -> Result<i32, &'static str> {
    if x == 0 {
        Err("div by zero")
    } else {
        Ok (100/x)
    }
}

let result = Ok(10);
let outcome = result.and_then(div); // Ok(10)
```

Think: Chain another fallible operation if the first one succeeded.

### Why avoid `.unwrap()`

Using `.unwrap()` is fine in quick scripts, tests, or prototyping - but it is risky in production:

```rust
let input : Option<String> = get_user_input();
let name = input.unwrap(); // might panic if input is None
```

Better pattern: use `match` or `if let`:

```rust
match input {
    Some(name) => println!("Hello, {name}!"),
    None => println!("No name provided."),
}
```

or

```rust
if let Some(name) = input {
    println!("Hello, {name}!");
} else {
    println!("No name provided.");
}
```

### Understand `.ok_or()`, `.ok_or_else()`

Convert `Option` to `Result`

```rust
let maybe_val: Option<i32> = Some(10);
let result = maybe_val.ok_or("Value was missing"); // Result<i32, &str>

# or
let maybe_val: Option<i32> = None;
let result = maybe_val.ok_or_else(|| "Generated error"); // Err("Generated error")
```

Note: `_else` methods are for situations where:
- You want to run logic or logging in error cases
- Creating a fallback is expensive (as it is only if needed)
- You want to dynamically generate the default or error

### Understand Module `std::env`
This module contains functions to inspect various aspects such as environment variables, process arguments, the current directory, and varioud other important directories.

- Function `var`: fetches the environment variable `key` from the current process.

Return `VarError::NotPresent` if
- The variable is not set.
- The variable's name contains an equal sign or NUL (`=`, `\0`).

Returns `VarError::NotUnicode` if the variable's value is not valid Unicode. If this is not desired, consider using `var_os`.

Use `env!` or `option_env!` instead if you want to check environment variables at compile time.

```rust
use std::env;

let key = "HOME"
match env::var (key){
    Ok(val) => println!("{key}: {val?}"),
    Err(e) => println!("couldn't interpret {key}: {e}")
}
```

### Understand `f64` and `BigDecimal`

1. `f64` (64-bit floating point):
- Fast arithmetic operations
- Built-in support for Rust
- Precision issues: Cannot represent decimal fractions exactly (e.g., 0.1 + 0.2 <> 0.3)
- Not suitable for money: Can lead to rounding errors that compound over time.

`f64` is a 64-bit IEEE756 floating point number. Like in many other programming languages, it cannot precisely represent  most decimal fractions, because:
- It stores numbers in **binary**, not decimal.
- Some decimal fractions (like `0.1` or `0.2`) do not have an exact binary representation - `just like `1/3` cannot be exactly represented in base-10 (`0.3333...` forever)

2. BigDecimal:
- Arbitrary precision decimal arithmetic
- Exact decimal representation
- Perfect for money: No rounding errors, exact calculations
- Slightly slower than `f64` but essential for financial applications.

It stores numbers as:
- A `BigInt` for digits
- A scale (power of 10)

3. When to Use Which?
- Use `f64` when performance matters and tiny rounding errors are acceptable.
- Use `BigDecimal` when you need **exact decimal math**, like financial or currency calculations.

4. `BigDecimal` does not implement `Copy` (unlike `f64` which does)
So we cannot move from behind a shared reference. It is expensive to copy, so Rust requires explicit `.clone()` to avoid accidental expensive operations.
- Rust's ownership system: Prevents moving from borrowed data to maintain memory safety.
The `.clone()` creates a new `BigDecimal` instance, allowing the subtraction to work while preserving the borrowing reference.

5. Notes
- `sqlx::types::BigDecimal` does not implement `Serialize/Deserialize` traits
- `bigdecimal::BigDecimal` does implement these traits, but has different arithmetic operations.
- When both are in scope, Rust cannot distinguish between them

Solution we can convert to `String`.
- No serialization issues - `String` implements `Serialize/Deserialize`
- Precision preserved - String representation maintains exact decimal values
- Simple conversion - `BigDecimal.to_string()` and `BigDecimal::from_str()`
- No version conflicts - Only one BigDecimal type needed.

Another Solutions:
a. Use `rust_decimal` (best practice)
- Built specifically for financial calculations
- Implements `Serialize/Deserialize` natively
- Better performance than BigDecimal
- Industry standard for money handling

b. Build Custom Serde Implementation

```rust
use serde::{Deserialize, Deseralizer, Serialize, Serializer};

#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetApi{
    #[serde(serialize_with = "serialize_bigdecimal")]
    #[serde(deserialize_with = "deserialize_bigdecimal")]
    pub planned: BigDecimal,
}

fn serialize_bigdecimal<S>(value: &BigDecimal, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
    {
        value.to_string().serialize(serializer)
    }

fn deserialize_bigdecimal<'de, D>(deserializer: D) -> Result<BigDecimal, D::Error>
where
    D: DSerializer<'de>,
    {
        let s = String::deserializer(deserializer)?;
        BigDecimal::from_strin(&s).map_err(serde::de::Error::custom)
    }
```