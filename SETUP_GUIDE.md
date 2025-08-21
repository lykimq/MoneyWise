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
- ✅ **Output Utilities** (`output-utils.sh`) - Colors, formatting, user experience
- ✅ **Prerequisites Checker** (`prereq-checker.sh`) - Tool verification and validation
- ✅ **Service Manager** (`service-manager.sh`) - PostgreSQL, Redis service management
- ✅ **Database Utilities** (`database-utils.sh`) - **Main orchestrator** for database operations
- ✅ **Environment Manager** (`env-manager.sh`) - **NEW!** .env file creation and management
- ✅ **Database Operations** (`db-operations.sh`) - **NEW!** Core database operations
- ✅ **Schema Manager** (`schema-manager.sh`) - **NEW!** Database schema verification
- ✅ **Main Orchestrator** (`setup-utils.sh`) - Coordinates all modules and provides unified interface

**Sample Data Included:**
- 5 budget categories (Housing, Utilities, Transportation, Food, Entertainment)
- Real budget data for December 2024 & August 2025
- USD currency with realistic spending patterns

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
├── setup.sh                    # 🆕 Root-level setup script
├── scripts/                    # 🆕 Modular setup utilities
│   ├── setup-utils.sh         # Main orchestrator
│   ├── output-utils.sh        # Colors & formatting
│   ├── prereq-checker.sh      # Tool verification
│   ├── service-manager.sh     # Service management
│   ├── database-utils.sh      # 🆕 Database orchestrator
│   ├── env-manager.sh         # 🆕 Environment management
│   ├── db-operations.sh       # 🆕 Database operations
│   └── schema-manager.sh      # 🆕 Schema management
├── moneywise-backend/          # Rust API server
│   ├── setup.sh               # Backend setup
│   ├── migrations/            # Database schema
│   └── src/                   # Source code
└── moneywise-app/             # React Native app
    ├── src/                   # App source
    └── package.json           # Dependencies
