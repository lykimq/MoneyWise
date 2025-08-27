#!/bin/bash

# MoneyWise Database Connection Test
# Safely tests database connectivity without affecting your data
# Validates: connection, schema, and basic operations in read-only mode
# Safe validation without data changes - connection testing only

# Load core utilities
DB_TEST_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$DB_TEST_SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load additional utilities
TEST_UTILS="$SCRIPT_DIR/../core/test-utils.sh"
ENV_UTILS="$SCRIPT_DIR/../core/env-utils.sh"
COMMAND_UTILS="$SCRIPT_DIR/../core/command-utils.sh"

source "$TEST_UTILS"
source "$ENV_UTILS"
source "$COMMAND_UTILS"

echo "🗄️  MoneyWise Database Connection Test"
echo "====================================="
echo "This will test your database connection WITHOUT making any changes"
echo

# Environment detection for database configuration
print_status "Detecting database environment..."

# Find and load environment file
ENV_PATHS=(
    "../../moneywise-backend/.env"
    "../../.env"
    "../.env"
    ".env"
)

ENV_FILE=""
for path in "${ENV_PATHS[@]}"; do
    if [ -f "$DB_TEST_SCRIPT_DIR/$path" ]; then
        ENV_FILE="$DB_TEST_SCRIPT_DIR/$path"
        break
    fi
done

if [ -z "$ENV_FILE" ]; then
    print_warning "No .env file found"
    print_status "Please provide database connection details manually"

    read -p "Enter DATABASE_URL (or press Enter to skip): " DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        print_warning "Skipping database tests"
        exit 0
    fi
else
    print_status "Loading environment from $ENV_FILE"
    if ! load_env_file "$ENV_FILE"; then
        print_error "Failed to load environment file"
        exit 1
    fi

    DATABASE_URL=$(extract_env_value "$ENV_FILE" "DATABASE_URL")
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL not found in $ENV_FILE"
        exit 1
    fi

    print_success "Environment loaded successfully"
fi

# Database type detection
print_status "Detecting database type..."

if [[ "$DATABASE_URL" == *"supabase.com"* ]] || [[ "$DATABASE_URL" == *"supabase.co"* ]]; then
    DATABASE_TYPE="supabase"
    print_success "Detected Supabase database environment"
elif [[ "$DATABASE_URL" == *"localhost"* ]] || [[ "$DATABASE_URL" == *"127.0.0.1"* ]]; then
    DATABASE_TYPE="local"
    print_success "Detected local database environment"
else
    print_warning "Unknown database environment - assuming remote"
    DATABASE_TYPE="remote"
fi

echo

# Test database connection
print_status "Testing database connection..."

if command_exists "psql"; then
    print_status "Testing with psql..."

    # Extract connection parameters
    DB_HOST=$(parse_database_url "$DATABASE_URL" "host")
    DB_PORT=$(parse_database_url "$DATABASE_URL" "port")
    DB_NAME=$(parse_database_url "$DATABASE_URL" "dbname")
    DB_USER=$(parse_database_url "$DATABASE_URL" "user")

    print_status "Connection parameters extracted:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"

    # Test connection
    if test_database_connection "$DATABASE_URL" 10; then
        print_success "Database connection successful"
    else
        print_warning "Database connection failed"
        print_status "This may be expected if:"
        echo "   - Database is not running"
        echo "   - Network connectivity issues"
        echo "   - Credentials are incorrect"
        echo "   - Firewall blocking connection"
        print_status "Continuing with other tests..."
    fi
else
    print_warning "psql not available, skipping direct connection test"
fi

# Schema verification
print_status "Verifying database schema (read-only mode)..."

