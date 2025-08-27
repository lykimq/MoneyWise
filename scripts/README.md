# ��️ MoneyWise Scripts

Utility scripts for managing and testing your MoneyWise project.

## 📁 Structure

```
scripts/
├── core/           # Core utilities (output, setup, path, etc.)
├── database/       # Database operations and schema
├── testing/        # Testing and validation
├── setup/          # Environment and service setup
└── quick-check.sh  # Fast status check
```

## 🚀 Quick Start

**Fast Status Check** (30 seconds):
```bash
./scripts/quick-check.sh
```

**Complete Test Suite**:
```bash
./scripts/testing/run-all-tests.sh
```

## 📋 Scripts

### 🔧 Core (`core/`)
Shared functionality for all scripts:
- `output-utils.sh` - Output formatting and colors
- `setup-utils.sh` - Setup orchestration
- `path-utils.sh` - Path operations
- `command-utils.sh` - Command checking
- `env-utils.sh` - Environment management
- `check-utils.sh` - Status tracking
- `test-utils.sh` - Test execution
- `service-utils.sh` - Service management
- `module-loader.sh` - Module loading

### 🗄️ Database (`database/`)
Database operations:
- `database-utils.sh` - Core database functions
- `db-operations.sh` - Common operations
- `schema-manager.sh` - Schema management

### 🧪 Testing (`testing/`)
Validation scripts:
- `run-all-tests.sh` - Complete test suite
- `test-database-connection.sh` - Database tests
- `test-setup-scripts.sh` - Setup validation

### ⚙️ Setup (`setup/`)
Environment setup:
- `prereq-checker.sh` - System prerequisites
- `service-manager.sh` - Service management
- `env-manager.sh` - Environment config
- `get-supabase-credentials.sh` - Supabase setup

## 🔒 Safety

All scripts are read-only and safe:
- No environment changes
- No data modifications
- No service changes
- Temporary test files only

## 🔧 Usage

**Daily**: Run `quick-check.sh` for status
**Before changes**: Run relevant tests
**Setup**: Use `setup.sh` for initial configuration

## 🚨 Troubleshooting

- **Permission denied**: `chmod +x scripts/*.sh scripts/*/*.sh`
- **Missing deps**: Install PostgreSQL client, Rust, SQLx CLI
- **Database issues**: Check `.env` file and service status
