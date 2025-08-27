# 🔧 Core Utilities

Foundation utilities that provide common functionality across all MoneyWise scripts.

## 📁 Files

### `module-loader.sh` - **Central Module Management**
**Purpose**: Provides centralized module loading, validation, and error reporting for all MoneyWise scripts.

**What it does**:
- **Module Discovery**: Automatically finds and loads required modules
- **Dependency Management**: Ensures modules load in correct order
- **Error Handling**: Graceful failure with clear error messages
- **Validation**: Verifies project structure and module availability
- **Status Reporting**: Clear feedback on module loading success/failure

**Key Functions**:
- `load_module()` - Load individual modules with validation
- `load_modules()` - Load multiple modules with status reporting
- `verify_project_structure()` - Validate MoneyWise project layout

**Usage**: Automatically sourced by other scripts, provides `load_module` and `load_modules` functions.

### `output-utils.sh` - **Consistent Output Formatting**
**Purpose**: Provides standardized output functions for status, success, error, and warning messages across all scripts.

**Core Functions**:
- `print_status()` - Information and progress messages
- `print_success()` - Success confirmations with ✅
- `print_error()` - Error messages with ❌
- `print_warning()` - Warning messages with ⚠️
- `print_info()` - General information display
- `print_section_header()` - Section headers with formatting
- `print_subsection_header()` - Subsection headers
- `print_progress()` - Progress indicators
- `print_separator()` - Visual separators

**Features**:
- **Unicode Support**: Emoji and special characters for visual clarity
- **Consistent Formatting**: Uniform message appearance across scripts
- **Color Support**: Terminal color codes when available

**Example Usage**:
```bash
source ./output-utils.sh
print_status "Starting database operation..."
print_success "Database connection established"
print_warning "No sample data found - this may be expected"
print_error "Failed to connect to database"
```

### `setup-utils.sh` - **Database Setup & Verification**
**Purpose**: Provides database setup, connection testing, and schema verification functions.

**Key Functions**:
- `setup_database_environment()` - Create and configure databases
- `test_database_connection()` - Validate database connectivity
- `verify_database_schema()` - Check schema integrity and sample data

**Database Operations**:
- **Connection Testing**: Validate database URLs and credentials
- **Schema Verification**: Check UUID columns and table structure
- **Sample Data Validation**: Verify initial data population
- **Environment Setup**: Database creation and configuration

**Usage**: Sourced by database and setup scripts for database operations.

### `env-utils.sh` - **Environment Configuration Management**
**Purpose**: Handles .env file loading, validation, and environment variable management.

**Core Functions**:
- `load_env_file()` - Load and parse .env files
- `extract_env_value()` - Extract specific environment variables
- `create_default_env()` - Generate .env file templates

**Features**:
- **File Loading**: Automatic .env file discovery and loading
- **Variable Extraction**: Safe extraction of configuration values
- **Template Generation**: Environment-specific configuration templates

**Usage**: Used by setup and configuration scripts for environment management.

### `service-utils.sh` - **Service Management Foundation**
**Purpose**: Provides service management infrastructure (currently minimal implementation).

**Status**: Basic service utility loading - specific service functions are implemented in setup scripts.

**Usage**: Sourced by setup scripts for service management foundation.

### `command-utils.sh` - **Command & Tool Validation**
**Purpose**: Verifies required system commands and tools are available and properly configured.

**Validation Functions**:
- `command_exists()` - Check if command is available

**Common Checks**:
- **Development Tools**: Git, Rust, Cargo, SQLx CLI
- **Database Tools**: PostgreSQL client (psql), Redis client
- **System Tools**: curl, wget, tar, unzip

**Usage**: Used by prerequisite checkers and setup scripts.

### `path-utils.sh` - **Path & Directory Operations**
**Purpose**: Provides cross-platform path handling and directory validation utilities.

**Path Functions**:
- `get_script_dir()` - Get absolute path of script directory
- `safe_cd()` - Safe directory change with restoration
- `restore_cd()` - Restore previous directory

**Features**:
- **Cross-Platform**: Works on Linux, macOS, and Windows
- **Path Resolution**: Automatic relative to absolute path conversion
- **Safe Navigation**: Directory change with automatic restoration

**Usage**: Used by all scripts for reliable path handling.

### `check-utils.sh` - **Health & Status Checking**
**Purpose**: Provides utilities for checking system health, service status, and overall project state.

**Health Checks**:
- **File Validation**: Check file existence and permissions
- **Directory Validation**: Check directory existence and permissions
- **Command Validation**: Verify required tools are available
- **Environment Validation**: Check environment variable configuration

