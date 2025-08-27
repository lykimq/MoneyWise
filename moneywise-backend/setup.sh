#!/bin/bash

# =============================================================================
# MoneyWise Backend Setup Script
# =============================================================================
# This script sets up the MoneyWise backend service with the new database structure.
# It works with both Supabase (production) and local PostgreSQL (development).
#
# Why this approach?
# - Simple and clear setup process
# - Works with the new modular database structure
# - Supports both Supabase and local development
# - Includes database migration and verification
# =============================================================================

set -e  # Exit immediately if any command fails

# =============================================================================
# SOURCE SHARED UTILITIES
# =============================================================================
BACKEND_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UTILS_SCRIPT="$BACKEND_SCRIPT_DIR/../scripts/core/setup-utils.sh"

if [ ! -f "$UTILS_SCRIPT" ]; then
    echo "❌ Error: Shared utilities script not found at $UTILS_SCRIPT"
    echo "Please ensure the scripts/core/setup-utils.sh file exists"
    exit 1
fi

# Source the utilities script to get all shared functions
source "$UTILS_SCRIPT"

echo "🚀 MoneyWise Backend Setup"
echo "========================="
echo

# =============================================================================
# PREREQUISITES VERIFICATION
# =============================================================================
if ! is_prereqs_checked; then
    print_warning "Prerequisites not verified by root script"
    print_status "Running prerequisite check for standalone execution..."
    check_all_prerequisites || exit 1
else
    print_success "Prerequisites already verified by root script"
fi

# =============================================================================
# VERIFY BACKEND PROJECT STRUCTURE
# =============================================================================
if [ ! -f "$BACKEND_SCRIPT_DIR/Cargo.toml" ]; then
    print_error "Please run this script from the moneywise-backend directory"
    print_warning "Cargo.toml not found - this indicates we're not in a Rust project"
    exit 1
fi

print_success "Backend project structure verified"

# =============================================================================
# ENVIRONMENT SETUP
# =============================================================================
print_status "Setting up environment..."

# Check if .env file exists
if [ ! -f "$BACKEND_SCRIPT_DIR/.env" ]; then
    print_warning "No .env file found"
    print_status "Creating environment file from template..."

    if [ -f "$BACKEND_SCRIPT_DIR/env.example" ]; then
        cp "$BACKEND_SCRIPT_DIR/env.example" "$BACKEND_SCRIPT_DIR/.env"
        print_warning "⚠️  IMPORTANT: Please edit .env file with your database credentials"
        print_warning "   - For Supabase: Update DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY"
        print_warning "   - For local: Update DATABASE_URL to point to local PostgreSQL"
        print_warning "   - Then run this script again"
        exit 1
    else
        print_error "No env.example template found"
        exit 1
    fi
fi

# Load environment variables
source "$BACKEND_SCRIPT_DIR/.env"

# Detect database environment
if [[ "$DATABASE_URL" == *"supabase.com"* ]] || [[ "$DATABASE_URL" == *"supabase.co"* ]]; then
    DATABASE_TYPE="supabase"
    print_success "✅ Detected Supabase database environment"
elif [[ "$DATABASE_URL" == *"localhost"* ]] || [[ "$DATABASE_URL" == *"127.0.0.1"* ]]; then
    DATABASE_TYPE="local"
    print_success "✅ Detected local database environment"
else
    print_warning "⚠️  Unknown database environment - assuming Supabase"
    DATABASE_TYPE="supabase"
fi

echo

# =============================================================================
# LOCAL SERVICE MANAGEMENT
# =============================================================================
if [ "$DATABASE_TYPE" = "local" ]; then
    print_status "Starting required services for local development..."

    # Start PostgreSQL service
    start_postgresql || exit 1

    # Start Redis service (optional)
    start_redis

    echo
else
    print_status "Skipping local service startup (using Supabase)"
    echo
fi

# =============================================================================
# DATABASE SETUP
# =============================================================================
if [ "$DATABASE_TYPE" = "local" ]; then
    print_status "Setting up local database environment..."

    # Setup complete database environment using shared utilities
    if ! setup_database_environment ".env" "moneywise"; then
        print_error "Local database environment setup failed"
        exit 1
    fi
