# 🛠️ MoneyWise Scripts Directory

This directory contains utility scripts for managing and testing your MoneyWise project.

## 🚀 Quick Start

### Fast Status Check
```bash
./scripts/quick-check.sh
```
**What it does**: Provides a 30-second overview of your setup status
**When to use**: Daily checks, before making changes, quick validation

### Complete Test Suite
```bash
./scripts/run-all-tests.sh
```
**What it does**: Runs comprehensive tests of all components
**When to use**: Before deployments, after major changes, thorough validation

## 📋 Available Scripts

### 🔍 **Quick Check** (`quick-check.sh`)
- **Purpose**: Fast status overview
- **Duration**: ~30 seconds
- **Safety**: 100% safe - read-only operations
- **Use case**: Daily checks, quick validation

### 🧪 **Complete Test Suite** (`run-all-tests.sh`)
- **Purpose**: Comprehensive testing
- **Duration**: 2-5 minutes
- **Safety**: 100% safe - no environment changes
- **Use case**: Pre-deployment, thorough validation

### 🧪 **Setup Scripts Test** (`test-setup-scripts.sh`)
- **Purpose**: Validate setup script syntax and structure
- **Duration**: 1-2 minutes
- **Safety**: 100% safe - syntax checking only
- **Use case**: Verify setup scripts are correct

### 🗄️ **Database Connection Test** (`test-database-connection.sh`)
- **Purpose**: Test database connectivity and schema
- **Duration**: 1-2 minutes
- **Safety**: 100% safe - read-only database operations
- **Use case**: Verify database accessibility

## 🔒 Safety Features

All testing scripts are designed with safety in mind:

- **No Environment Changes**: All operations are read-only
- **No Data Modifications**: Database tests only use SELECT queries
- **No Service Changes**: Doesn't start/stop services
- **Temporary Test Files**: Uses `/tmp` directory, auto-cleanup
- **Graceful Failures**: Continues testing even if some components fail

## 🚨 What WON'T Happen

- ❌ No database migrations
- ❌ No data modifications
- ❌ No service restarts
- ❌ No environment variable changes
- ❌ No file modifications
- ❌ No network configuration changes

## 🎯 What Gets Tested

### Setup Scripts
- ✅ Bash syntax validation
- ✅ File existence and permissions
- ✅ Dependency availability
- ✅ Script structure and error handling

### Backend
- ✅ Cargo.toml validation
- ✅ Dependency resolution
- ✅ Compilation (dry run)
- ✅ Project structure

### Frontend
- ✅ package.json validation
- ✅ Dependencies availability
- ✅ Project structure

### Database
- ✅ Connection string parsing
- ✅ Database connectivity
- ✅ Schema verification (read-only)
- ✅ Local database testing

## 📊 Test Results

### Status Indicators
- **✅ Good**: Component is working correctly
- **⚠️ Warning**: Minor issues that don't prevent operation
- **❌ Error**: Issues that need attention

### Test Results
- **✅ Passed**: Component is working correctly
- **❌ Failed**: Component has issues that need fixing
- **⚠️ Skipped**: Component couldn't be tested (usually safe to ignore)

### Quick Check Results
- **All Systems Go**: Setup is ready for use
- **Functional with Warnings**: Minor issues, but setup works
- **Issues Detected**: Problems that should be addressed

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Missing Dependencies**
   - Install PostgreSQL client: `sudo apt-get install postgresql-client`
   - Install Rust toolchain: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - Install SQLx CLI: `cargo install sqlx-cli --no-default-features --features postgres`

3. **Database Connection Issues**
   - Check your `.env` file in `moneywise-backend/`
   - Verify database is running
   - Check network connectivity

### When Tests Fail

1. **Review the error messages** - they provide specific guidance
2. **Check file permissions** - ensure scripts are executable
3. **Verify dependencies** - ensure required tools are installed
4. **Check configuration** - verify `.env` files and settings
5. **Run individual tests** - isolate specific issues

## 💡 Best Practices

### Daily Workflow
1. **Start with quick check**: `./scripts/quick-check.sh`
2. **Address any warnings** if needed
3. **Continue development** with confidence

### Before Changes
1. **Run quick check** to ensure current state
2. **Make your changes**
3. **Run relevant tests** to validate changes
4. **Run complete test suite** for major changes

### After Setup
1. **Run complete test suite** to verify everything works
2. **Use quick check** for daily validation
3. **Run specific tests** when troubleshooting

### Testing Best Practices
1. **Run Tests Regularly**: Before making changes to setup scripts
2. **Check Results**: Review any failed tests before proceeding
3. **Fix Issues**: Address failures before running actual setup
4. **Keep Tests Updated**: Update tests when modifying setup scripts

## 🚀 Next Steps

After successful testing:

1. **Your setup is verified and ready**
2. **Run actual setup when needed**: `./setup.sh`
3. **Continue development with confidence**
4. **Use quick check regularly** for ongoing validation

## 🎉 Success Indicators

When all tests pass, you'll see:

```
🎉 All tests passed! Your setup scripts are working correctly.

🚀 Your MoneyWise project is ready for use:
   - Setup scripts are valid and functional
   - Database connection is working
   - Backend can be built successfully
   - Frontend dependencies are available
```

## 📚 Additional Resources

- **SETUP_GUIDE.md**: Complete setup instructions
- **TESTING_GUIDE.md**: Detailed testing documentation
- **MoneyWise Backend README**: Backend-specific information
- **MoneyWise App README**: Frontend-specific information

---

**Remember**: These testing tools are designed to be completely safe. They validate your setup without making any changes to your environment.
