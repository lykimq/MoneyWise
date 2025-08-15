# MoneyWise Backend

A high-performance Rust API server that powers the MoneyWise personal finance app with budget data, caching, and financial insights.

## 🚀 What's Inside

**Core Features:**
- **Budget API**: REST endpoints for budget overview, categories, and insights
- **Redis Caching**: High-performance caching layer for budget data
- **PostgreSQL Database**: Robust data storage with migrations
- **Financial Precision**: Rust Decimal for exact monetary calculations
- **Smart Insights**: Budget analysis and recommendations

**Technical Stack:**
- **Framework**: Axum (async Rust web framework)
- **Database**: PostgreSQL with SQLx for type-safe queries
- **Caching**: Redis with connection pooling and retry logic
- **Architecture**: Clean modular structure with domain separation
- **Testing**: Comprehensive test suite with mocking

## 📡 Budget API

**Current Implementation:**
- ✅ **CREATE** - POST new budget entries with validation
- ✅ **READ** - GET budget data (overview, categories, insights, individual budgets)
- ✅ **UPDATE** - PUT partial updates to existing budgets
- 🚧 **DELETE** - Not implemented yet

**Future Enhancements:**
- DELETE operations for budget removal
- Bulk operations for multiple budgets
- Advanced filtering and sorting options
- Budget templates and recurring budgets

---

### Available Endpoints

### **GET /api/budgets**
Complete budget data with overview, categories, and insights.

**Query Parameters:**
- `month=12` (optional) - Filter by month (1-12), defaults to current month
- `year=2024` (optional) - Filter by year, defaults to current year
- `currency=EUR` (optional) - Currency filter

**Example Request:**
```bash
curl "http://localhost:3000/api/budgets?month=6&year=2025&currency=EUR"
```

**Response:**
```json
{
  "overview": {
    "planned": "2500.00",
    "spent": "1847.50",
    "remaining": "652.50",
    "currency": "EUR"
  },
  "categories": [
    {
      "id": "uuid-string",
      "category_name": "Groceries",
      "group_name": "Essentials",
      "category_color": "#4CAF50",
      "group_color": "#2E7D32",
      "planned": "500.00",
      "spent": "342.75",
      "remaining": "157.25",
      "percentage": "68.55",
      "currency": "EUR"
    }
  ],
  "insights": [
    {
      "type_": "warning",
      "message": "You're 15% over budget in Dining Out",
      "icon": "alert-triangle",
      "color": "#FF6B6B"
    }
  ]
}
```

### **GET /api/budgets/overview**
Lightweight budget totals only - perfect for dashboards.

**Query Parameters:** Same as above

**Example Request:**
```bash
curl "http://localhost:3000/api/budgets/overview?currency=EUR"
```

**Response:**
```json
{
  "planned": "1200.00",
  "spent": "850.50",
  "remaining": "349.50",
  "currency": "EUR"
}
```

### **POST /api/budgets**
Create a new budget entry.

**Request Body:**
```json
{
  "category_id": "uuid-string",
  "planned": "300.00",
  "currency": "EUR",
  "month": 6,
  "year": 2025
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/budgets" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": "8d0b9b6f-5cfa-43ef-9a48-6a0f7d6cfb3a",
    "planned": "300.00",
    "currency": "EUR"
  }'
```

**Response:** Complete budget object with generated ID and timestamps

### **PUT /api/budgets/:id**
Update an existing budget (partial updates supported).

**Request Body:**
```json
{
  "planned": "350.00",
  "carryover": "25.00"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/budgets/uuid-string" \
  -H "Content-Type: application/json" \
  -d '{"planned": "350.00"}'
```

### **GET /api/budgets/:id**
Get a specific budget by ID.

**Example Request:**
```bash
curl "http://localhost:3000/api/budgets/8d0b9b6f-5cfa-43ef-9a48-6a0f7d6cfb3a"
```

**Response:** Single budget object with all fields

## 🛠 Quick Start

### Prerequisites
- Rust (latest stable)
- PostgreSQL 12+
- Redis (optional but recommended)

### Setup
```bash
cd moneywise-backend

# 1. Environment setup
echo 'DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise' > .env
echo 'RUST_LOG=info' >> .env

# 2. Database setup
make install-sqlx
sqlx database create || true
make migrate

# 3. Start Redis (optional)
make start-redis

# 4. Run the server
make run
```

Server runs at `http://localhost:3000` with API at `/api/*`

### Development Commands
```bash
make build     # Build the project
make test      # Run all tests
make dev       # Start Redis + run server
make migrate   # Run database migrations
```

## 🧪 Testing

Comprehensive test suite covering caching, database operations, and API logic:

```bash
# Run all tests
cargo test

# Run specific test modules
cargo test budget_item_tests
cargo test categories_tests
cargo test overview_tests
cargo test connection_tests
```

**Test Structure:**
- `tests/` - Integration tests for all major components
- `tests/common/` - Shared test utilities and mocks
- Covers caching, database queries, and API endpoints
- Mock Redis and database connections for isolated testing

## 📁 Code Architecture

```
src/
├── api/                # HTTP endpoints and handlers
│   └── budget.rs       # Budget API routes and logic
├── cache/              # Redis caching system
│   ├── core/           # Cache operations, retry logic, serialization
│   └── domains/        # Domain-specific cache keys and logic
├── database/           # Database connection and queries
├── server/             # Server configuration and setup
├── connections.rs      # Initialize DB and Redis connections
├── models.rs          # Data structures and serialization
├── error.rs           # Centralized error handling
└── main.rs            # Application entry point
```

**Key Design Principles:**
- **Domain Separation**: Budget logic isolated in dedicated modules
- **Type Safety**: Rust's type system prevents runtime errors
- **Async/Await**: Non-blocking I/O for high performance
- **Error Handling**: Comprehensive error types with context
- **Caching Strategy**: Intelligent cache invalidation and retry logic

## 🗄️ Database Schema

PostgreSQL schema optimized for financial data:

```sql
-- Core tables
categories          # Budget categories (Food, Transport, etc.)
category_groups     # Category groupings (Essentials, Lifestyle)
budgets            # Budget allocations per category/month
transactions       # Income and expense records

-- Localization
languages          # Supported languages
translations       # Multi-language text
user_preferences   # User settings and preferences

-- Future features
savings_goals      # Financial goals (placeholder)
```

## 🔧 Configuration

**Environment Variables:**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/moneywise
REDIS_URL=redis://localhost:6379    # Optional
RUST_LOG=info                       # Logging level
```

**Features:**
- **Connection Pooling**: Efficient database and Redis connections
- **CORS**: Configured for React Native app integration
- **Logging**: Structured logging with tracing
- **Error Recovery**: Automatic retry logic for cache operations

## 🚧 Current Status

**Production Ready:**
- ✅ Budget data API with caching
- ✅ PostgreSQL integration with migrations
- ✅ Redis caching with retry logic
- ✅ Comprehensive error handling
- ✅ Full test coverage

**Current Limitations:**
- 🚧 No DELETE operations (CRU operations implemented)
- 🚧 Single-user focused (no authentication)
- 🚧 Basic insights (expandable for AI features)

## 📚 Documentation

- Extensive inline code documentation throughout

## 🤝 Development Notes

This backend emphasizes:
- **Performance**: Redis caching and optimized queries
- **Reliability**: Comprehensive error handling and testing
- **Maintainability**: Clean architecture and extensive documentation
- **Type Safety**: Leveraging Rust's type system for correctness
- **Financial Accuracy**: Rust Decimal for precise monetary calculations