else
    print_status "Verifying Supabase database connection..."

    # Test Supabase connection
    if ! test_database_connection "$DATABASE_URL"; then
        print_error "Supabase database connection failed"
        print_warning "Please check your DATABASE_URL in .env file"
        exit 1
    fi
    print_success "Supabase database connection verified"
fi

echo

# =============================================================================
# SQLX CLI INSTALLATION
# =============================================================================
print_status "Setting up SQLx CLI..."
if ! command -v sqlx &> /dev/null; then
    print_status "Installing SQLx CLI (this may take a few minutes)..."

    # Install SQLx CLI with PostgreSQL features only
    cargo install sqlx-cli --no-default-features --features postgres || {
        print_error "Failed to install SQLx CLI"
        print_warning "This may be due to network issues or Rust toolchain problems"
        exit 1
    }
    print_success "SQLx CLI installed"
else
    print_success "SQLx CLI already installed"
fi

echo

# =============================================================================
# DATABASE MIGRATIONS
# =============================================================================
print_status "Running database migrations..."
sqlx migrate run || {
    print_error "Failed to run migrations"
    print_warning "Please check:"
    print_warning "1. DATABASE_URL in .env is correct"
    if [ "$DATABASE_TYPE" = "local" ]; then
        print_warning "2. PostgreSQL is accessible"
        print_warning "3. Database exists and has proper permissions"
    else
        print_warning "2. Supabase connection is working"
        print_warning "3. Database credentials are correct"
    fi
    print_warning "4. Migration files are present in migrations/ directory"
    exit 1
}
print_success "Database migrations completed"

# =============================================================================
# SCHEMA VERIFICATION
# =============================================================================
print_status "Verifying database schema..."

# Use shared database utilities for schema verification
if ! verify_database_schema "$DATABASE_URL"; then
    print_error "Schema verification failed"
    exit 1
fi

echo

# =============================================================================
# PROJECT BUILD
# =============================================================================
print_status "Building the project..."
cargo build || {
    print_error "Failed to build the project"
    print_warning "This may indicate code compilation errors"
    print_warning "Check the error messages above for specific issues"
    exit 1
}
print_success "Project built successfully"

echo
print_success "🎉 Setup complete!"
echo
echo "The backend will be available at: http://localhost:3000"
echo "API endpoints will be at: http://localhost:3000/api/*"
echo
print_status "Starting the server..."

# =============================================================================
# SERVER STARTUP AND TESTING
# =============================================================================
# Start the server in the background for testing
cargo run &
SERVER_PID=$!

# Wait for server to start
print_status "Waiting for server to start..."
sleep 5

# =============================================================================
# API ENDPOINT TESTING
# =============================================================================
print_status "Testing API endpoints..."

# Test overview endpoint
if curl -s "http://localhost:3000/api/budgets/overview" > /dev/null 2>&1; then
    print_success "✅ Overview endpoint working"
else
    print_warning "⚠️ Overview endpoint not responding"
fi

# Test main budgets endpoint
if curl -s "http://localhost:3000/api/budgets" > /dev/null 2>&1; then
    print_success "✅ Budgets endpoint working"
else
    print_warning "⚠️ Budgets endpoint not responding"
fi

echo
print_success "🚀 MoneyWise Backend is running!"
echo
echo "API Test Commands:"
echo "curl \"http://localhost:3000/api/budgets/overview\""
echo "curl \"http://localhost:3000/api/budgets\""
echo "curl \"http://localhost:3000/api/budgets?month=12&year=2024\""
echo
echo "Sample Budget Data:"
echo "- 5 category groups: Housing, Utilities, Transportation, Food, Entertainment"
echo "- 10 categories: Rent, Utilities, Gas, Groceries, Dining Out, etc."
echo "- Budget data for December 2024 & August 2025 (USD currency)"
echo
echo "Next Steps:"
echo "1. Keep this terminal open (server is running)"
echo "2. In another terminal: cd ../moneywise-app && npm install && npm start"
echo "3. Test the React Native app with the budget data"
echo
print_warning "Press Ctrl+C to stop the server"

# Keep the server running
wait $SERVER_PID