# 🛠️ MoneyWise Scripts

Utility scripts for managing and testing your MoneyWise project.

## 📁 Structure

```
scripts/
├── core/           # Foundation utilities (output, module loading, etc.)
├── database/       # Database operations and schema management
├── testing/        # Testing framework and validation
├── setup/          # Environment and service setup
└── quick-check.sh  # Fast project status check
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

## 🔧 What Each Folder Provides

- **`core/`** - Foundation utilities used by all other scripts
- **`database/`** - Schema management, validation, and migration tools
- **`testing/`** - Script validation and system health checks
- **`setup/`** - Environment configuration and service management

## 🔒 Safety

**Testing scripts are read-only and safe:**
- No environment changes during testing
- No data modifications in test runs
- No service changes from test execution
- Creates temporary test files only (automatically cleaned up)

**Note:** Setup and database scripts may modify your environment - review them before running.

## 🔧 Usage

- **Daily**: Run `quick-check.sh` for project status
- **Before changes**: Run relevant tests to ensure stability
- **Setup**: Use setup scripts for initial configuration (review first)

## 🚨 Troubleshooting

- **Permission denied**: `chmod +x scripts/*.sh scripts/*/*.sh`
- **Missing dependencies**: Install PostgreSQL client, Rust, SQLx CLI
- **Database issues**: Check `.env` file and service status
- **Icon display**: Ensure your terminal supports Unicode emojis

## 📚 Detailed Documentation

For comprehensive information about each script folder:
- **Core utilities**: See `scripts/core/README.md`
- **Database scripts**: See `scripts/database/README.md`
- **Testing scripts**: See `scripts/testing/README.md`
- **Setup scripts**: See `scripts/setup/README.md`