```

---

## 🎯 What You Get

**Backend:**
- Full REST API for budget management
- PostgreSQL with real sample data
- Redis caching (optional)
- Comprehensive error handling

**Frontend:**
- Budget overview with insights
- Category-wise tracking
- Time period selection
- AI-generated recommendations

---

## 🚀 Next Steps

1. **Explore the app** - Navigate through budget categories
2. **Test the API** - Use curl or Postman on the endpoints
3. **Check the code** - Review the architecture in individual READMEs
4. **Run tests** - Ensure everything works as expected

The setup is designed to get you productive immediately. All technical complexity is abstracted away, so you can focus on building features rather than fighting with configuration.

---

## 📚 Educational Notes

### **Why This Setup Approach?**

**🔄 Automation First**: The setup scripts eliminate manual configuration steps that often cause errors.

**🛡️ Fail-Fast**: Scripts check prerequisites first and exit early if something is missing.

**🌍 Cross-Platform**: Service management handles different OS environments (Linux/macOS).

**✅ Verification**: Each step is verified before proceeding to the next.

**🎯 User Experience**: Clear progress indicators and helpful error messages guide users through any issues.

### **Script Architecture**

- **Root script** (`setup.sh`): Orchestrates the entire setup process
- **Backend script** (`moneywise-backend/setup.sh`): Handles detailed backend configuration
- **Modular utilities** (`scripts/`): Specialized modules for different concerns
- **Separation of concerns**: Each script has a specific responsibility
- **Reusability**: Backend script can be run independently if needed

### **Smart Prechecking System**

**🔄 No Duplicate Checks**: Prerequisites are verified once by the root script and shared with backend script.

**🚀 Efficiency**: Backend script skips prerequisite checking when called from root script.

**🛠️ Standalone Mode**: Backend script can still run independently with full prerequisite checking.

**📦 Shared Functions**: Common utilities (colors, print functions, service management) are centralized.

### **Modular Design Benefits**

**🎯 Single Responsibility**: Each module focuses on one specific area:
- **Output Utilities**: User experience and formatting
- **Prerequisites**: Tool verification and validation
- **Service Management**: System service operations
- **Database Utils**: **Main orchestrator** for database operations
- **Environment Manager**: **NEW!** .env file operations
- **Database Operations**: **NEW!** Core database functions
- **Schema Manager**: **NEW!** Schema verification and validation

**🔧 Easy Maintenance**: Changes to specific functionality only affect one module

**📈 Scalability**: New modules can be added without affecting existing ones

**🔄 Reusability**: Modules can be used independently or together

**📚 Educational Value**: Clear separation makes the code easier to understand and learn from

### **Database Module Refactoring Benefits**

**🎯 Further Modularization**: The database utilities have been split into even more focused modules:

- **`env-manager.sh` (112 lines)**: Handles .env file creation, loading, and parsing
- **`db-operations.sh` (101 lines)**: Manages database creation, existence checks, and connection testing
- **`schema-manager.sh` (69 lines)**: Focuses on schema verification and validation
- **`database-utils.sh` (163 lines)**: Now acts as the main orchestrator, loading and coordinating the specialized modules

**🚀 Benefits of This Split:**
- **Ultra-focused responsibility**: Each module has a single, clear purpose
- **Easier debugging**: Issues can be isolated to specific database concerns
- **Better testing**: Individual modules can be tested independently
- **Enhanced reusability**: Specific database functions can be sourced without loading everything
- **Improved maintainability**: Database experts can focus on specific areas
- **Clearer architecture**: The relationship between different database concerns is explicit

### **Benefits of the Final Architecture**

1. **📉 Dramatic Simplification**: Backend script reduced from 322 to 257 lines (20% reduction)
2. **🔧 Zero Code Duplication**: All common functionality now uses shared modules
3. **🚀 Better Performance**: No redundant operations, smart prechecking
4. **📚 Educational Value**: Clear separation of concerns and comprehensive comments
5. **🔄 Maximum Reusability**: Modules can be used independently or in combination
6. **📈 Easy Extensibility**: Simple to add new functionality or modify existing modules
7. **🛠️ Unified Maintenance**: All setup logic centralized in specialized modules
8. **🎯 Ultra-Modular Database**: Database operations split into 4 focused modules

### **How the Optimization Works**

**Before**: Backend script had ~65 lines of duplicated database and environment setup code
**After**: Backend script now calls `setup_database_environment()` and `verify_database_schema()` from shared modules

**Result**:
- **Cleaner code**: Backend script focuses only on backend-specific tasks
- **Better maintainability**: Database logic centralized in one place
- **Consistent behavior**: Same database operations used across all scripts
- **Easier debugging**: Issues isolated to specific modules

### **Code Optimization Results**

**🚀 Significant Reduction in Total Lines:**
- **Before optimization**: 2,013 total lines
- **After optimization**: 1,577 total lines
- **Total reduction**: 436 lines (21.7% reduction!)

**📊 Individual Module Optimization:**
- **Output Utilities**: 136 → 93 lines (31.6% reduction)
- **Prerequisites Checker**: 296 → 234 lines (20.9% reduction)
- **Service Manager**: 444 → 235 lines (47.1% reduction)
- **Database Utils**: 420 → 163 lines (61.2% reduction) **+ 3 new focused modules**
- **Setup Utils**: 302 → 155 lines (48.7% reduction)

**🎯 What Was Removed:**
- **Unused functions** that were never called
- **Redundant utility functions** that duplicated functionality
- **Unused service management** functions (stop, health check, etc.)
- **Unused database operations** (drop, list, size check, etc.)
- **Unused orchestration** functions that weren't being used

**✅ What Was Kept:**
- **All essential functions** that are actually used
- **Core functionality** for setup and verification
- **Educational comments** explaining the design decisions
- **Error handling** and user guidance
- **Cross-platform compatibility** features
- **Smart prechecking** system
- **Modular architecture** benefits

**🆕 What Was Added:**
- **Environment Manager**: Dedicated .env file operations (112 lines)
- **Database Operations**: Core database functions (101 lines)
- **Schema Manager**: Schema verification and validation (69 lines)
- **Enhanced modularity**: Better separation of database concerns

The setup system is now **production-ready**, **highly maintainable**, **completely DRY**, **highly optimized**, **ultra-modular**, and **educational** while following software engineering best practices! 🎯✨