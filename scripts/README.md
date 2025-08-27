# 🛠️ MoneyWise Scripts

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

## 🔒 Safety

**Testing scripts are read-only and safe:**
- No environment changes during testing
- No data modifications in test runs
- No service changes from test execution
- Creates temporary test files only (automatically cleaned up)

**Note:** Setup and database scripts may modify your environment - review them before running.

## 🔧 Usage

**Daily**: Run `quick-check.sh` for project status
**Before changes**: Run relevant tests to ensure stability
**Setup**: Use `setup.sh` for initial configuration (review first)

## 🚨 Troubleshooting

- **Permission denied**: `chmod +x scripts/*.sh scripts/*/*.sh`
- **Missing dependencies**: Install PostgreSQL client, Rust, SQLx CLI
- **Database issues**: Check `.env` file and service status
- **Icon display**: Ensure your terminal supports Unicode emojis