if command_exists "psql"; then
    print_status "Checking table structure..."

    # Get list of tables
    TABLES=$(get_database_tables "$DATABASE_URL")

    if [ -n "$TABLES" ]; then
        print_success "Found tables in database:"
        echo "$TABLES" | while read -r table; do
            if [ -n "$table" ]; then
                echo "  📋 $table"
            fi
        done

        # Count total tables
        TABLE_COUNT=$(echo "$TABLES" | wc -l)
        echo "  Total tables: $TABLE_COUNT"
    else
        print_warning "No tables found in public schema"
        print_status "This may be expected if:"
        echo "   - Database is not accessible"
        echo "   - Schema is empty"
        echo "   - Connection failed"
    fi

    # Check for MoneyWise tables
    print_status "Checking for MoneyWise-specific tables..."

    MONEYWISE_TABLES=("categories" "budget_items" "budgets" "transactions")
    FOUND_TABLES=0

    for table in "${MONEYWISE_TABLES[@]}"; do
        if echo "$TABLES" | grep -q "^$table$"; then
            print_success "Found $table table"
            ((FOUND_TABLES++))
        else
            print_warning "Missing $table table"
        fi
    done

    if [ $FOUND_TABLES -gt 0 ]; then
        print_success "Found $FOUND_TABLES MoneyWise tables"
    else
        print_warning "No MoneyWise-specific tables found"
    fi
else
    print_warning "psql not available, skipping schema verification"
fi

# Data verification
print_status "Verifying sample data (read-only mode)..."

if command_exists "psql"; then
    print_status "Checking data availability..."

    # Test counts for each table
    for table in $TABLES; do
        if [ -n "$table" ]; then
            COUNT=$(count_table_rows "$DATABASE_URL" "$table")
            if [ -n "$COUNT" ] && [ "$COUNT" != "ERROR" ]; then
                echo "  📊 $table: $COUNT rows"
            else
                echo "  📊 $table: Unable to count rows"
            fi
        fi
    done

    # Check categories data
    if echo "$TABLES" | grep -q "^categories$"; then
        print_status "Checking categories data..."
        CATEGORIES=$(timeout 10 psql "$DATABASE_URL" -t -c "SELECT name FROM categories LIMIT 5;" 2>/dev/null | grep -v '^$' | tr -d ' ')
        if [ -n "$CATEGORIES" ]; then
            print_success "Found categories:"
            echo "$CATEGORIES" | while read -r category; do
                if [ -n "$category" ]; then
                    echo "  🏷️  $category"
                fi
            done
        fi
    fi

    # Check budgets data
    if echo "$TABLES" | grep -q "^budgets$"; then
        print_status "Checking budgets data..."
        BUDGET_COUNT=$(count_table_rows "$DATABASE_URL" "budgets")
        if [ -n "$BUDGET_COUNT" ] && [ "$BUDGET_COUNT" != "ERROR" ]; then
            print_success "Found $BUDGET_COUNT budget records"
        fi
    fi
else
    print_warning "psql not available, skipping data verification"
fi

# SQLx CLI test
print_status "Testing SQLx CLI availability..."

if command_exists "sqlx"; then
    print_success "SQLx CLI is available"

    print_status "Testing SQLx database info..."
    if timeout 10 sqlx database info "$DATABASE_URL" > /dev/null 2>&1; then
        print_success "SQLx can connect to database"
    else
        print_warning "SQLx connection test failed"
    fi
else
    print_warning "SQLx CLI not available"
    print_status "Install with: cargo install sqlx-cli --no-default-features --features postgres"
fi

# Local database test
print_status "Testing local database connectivity (optional)..."

LOCAL_DB_URLS=(
    "postgresql://postgres@localhost:5432/postgres"
    "postgresql://postgres@localhost:5432/moneywise"
    "postgresql://moneywise@localhost:5432/moneywise"
)

LOCAL_CONNECTION_FOUND=false

for local_url in "${LOCAL_DB_URLS[@]}"; do
    print_status "Testing local connection: $local_url"

    if test_database_connection "$local_url" 5; then
        print_success "Local database connection successful: $local_url"
        LOCAL_CONNECTION_FOUND=true

        # Test if this is a MoneyWise database
        TABLES=$(get_database_tables "$local_url")

        if [ -n "$TABLES" ]; then
            print_success "Found tables in local database:"
            echo "$TABLES" | while read -r table; do
                if [ -n "$table" ]; then
                    echo "  📋 $table"
                fi
            done
        fi

        break
    else
        print_warning "Local connection failed: $local_url"
    fi
