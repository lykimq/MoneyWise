# 🗄️ Database Scripts

Database operations, schema management, and connectivity for MoneyWise.

## 📁 Files

### `schema-manager.sh` - **Main Schema Management Tool**
**Purpose**: Comprehensive database schema management with verification, validation, and migration support.

**Actions Available**:
- **`verify`** - Basic schema verification (UUID columns, sample data)
- **`validate`** - Comprehensive validation (tables, constraints, data integrity)
- **`migrate`** - Execute SQL migration files safely
- **`report`** - Generate detailed schema reports and statistics

**Usage Examples**:
```bash
# Basic verification
./schema-manager.sh postgresql://user:pass@localhost:5432/moneywise verify

# Full validation
./schema-manager.sh postgresql://user:pass@localhost:5432/moneywise validate

# Run migration
./schema-manager.sh postgresql://user:pass@localhost:5432/moneywise migrate ./migrations/new_feature.sql

# Generate report
./schema-manager.sh postgresql://user:pass@localhost:5432/moneywise report
```

**Integration**: Can be sourced to access functions: `manage_schema`, `validate_schema_structure`, `check_schema_constraints`

### `database-utils.sh` - **Database Module Orchestrator**
**Purpose**: Central orchestrator that loads and manages all database-related modules.

**What it does**:
- Loads all database modules using the module loader system
- Provides unified interface for database operations
- Initializes database utilities when sourced

**Usage**: Primarily sourced by other scripts, but can be used directly:
```bash
source ./database-utils.sh
# Now all database functions are available
```

### `db-operations.sh` - **Common Database Operations**
**Purpose**: Provides utility functions for common database tasks.

**Features**:
- Database connection testing
- Basic CRUD operations
- Data validation utilities
- Performance monitoring

## 🔧 Usage Patterns

### **Standalone Execution**
Run scripts directly for immediate database operations:
```bash
# Quick schema check
./schema-manager.sh $DATABASE_URL verify

# Run migration
./schema-manager.sh $DATABASE_URL migrate ./migration.sql
```

### **Sourced for Functions**
Source scripts to access functions in other scripts:
```bash
source ./schema-manager.sh
manage_schema "$DATABASE_URL" "validate"
```

### **Integration with Setup**
Used by setup scripts for database initialization and verification.

## 📋 Features

- **Schema Verification**: UUID validation, table existence checks
- **Schema Validation**: Constraint validation, data integrity checks
- **Migration Support**: Safe SQL file execution with error handling
- **Reporting**: Comprehensive schema statistics and usage information
- **Error Handling**: Graceful failure with actionable error messages
- **Integration**: Works with existing MoneyWise utility system

## 🔗 Dependencies

**Required**:
- `../core/module-loader.sh` - Core utility loading
- `../core/setup-utils.sh` - Database verification functions
- PostgreSQL client (`psql`) - Database operations

**Provides**:
- Schema management functions
- Database validation utilities
- Migration execution capabilities

## 🚀 Use Cases

### **Development Workflow**
1. **Before coding**: Verify local database schema
2. **Schema changes**: Run migrations safely
3. **Testing**: Validate test database structure
4. **Debugging**: Generate schema reports

### **Production Deployment**
1. **Pre-deployment**: Verify production schema
2. **Migration**: Apply schema changes safely
3. **Post-deployment**: Validate schema integrity
4. **Monitoring**: Generate usage reports

### **Team Collaboration**
1. **Onboarding**: Verify development environment
2. **Schema sync**: Ensure team has latest schema
3. **Testing**: Validate changes don't break existing functionality

## 🧪 Testing

Test the schema manager functionality:
```bash
# Run comprehensive tests
../testing/test-schema-manager.sh

# Test specific actions
./schema-manager.sh invalid_url verify  # Should fail gracefully
./schema-manager.sh invalid_url invalid_action  # Should show usage
```

## ⚠️ Safety Notes

- **Migration actions** modify database schema - review migration files first
- **Validation actions** are read-only and safe
- **Verification actions** only check existing state
- **Report actions** are read-only and safe

## 🔍 Troubleshooting

**Common Issues**:
- **Permission denied**: Ensure script is executable (`chmod +x schema-manager.sh`)
- **Database connection failed**: Check DATABASE_URL and PostgreSQL service
- **Function not found**: Ensure script is sourced properly
- **Migration failed**: Check SQL syntax and database permissions