**Key Functions**:
- `check_file_exists()` - Validate file existence with status tracking
- `check_dir_exists()` - Validate directory existence with status tracking
- `check_command_exists()` - Validate command availability with status tracking
- `check_env_var()` - Validate environment variable configuration
- `print_status_summary()` - Display summary of all checks
- `run_checks()` - Execute multiple validation checks

**Status Tracking**:
- **Counters**: Track good, warning, and error counts
- **Incremental**: Update counts as checks are performed
- **Summary**: Provide comprehensive status overview

**Usage**: Used by health check scripts and monitoring tools.

### `test-utils.sh` - **Testing Framework Support**
**Purpose**: Provides utilities for test execution, reporting, and validation.

**Testing Functions**:
- `run_test()` - Execute individual tests with reporting
- `run_test_section()` - Execute multiple tests with summary
- `print_test_summary()` - Create detailed test reports
- `reset_test_counters()` - Reset test statistics

**Database Testing**:
- `test_database_connection()` - Test database connectivity
- `get_database_tables()` - Retrieve database table information
- `count_table_rows()` - Count rows in database tables

**Features**:
- **Test Execution**: Standardized test running and reporting
- **Result Validation**: Automatic pass/fail determination
- **Performance Tracking**: Test execution time measurement
- **Database Integration**: Built-in database testing utilities

**Usage**: Used by testing scripts for consistent test execution.

## 🔧 Usage Patterns

### **Module Loading Pattern**
```bash
# Standard module loading in scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
source "$MODULE_LOADER"

# Load specific modules
load_modules "Core" "output-utils.sh" "env-utils.sh"
```

### **Output Formatting Pattern**
```bash
# Source output utilities
source "$SCRIPT_DIR/../core/output-utils.sh"

# Use consistent formatting
print_status "Starting operation..."
if operation_successful; then
    print_success "Operation completed successfully"
else
    print_error "Operation failed"
    print_warning "Check logs for details"
fi
```

### **Health Check Pattern**
```bash
# Source check utilities
source "$SCRIPT_DIR/../core/check-utils.sh"

# Run validation checks
check_file_exists "./config.env" "Configuration file"
check_command_exists "psql" "PostgreSQL client"
check_env_var "DATABASE_URL" "Database connection string"

# Display summary
print_status_summary
```

## 🔗 Dependencies

### **Core Dependencies** (Required by all utilities)
```
output-utils.sh      ← Base output formatting
module-loader.sh     ← Module loading and management
```

### **Utility Dependencies**
```
setup-utils.sh       ← Depends on output-utils.sh
service-utils.sh     ← Depends on output-utils.sh
env-utils.sh         ← Depends on output-utils.sh
command-utils.sh     ← Depends on output-utils.sh
path-utils.sh        ← Depends on output-utils.sh
check-utils.sh       ← Depends on output-utils.sh
test-utils.sh        ← Depends on output-utils.sh
```

## 🚀 Use Cases

### **Script Development**
1. **Consistent Output**: Use output-utils.sh for uniform messaging
2. **Path Handling**: Use path-utils.sh for reliable file operations
3. **Health Monitoring**: Use check-utils.sh for system validation
4. **Environment**: Use env-utils.sh for configuration management

### **Integration**
1. **Module Loading**: Use module-loader.sh for dependency management
2. **Command Validation**: Use command-utils.sh for prerequisite checking
3. **Health Monitoring**: Use check-utils.sh for system validation
4. **Testing**: Use test-utils.sh for test execution

## ⚠️ Important Notes

### **Do Not Run Directly**
These utilities are designed to be **sourced** by other scripts, not executed directly:
```bash
# ❌ Wrong - Don't run directly
./output-utils.sh

# ✅ Correct - Source for functions
source ./output-utils.sh
print_success "Hello World"
```

### **Dependency Order**
Always load utilities in the correct order:
1. **module-loader.sh** - First (provides loading functions)
2. **output-utils.sh** - Second (required by all others)
3. **Other utilities** - As needed for specific functionality

### **Function Availability**
Functions are only available after sourcing the utility:
```bash
# Functions not available yet
print_status "This will fail"

# Source the utility
source ./output-utils.sh

# Now functions are available
print_status "This will work"
```

## 🔍 Troubleshooting

### **Common Issues**
- **Function not found**: Ensure utility is sourced before use
- **Path errors**: Use path-utils.sh for reliable path handling
- **Output formatting**: Source output-utils.sh for consistent display
- **Health checks**: Use check-utils.sh for system validation

### **Debug Mode**
```bash
# Enable debug output
DEBUG=1 source ./module-loader.sh

# Verbose module loading
VERBOSE=1 source ./module-loader.sh
```

### **Validation**
```bash
# Check utility availability
if [ -f "./output-utils.sh" ]; then
    source "./output-utils.sh"
    print_success "Utility loaded"
else
    echo "Utility not found"
fi
```
