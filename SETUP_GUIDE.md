# MoneyWise Setup Guide

Get MoneyWise running in minutes with this streamlined setup guide. Designed for developers who want to get started quickly without getting bogged down in technical details.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites Check
Ensure you have these installed:
- **Rust** - [rustup.rs](https://rustup.rs/)
- **Node.js 18+** - [nodejs.org](https://nodejs.org/)
- **PostgreSQL 12+** - [postgresql.org/download/](https://postgresql.org/download/)
- **Redis** (optional) - [redis.io/download/](https://redis.io/download/)

### 2. Clone & Setup
```bash
git clone <repository-url>
cd MoneyWise

# One-command setup for entire project
./setup.sh

# The script will:
# ✅ Check all prerequisites
# ✅ Setup backend (database, migrations, server)
# ✅ Setup frontend (dependencies)
# ✅ Start backend server
# ✅ Provide clear next steps
```

That's it! The setup script handles everything automatically.

---

## 🔧 What the Setup Scripts Do

### **Root Setup Script** (`./setup.sh`)
- ✅ **Orchestrates** both backend and frontend setup
- ✅ **Verifies** project structure and prerequisites
- ✅ **Runs** backend setup script automatically
- ✅ **Installs** frontend dependencies
- ✅ **Provides** clear summary and next steps

### **Backend Setup Script** (`moneywise-backend/setup.sh`)
- ✅ **Starts** PostgreSQL and Redis services automatically
- ✅ **Creates** database and environment files
- ✅ **Installs** SQLx CLI and runs migrations
- ✅ **Loads** sample data (real production data)
- ✅ **Starts** the backend server
- ✅ **Tests** API endpoints for verification

### **Modular Setup Utilities** (`scripts/`)
- ✅ **Core Utilities** (`core/`) - Shared functionality and orchestration
  - `setup-utils.sh` - Main orchestrator that coordinates all modules
  - `output-utils.sh` - Colors, formatting, and user experience
- ✅ **Setup Management** (`setup/`) - Environment and service setup
  - `prereq-checker.sh` - Tool verification and validation
  - `service-manager.sh` - PostgreSQL, Redis service management
  - `env-manager.sh` - .env file creation and management
  - `get-supabase-credentials.sh` - Supabase credentials retrieval
- ✅ **Database Operations** (`database/`) - Database management and operations
  - `database-utils.sh` - Main orchestrator for database operations
  - `db-operations.sh` - Core database operations
  - `schema-manager.sh` - Database schema verification
- ✅ **Testing & Validation** (`testing/`) - Setup verification and testing
  - `run-all-tests.sh` - Comprehensive test suite
  - `test-database-connection.sh` - Database connectivity tests
  - `test-setup-scripts.sh` - Setup script validation
- ✅ **Quick Check** (`quick-check.sh`) - Fast status overview (main script)

**Sample Data Included:**
- 5 budget categories (Housing, Utilities, Transportation, Food, Entertainment)
- Real budget data for December 2024 & August 2025
- USD currency with realistic spending patterns

**Scripts Organization Benefits:**
- **Logical Grouping**: Scripts organized by function for easier maintenance
- **Clear Purpose**: Each subdirectory has a specific responsibility
- **Easy Navigation**: Quickly find the right script for your needs
- **Scalable Structure**: Simple to add new scripts to appropriate categories

---

## 🌐 Access Points

Once running:
- **Backend API**: http://localhost:3000/api
- **Frontend App**: Expo development server (QR code in terminal)
- **API Test**: `curl http://localhost:3000/api/budgets/overview`

---

## 🛠 Manual Setup (if needed)

### Backend
```bash
cd moneywise-backend

# Start services
sudo systemctl start postgresql  # Ubuntu/Debian
brew services start postgresql    # macOS

# Environment & database
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise" > .env
createdb moneywise
cargo install sqlx-cli --no-default-features --features postgres
sqlx migrate run
cargo run
```

### Database Operations
```bash
# Run migrations
make migrate

# Build production database script
make build-db

# View available commands
make help
```

### Frontend
```bash
cd moneywise-app
npm install
npm start
```

---

## 🔧 Configuration

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/moneywise
RUST_LOG=info
HOST=127.0.0.1
PORT=3000
REDIS_URL=redis://localhost:6379  # Optional
```

### Frontend API
Edit `moneywise-app/src/services/api.ts` to change backend URL.

---

## 🧪 Testing

```bash
# Backend tests
cd moneywise-backend && cargo test

# Frontend tests
cd moneywise-app && npm test

# Setup validation
./scripts/quick-check.sh                    # Quick status check
./scripts/testing/run-all-tests.sh          # Comprehensive validation
./scripts/testing/test-setup-scripts.sh     # Setup script validation
```

---

## 🚨 Troubleshooting

### Common Issues
- **PostgreSQL not running**: `sudo systemctl start postgresql`
- **Port 3000 busy**: Change PORT in .env file
- **Database errors**: Run `sqlx migrate run` again
- **Frontend connection**: Ensure backend is running on correct port

### Reset Everything
```bash
cd moneywise-backend
dropdb moneywise
createdb moneywise
sqlx migrate run
```

---

## 📁 Project Structure
```
MoneyWise/
├── verify.sh                  # 🆕 Root-level verify script
├── scripts/                   # 🆕 Modular setup utilities
│   ├── core/                  # Core utility modules
│   │   ├── setup-utils.sh     # Main orchestrator
│   │   └── output-utils.sh    # Colors & formatting
│   ├── setup/                  # Setup and environment management
│   │   ├── prereq-checker.sh  # Tool verification
│   │   ├── service-manager.sh # Service management
│   │   ├── env-manager.sh     # Environment management
│   │   └── get-supabase-credentials.sh # Credentials retrieval
│   ├── database/               # Database-related scripts
│   │   ├── database-utils.sh  # Database orchestrator
│   │   ├── db-operations.sh   # Database operations
│   │   └── schema-manager.sh  # Schema management
│   ├── testing/                # Testing and validation scripts
│   │   ├── run-all-tests.sh   # Comprehensive test suite
│   │   ├── test-database-connection.sh # Database connectivity tests
│   │   └── test-setup-scripts.sh # Setup script validation
│   └── quick-check.sh          # Quick status check (main script)
├── moneywise-backend/          # Rust API server
│   ├── setup.sh               # Backend setup
│   ├── migrations/            # Database schema
│   ├── database/              # 🆕 Modular database structure
│   │   ├── schema/            # Schema definitions
│   │   ├── migrations/        # Development migrations
│   │   ├── deploy/            # Production scripts
│   │   └── build-deploy.sh    # Build script
│   └── src/                   # Source code
└── moneywise-app/             # React Native app
    ├── src/                   # App source
    └── package.json           # Dependencies
```

### **Scripts Organization Benefits**
- **`core/`** - Shared utilities used by all other scripts
- **`setup/`** - Environment setup and service management
- **`database/`** - Database operations and schema management
- **`testing/`** - Validation and testing scripts
- **`quick-check.sh`** - Main script for daily status checks

---

## 🎯 What You Get

**Backend:**
- Full REST API for budget management
- PostgreSQL with real sample data
- Redis caching (optional)
- Comprehensive error handling
- Modular database structure with auto-generated production scripts

**Frontend:**
- Budget overview with insights
- Category-wise tracking
- Time period selection
- AI-generated recommendations

**Database Features:**
- Modular schema design for easy maintenance
- Auto-generated production deployment scripts
- Support for both Supabase and local PostgreSQL
- Comprehensive sample data for testing

---

## 🚀 Next Steps

1. **Explore the app** - Navigate through budget categories
2. **Test the API** - Use curl or Postman on the endpoints
3. **Check the code** - Review the architecture in individual READMEs
4. **Run tests** - Ensure everything works as expected
5. **Database operations** - Use `make build-db` to generate production scripts

## 🔧 Available Make Commands

The backend now includes simplified Make commands:

```bash
cd moneywise-backend

# Setup commands
make setup              # Auto-detect environment and setup
make setup-local        # Setup for local PostgreSQL
make setup-supabase     # Setup for Supabase

# Database commands
make migrate            # Run database migrations
make build-db           # Build production database script

# Development commands
make build              # Build the project
make run                # Run the server
make test               # Run tests
make clean              # Clean build artifacts
make help               # Show all commands
```

The setup is designed to get you productive immediately. All technical complexity is abstracted away, so you can focus on building features rather than fighting with configuration.
