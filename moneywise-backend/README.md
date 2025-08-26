# MoneyWise Backend

A high-performance Rust backend for the MoneyWise budget management application, designed to work with both **Supabase** (production) and **local PostgreSQL** (development).

## 🚀 Quick Start

### Option 1: Supabase (Production - Recommended)
```bash
cd moneywise-backend

# 1. Setup with Supabase
make setup-supabase

# 2. Edit .env with your Supabase credentials:
# DATABASE_URL=postgresql://postgres.[your-project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
# SUPABASE_URL=https://[your-project-ref].supabase.co
# SUPABASE_ANON_KEY=[your-anon-key]

# 3. Run setup again
make setup
```

### Option 2: Local Development
```bash
cd moneywise-backend

# 1. Setup for local development
make setup-local

# 2. Edit .env with local PostgreSQL:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise

# 3. Run setup again
make setup
```

### Option 3: Auto-Detect (Recommended)
```bash
cd moneywise-backend

# 1. Copy environment template
cp env.example .env

# 2. Edit .env with your database credentials
# 3. Run auto-detecting setup
make setup
```

## 🗄️ Database Setup

### Supabase (Production)
1. **Get your connection string** from Supabase Dashboard → Settings → Database
2. **Format**: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
3. **Environment variables**:
   ```bash
   DATABASE_URL=your_supabase_connection_string
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   ```

**💡 Pro Tip**: Use the helper script for easy setup:
```bash
# From the project root directory
./scripts/get-supabase-credentials.sh
```

### Local PostgreSQL
1. **Install PostgreSQL** (if not already installed)
2. **Create database**: `createdb moneywise`
3. **Environment variable**:
   ```bash
   DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise
   ```

## 🔧 Available Commands

```bash
# Setup (auto-detects environment)
make setup

# Environment-specific setup
make setup-supabase    # Supabase production
make setup-local       # Local development

# Database migrations
make migrate           # Auto-detects environment
make migrate-supabase  # Supabase only
make migrate-local     # Local only

# Development
make build             # Build project
make run               # Run server
make test              # Run tests
make clean             # Clean build artifacts

# Help
make help              # Show all commands
```

## 🌐 Environment Configuration

Copy `env.example` to `.env` and configure:

```bash
# Database Configuration (choose one)
# For Supabase:
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]

# For Local:
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise

# Application Settings
RUST_LOG=info
HOST=127.0.0.1
PORT=3000
```

## 🏗️ Architecture

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

## 🗄️ Database Schema

PostgreSQL schema optimized for financial data:

```sql
-- Core tables
categories          # Budget categories (Food, Transport, etc.)
category_groups     # Category groupings (Essentials, Lifestyle)
budgets            # Budget allocations per category/month

-- Features
- UUID primary keys for scalability
- Automatic updated_at timestamps
- Proper foreign key constraints
- Performance indexes
- Sample data included
```

## 🧪 Testing

```bash
# Run all tests
cargo test

# Run specific test modules
cargo test budget_item_tests
cargo test categories_tests
cargo test overview_tests
cargo test connection_tests
```

## 🚧 Current Status

**Production Ready:**
- ✅ Budget data API with caching
- ✅ Supabase integration (primary)
- ✅ Local PostgreSQL support (development)
- ✅ Redis caching with retry logic
- ✅ Comprehensive error handling
- ✅ Full test coverage

**Current Limitations:**
- 🚧 No DELETE operations (CRU operations implemented)
- 🚧 Single-user focused (no authentication)
- 🚧 Basic insights (expandable for AI features)

## 🔄 Migration Strategy

The backend now supports **hybrid deployment**:

1. **Production**: Uses Supabase (hosted, managed, scalable)
2. **Development**: Can use local PostgreSQL for offline work
3. **CI/CD**: Automatically detects and uses Supabase
4. **Migrations**: Work on both environments seamlessly

## 📚 Documentation

- **Inline code documentation** throughout
- **Environment detection** in setup scripts
- **Flexible configuration** for different deployment scenarios

## 🤝 Development Notes

This backend emphasizes:
- **Production-first**: Supabase as primary database
- **Developer experience**: Local development support
- **Performance**: Redis caching and optimized queries
- **Type Safety**: Rust's type system prevents runtime errors
- **Async/Await**: Non-blocking I/O for high performance
- **Error Handling**: Comprehensive error types with context
- **Caching Strategy**: Intelligent cache invalidation and retry logic

## 🆘 Troubleshooting

### Common Issues

**Supabase Connection Failed:**
- Check `DATABASE_URL` format in `.env`
- Verify Supabase project is active
- Check network connectivity

**Local Database Issues:**
- Ensure PostgreSQL is running: `sudo systemctl start postgresql`
- Verify database exists: `createdb moneywise`
- Check credentials in `DATABASE_URL`

**Migration Errors:**
- Run `make migrate` to auto-detect environment
- Use `make migrate-supabase` or `make migrate-local` for specific environments
- Verify database connection before running migrations

### Getting Help

1. Check the environment detection output
2. Verify your `.env` configuration
3. Run `make help` for available commands
4. Check the setup script output for specific errors