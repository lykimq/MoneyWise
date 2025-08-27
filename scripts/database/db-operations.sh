#!/bin/bash

# MoneyWise Database Operations
# Handles core database operations for MoneyWise
# Manages: database creation, connection testing, and basic operations

# Source output utilities for consistent formatting
# Use the path provided by setup-utils.sh if available, otherwise fall back to local path
if [ -z "$OUTPUT_UTILS" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    OUTPUT_UTILS="$SCRIPT_DIR/../core/output-utils.sh"
fi

if [ ! -f "$OUTPUT_UTILS" ]; then
    echo "❌ Error: Output utilities not found at $OUTPUT_UTILS"
    exit 1
fi

source "$OUTPUT_UTILS"

# Database operations for core database setup tasks
# Includes creation, verification, and basic operations

# Check if database exists
database_exists() {
    local database_name="$1"

    if psql -lqt | cut -d \| -f 1 | grep -qw "$database_name"; then
        return 0  # Database exists
    else
        return 1  # Database doesn't exist
    fi
}

# Create database
create_database() {
    local database_name="$1"

    print_status "Creating database '$database_name'..."

    if database_exists "$database_name"; then
        print_success "Database '$database_name' already exists"
        return 0
    fi

    # Create the database using PostgreSQL utility
    # createdb handles permissions and basic setup automatically
    if createdb "$database_name" 2>/dev/null; then
        print_success "Database '$database_name' created successfully"
        return 0
    else
        print_error "Failed to create database '$database_name'"
        print_warning "This may be due to:"
        print_warning "1. Insufficient PostgreSQL permissions"
        print_warning "2. PostgreSQL service not running"
        print_warning "3. Invalid database name"
        print_info "Try creating manually: createdb $database_name"
        return 1
    fi
}

# Test database connection
test_database_connection() {
    local database_url="$1"

    print_status "Testing database connection..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    # Test basic connection
    if psql "$database_url" -c "SELECT 1;" >/dev/null 2>&1; then
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
