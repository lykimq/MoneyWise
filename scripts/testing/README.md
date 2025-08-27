# 🧪 Testing Scripts

Comprehensive testing framework for validating MoneyWise script functionality and system health.

## 📁 Files

### `run-all-tests.sh` - **Complete Test Suite Orchestrator**
**Purpose**: Executes all tests in the correct order with comprehensive reporting.

**What it does**:
- Runs all test scripts in dependency order
- Provides summary of test results
- Stops on first failure (configurable)
- Generates test reports

**Usage**:
```bash
# Run complete test suite
./run-all-tests.sh

# Run with verbose output
./run-all-tests.sh --verbose

# Continue on failures
./run-all-tests.sh --continue-on-failure
```

### `test-schema-manager.sh` - **Schema Manager Validation**
**Purpose**: Tests the `schema-manager.sh` script functionality and integration.

**Test Coverage**:
- Script existence and permissions
- Help/usage functionality
- Function loading when sourced
- Error handling with invalid inputs
- Parameter validation
- Module loader integration

**Usage**:
```bash
# Test schema manager functionality
./test-schema-manager.sh

# This test validates:
# ✅ Script permissions and existence
# ✅ Function loading and availability
# ✅ Error handling and validation
# ✅ Integration with core utilities
```

### `test-database-connection.sh` - **Database Connectivity & Schema Tests**
**Purpose**: Validates database connectivity, schema integrity, and basic operations.

**Test Coverage**:
- Database connection testing
- Schema structure validation
- Table existence and constraints
- Sample data verification
- Performance benchmarks
- Cross-environment compatibility

**Usage**:
```bash
# Test with environment file
./test-database-connection.sh

# Test with manual database URL
./test-database-connection.sh postgresql://user:pass@localhost:5432/moneywise

# Safe validation - no data changes
# Tests: connection, schema, read-only operations
```

### `test-setup-scripts.sh` - **Setup Script Validation**
**Purpose**: Tests environment setup, service management, and configuration scripts.

**Test Coverage**:
- Environment file loading
- Service status checking
- Prerequisites validation
- Configuration verification
- Cross-script dependencies

**Usage**:
```bash
# Test setup script functionality
./test-setup-scripts.sh

# Validates:
# ✅ Environment configuration
# ✅ Service management
# ✅ Prerequisites checking
# ✅ Script dependencies
```

## 🔧 Usage Patterns

### **Development Workflow**
```bash
# Before making changes
./run-all-tests.sh

# After implementing new features
./test-schema-manager.sh  # Test specific functionality

# Before committing
./run-all-tests.sh --verbose
```

### **CI/CD Integration**
```bash
# Automated testing in pipelines
./run-all-tests.sh --ci-mode

# Exit on first failure for CI
./run-all-tests.sh --fail-fast
```

### **Troubleshooting**
```bash
# Isolate specific issues
./test-database-connection.sh  # Database problems
./test-schema-manager.sh       # Schema manager issues
./test-setup-scripts.sh        # Setup problems
```

## 📋 Features

### **Comprehensive Testing**
- **Syntax Validation**: Shell script syntax checking
- **Module Loading Tests**: Dependency and utility loading
- **Database Connectivity**: Connection and schema validation
- **Cross-Script Dependencies**: Integration testing
- **Error Handling**: Graceful failure scenarios
- **Performance Testing**: Basic performance validation

### **Test Reporting**
- **Detailed Output**: Step-by-step test progress
- **Success/Failure Summary**: Clear pass/fail indicators
- **Error Details**: Specific failure information
- **Performance Metrics**: Execution time and resource usage

### **Safety Features**
- **Read-Only Operations**: No environment changes during testing
- **Temporary Files**: Automatic cleanup of test artifacts
- **Isolated Testing**: Tests don't interfere with each other
- **Rollback Capability**: Tests can be safely interrupted

## 🔒 Safety Guarantees

**All tests are read-only and safe**:
- ✅ **No environment changes** - Tests only read configuration
- ✅ **No data modifications** - Database tests are read-only
- ✅ **No service changes** - Service tests only check status
- ✅ **Temporary files only** - Automatically cleaned up
- ✅ **Isolated execution** - Tests don't affect production

**What tests do**:
- Verify script functionality
- Check system health
- Validate configurations
- Test integrations
- Measure performance

**What tests don't do**:
- Modify environment variables
- Change database data
- Start/stop services
- Install software
- Modify system configuration

## 🚀 Use Cases

### **Development**
1. **Pre-commit**: Verify changes don't break functionality
2. **Feature testing**: Test new script implementations
3. **Integration**: Verify script interactions
4. **Debugging**: Isolate issues in script functionality

### **Quality Assurance**
1. **Regression testing**: Ensure existing functionality works
2. **Cross-platform**: Test on different environments
3. **Dependency validation**: Verify required tools and services
4. **Performance monitoring**: Track script performance over time

### **Production**
1. **Pre-deployment**: Verify scripts work in target environment
2. **Health monitoring**: Regular system health checks
3. **Troubleshooting**: Diagnose production issues
4. **Documentation**: Demonstrate expected behavior

## 🧪 Testing Strategy

### **Test Categories**
1. **Unit Tests**: Individual script functionality
2. **Integration Tests**: Script interactions and dependencies
3. **System Tests**: End-to-end functionality
4. **Performance Tests**: Execution time and resource usage

### **Test Execution Order**
1. **Prerequisites**: Check required tools and services
2. **Core Utilities**: Test foundation functions
3. **Database**: Validate connectivity and schema
4. **Setup Scripts**: Test configuration and services
5. **Integration**: Verify cross-script functionality

### **Failure Handling**
- **Stop on First Failure**: Default behavior for CI/CD
- **Continue on Failure**: Option for development debugging
- **Detailed Error Reporting**: Specific failure information
- **Rollback Support**: Safe interruption and cleanup

## 🔍 Troubleshooting

**Common Test Issues**:
- **Permission denied**: Ensure scripts are executable
- **Missing dependencies**: Install required tools (PostgreSQL, Rust)
- **Database connection**: Check .env file and service status
- **Test failures**: Review error output for specific issues

**Debug Mode**:
```bash
# Enable debug output
DEBUG=1 ./run-all-tests.sh

# Verbose testing
./run-all-tests.sh --verbose

# Test specific component
./test-schema-manager.sh
```

## 📊 Test Results

**Success Indicators**:
- ✅ All tests pass
- ✅ Functions load correctly
- ✅ Dependencies resolve
- ✅ Integrations work
- ✅ Performance acceptable

**Failure Indicators**:
- ❌ Script syntax errors
- ❌ Missing dependencies
- ❌ Database connectivity issues
- ❌ Function loading failures
- ❌ Integration problems
