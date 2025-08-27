# 🛠️ MoneyWise Scripts Directory

This directory contains utility scripts for managing and testing your MoneyWise project, organized into logical subdirectories for better maintainability.

## 📁 Directory Structure

```
scripts/
├── core/           # Core utility modules (output-utils, setup-utils)
├── database/       # Database-related scripts
├── testing/        # Testing and validation scripts
├── setup/          # Setup and environment management
├── quick-check.sh  # Main quick check script
└── README.md       # This file
```

## 🚀 Quick Start

### Fast Status Check
```bash
./scripts/quick-check.sh
```
**What it does**: 30-second overview of your setup status
**When to use**: Daily checks, before making changes

### Complete Test Suite
```bash
./scripts/testing/run-all-tests.sh
```
**What it does**: Comprehensive tests of all components
**When to use**: Before deployments, after major changes

## 📋 Script Categories

### 🔧 **Core Utilities** (`core/`)
**Purpose**: Shared functionality used by all other scripts
- **`output-utils.sh`** - Output formatting, colors, user experience
- **`setup-utils.sh`** - Main setup orchestration and module management

**Usage**: Utility modules sourced by other scripts. Do not run directly.

### 🗄️ **Database Scripts** (`database/`)
**Purpose**: Database operations, schema management, and connectivity
- **`database-utils.sh`** - Core database functionality and connection management
- **`db-operations.sh`** - Common database operations and utilities
- **`schema-manager.sh`** - Database schema management and validation

**Usage**: Some standalone, others sourced by setup scripts.

### 🧪 **Testing Scripts** (`testing/`)
**Purpose**: Validation and testing of setup components
- **`run-all-tests.sh`** - Comprehensive test suite for all components
- **`test-database-connection.sh`** - Database connectivity and schema validation
- **`test-setup-scripts.sh`** - Setup script syntax and structure validation

**Usage**: Run to validate your setup before making changes or deploying.

### ⚙️ **Setup Scripts** (`setup/`)
**Purpose**: Environment setup, service management, and prerequisites
- **`prereq-checker.sh`** - Validates system prerequisites and dependencies
- **`service-manager.sh`** - Manages system services (PostgreSQL, Redis)
- **`env-manager.sh`** - Environment variable and configuration management
- **`get-supabase-credentials.sh`** - Retrieves Supabase credentials

**Usage**: Handle initial setup and environment configuration.

### 🔍 **Quick Check** (`quick-check.sh`)
**Purpose**: Fast status overview of your entire setup
- **Duration**: ~30 seconds
- **Safety**: 100% safe - read-only operations
- **Use case**: Daily checks, quick validation, before making changes

## 🧪 Testing & Validation

### 🔒 Safety Features
All testing scripts are designed with safety in mind:
- **No Environment Changes**: All operations are read-only
- **No Data Modifications**: Database tests only use SELECT queries
- **No Service Changes**: Doesn't start/stop services
- **Temporary Test Files**: Uses `/tmp` directory, auto-cleanup
- **Graceful Failures**: Continues testing even if some components fail

### 🎯 What Gets Tested
- **Setup Scripts**: Bash syntax, file existence, dependencies, structure
- **Backend**: Cargo.toml validation, dependency resolution, compilation
- **Frontend**: package.json validation, dependencies availability
- **Database**: Connection parsing, connectivity, schema verification

### 📊 Test Results
- **✅ Good**: Component working correctly
- **⚠️ Warning**: Minor issues that don't prevent operation
- **❌ Error**: Issues that need attention

## 🔧 Troubleshooting

### Common Issues
1. **Permission Denied**: `chmod +x scripts/*.sh scripts/*/*.sh`
2. **Missing Dependencies**: Install PostgreSQL client, Rust toolchain, SQLx CLI
3. **Database Connection**: Check `.env` file, verify database is running

### When Tests Fail
1. Review error messages for specific guidance
2. Check file permissions and dependencies
3. Verify configuration and run individual tests to isolate issues

## 💡 Best Practices

### Daily Workflow
1. **Start with quick check**: `./scripts/quick-check.sh`
2. Address any warnings if needed
3. Continue development with confidence

### Before Changes
1. Run quick check to ensure current state
2. Make your changes
3. Run relevant tests to validate changes

### Testing Best Practices
- Run tests regularly before making changes to setup scripts
- Review failed tests and fix issues before proceeding
- Keep tests updated when modifying setup scripts

## 🚀 Next Steps

After successful testing:
1. Your setup is verified and ready
2. Run actual setup when needed: `./setup.sh`
3. Continue development with confidence
4. Use quick check regularly for ongoing validation

## 🔄 Script Dependencies

### Core Dependencies
- **`core/output-utils.sh`** → Used by all scripts for consistent output
- **`core/setup-utils.sh`** → Main orchestrator that sources other modules

### Module Dependencies
- **Setup scripts** → Source core utilities for output formatting
- **Testing scripts** → Source core utilities and test individual modules
- **Database scripts** → Can be standalone or sourced by setup scripts

### External Dependencies
- **Root setup.sh** → Sources `scripts/core/setup-utils.sh`
- **Backend setup.sh** → Sources `scripts/core/setup-utils.sh`

---

**Remember**: These testing tools are designed to be completely safe. They validate your setup without making any changes to your environment.
