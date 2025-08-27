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