done

if [ "$LOCAL_CONNECTION_FOUND" = false ]; then
    print_warning "No local database connections found"
    print_status "This is normal if you're using Supabase or remote database"
fi

# Print final summary
echo
echo "📊 DATABASE TEST RESULTS SUMMARY"
echo "================================"

# Determine overall database status
if [ -n "$TABLES" ] || [ "$LOCAL_CONNECTION_FOUND" = true ]; then
    DB_STATUS="✅ WORKING"
    DB_STATUS_DETAIL="Database is accessible and functional"
else
    DB_STATUS="❌ NOT ACCESSIBLE"
    DB_STATUS_DETAIL="Database connection failed - setup may be needed"
fi

echo
echo "🔍 TEST EXECUTION STATUS:"
echo "   ✅ Environment detection: COMPLETED"
echo "   ✅ Database type identification: COMPLETED"
echo "   ✅ Connection validation: COMPLETED"
echo "   ✅ Schema verification: COMPLETED"
echo "   ✅ Data availability check: COMPLETED"
echo "   ✅ SQLx CLI testing: COMPLETED"
echo "   ✅ Local database testing: COMPLETED"
echo
echo "🗄️  DATABASE CONNECTIVITY STATUS:"
echo "   Type: $DATABASE_TYPE"
echo "   Status: $DB_STATUS"
echo "   Details: $DB_STATUS_DETAIL"
echo
echo "📋 DETAILED RESULTS:"
echo "   Primary DB Connection: $([ -n "$TABLES" ] && echo "✅ Working" || echo "❌ Failed")"
echo "   Tables Found: $([ -n "$TABLES" ] && echo "✅ $TABLE_COUNT tables" || echo "❌ No tables accessible")"
echo "   Local DB Available: $([ "$LOCAL_CONNECTION_FOUND" = true ] && echo "✅ Yes" || echo "❌ No")"
echo "   SQLx CLI: $(command_exists "sqlx" && echo "✅ Available" || echo "❌ Not installed")"
echo
echo "🔒 SAFETY GUARANTEE:"
echo "   Your database remains completely unchanged"
echo "   All operations were performed in read-only mode"
echo

# Provide next steps
if [ -n "$TABLES" ] || [ "$LOCAL_CONNECTION_FOUND" = true ]; then
    print_success "🎉 DATABASE IS WORKING!"
    echo
    echo "✅ Your database connection is successful"
    echo "✅ You can proceed with MoneyWise setup"
    echo
    echo "💡 Next steps:"
    echo "   ./setup.sh                    # Run full setup"
    echo "   cd moneywise-backend && ./setup.sh  # Backend setup only"
else
    print_warning "⚠️  DATABASE CONNECTION ISSUES DETECTED"
    echo
    echo "❌ Your database is not currently accessible"
    echo "❌ This will prevent MoneyWise from working properly"
    echo
    echo "🔧 REQUIRED ACTIONS:"
    if [ "$DATABASE_TYPE" = "supabase" ]; then
        echo "   1. Check your Supabase credentials in .env file"
        echo "   2. Verify network connectivity to Supabase"
        echo "   3. Ensure Supabase project is active"
        echo "   4. Or switch to local database if preferred"
    else
        echo "   1. Start your local PostgreSQL service"
        echo "   2. Check database credentials in .env file"
        echo "   3. Ensure database exists and is accessible"
    fi
    echo
    echo "💡 Alternative: Use local database for development"
    echo "   - Install PostgreSQL locally"
    echo "   - Update .env file with local connection"
    echo "   - Run database setup scripts"
    echo
    echo "⚠️  DO NOT PROCEED with MoneyWise setup until database is accessible"
fi

echo
echo "📝 TEST EXECUTION: COMPLETED SUCCESSFULLY"
echo "   (This means the test script ran without errors)"
echo "   (It does NOT mean your database is working)"