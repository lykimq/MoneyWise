#!/bin/bash

# MoneyWise Setup Utilities
# Provides common setup functionality for all setup scripts
# Handles: project verification, service management, and database setup

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load additional utilities
SERVICE_UTILS="$SCRIPT_DIR/service-utils.sh"
COMMAND_UTILS="$SCRIPT_DIR/command-utils.sh"
ENV_UTILS="$SCRIPT_DIR/env-utils.sh"
CHECK_UTILS="$SCRIPT_DIR/check-utils.sh"

source "$SERVICE_UTILS"
source "$COMMAND_UTILS"
source "$ENV_UTILS"
source "$CHECK_UTILS"

# Database setup functions
setup_database_environment() {
    local env_file="$1"
    local db_name="$2"

    print_status "Setting up database environment..."

    # Create database if it doesn't exist
    if ! psql -lqt | cut -d \| -f 1 | grep -qw "$db_name"; then
        print_status "Creating database '$db_name'..."
        if createdb "$db_name" 2>/dev/null; then
            print_success "Database '$db_name' created successfully"
        else
            print_error "Failed to create database '$db_name'"
            return 1
        fi
    else
        print_success "Database '$db_name' already exists"
    fi

    return 0
}

# Test database connection
test_database_connection() {
    local database_url="$1"
    local timeout_seconds="${2:-10}"

    print_status "Testing database connection..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    if timeout "$timeout_seconds" psql "$database_url" -c "SELECT 1;" >/dev/null 2>&1; then
        print_success "Database connection successful"
        return 0
    else
        print_error "Database connection failed"
        print_warning "Check:"
        print_warning "1. PostgreSQL service is running"
        print_warning "2. Database exists"
        print_warning "3. Credentials are correct"
        print_warning "4. Network connectivity"
        return 1
    fi
}

# Verify database schema
verify_database_schema() {
    local database_url="$1"

    print_status "Verifying database schema..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    # Check if the budgets table has UUID columns (indicates proper schema creation)
    local budget_table_check
    budget_table_check=$(psql "$database_url" -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='budgets' AND column_name='id';" -t 2>/dev/null | grep -c "uuid" || echo "0")

    if [ "$budget_table_check" -gt 0 ]; then
        print_success "UUID schema verified successfully"

        # Check if sample data was inserted
        local sample_data_check
        sample_data_check=$(psql "$database_url" -c "SELECT COUNT(*) FROM budgets;" -t 2>/dev/null | tr -d ' ' || echo "0")
        if [ "$sample_data_check" -gt 0 ]; then
            print_success "Sample budget data found ($sample_data_check entries)"
        else
            print_warning "No sample data found - this may be expected"
        fi

        return 0
    else
        print_error "Schema verification failed - UUID columns not found"
        print_warning "This suggests the migration didn't complete properly"
        return 1
    fi
}

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    print_success "Setup utilities initialized successfully"
fi