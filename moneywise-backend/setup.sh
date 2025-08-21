#!/bin/bash

# =============================================================================
# MoneyWise Backend Setup Script
# =============================================================================
# This script automates the complete setup of the MoneyWise backend service.
# It handles: services, database, migrations, and testing.
#
# Why this approach?
# - Automated setup reduces human error and setup time
# - Service management handles different OS environments (Linux/macOS)
# - Database verification ensures data integrity
# - API testing validates the complete setup
#
# Note: Prerequisites are checked by the root script, so this script
# focuses on backend-specific setup tasks.
# =============================================================================

set -e  # Exit immediately if any command fails (fail-fast approach)

# =============================================================================
# SOURCE SHARED UTILITIES
# =============================================================================
# Why source utilities? Eliminates code duplication and centralizes maintenance.
# The utilities script provides all common functions and service management.
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UTILS_SCRIPT="$SCRIPT_DIR/../scripts/setup-utils.sh"

if [ ! -f "$UTILS_SCRIPT" ]; then
    echo "❌ Error: Shared utilities script not found at $UTILS_SCRIPT"
    echo "Please ensure the scripts/setup-utils.sh file exists"
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
# Why check if prerequisites were already verified? Prevents redundant checking
# when called from the root script, improving efficiency and user experience.
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
# Why check Cargo.toml? Ensures we're in a Rust project directory.
# This prevents running the script from the wrong location.
# =============================================================================
if [ ! -f "Cargo.toml" ]; then
    print_error "Please run this script from the moneywise-backend directory"
    print_warning "Cargo.toml not found - this indicates we're not in a Rust project"
    exit 1
fi

print_success "Backend project structure verified"

# =============================================================================
# SERVICE MANAGEMENT
# =============================================================================
# Why auto-start services? Users often forget to start services.
# The utilities script handles different OS environments automatically.
# =============================================================================
print_status "Starting required services..."

# Start PostgreSQL service
start_postgresql || exit 1

# Start Redis service (optional)
start_redis

echo

# =============================================================================
# DATABASE ENVIRONMENT SETUP
# =============================================================================
# Why use database utilities? Provides consistent database operations.
# This includes environment file creation, database setup, and verification.
# =============================================================================
print_status "Setting up database environment..."

# Setup complete database environment using shared utilities
if ! setup_database_environment ".env" "moneywise"; then
    print_error "Database environment setup failed"
    exit 1
fi

echo

# =============================================================================
# SQLX CLI INSTALLATION
# =============================================================================
# Why install SQLx CLI? It's required to run database migrations.
# SQLx is the Rust SQL toolkit that handles database operations.
# =============================================================================
print_status "Setting up SQLx CLI..."
if ! command -v sqlx &> /dev/null; then
    print_status "Installing SQLx CLI (this may take a few minutes)..."

    # Install SQLx CLI with PostgreSQL features only
    # Why --no-default-features --features postgres?
    # - Reduces installation time by excluding unnecessary database drivers
    # - Ensures compatibility with our PostgreSQL setup
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
# Why run migrations? They create the database schema and load initial data.
# Migrations ensure the database structure matches the application requirements.
# =============================================================================
print_status "Running database migrations..."
sqlx migrate run || {
    print_error "Failed to run migrations"
    print_warning "Please check:"
    print_warning "1. DATABASE_URL in .env is correct"
    print_warning "2. PostgreSQL is accessible"
    print_warning "3. Database exists and has proper permissions"
    print_warning "4. Migration files are present in migrations/ directory"
    exit 1
}
print_success "Database migrations completed"

# =============================================================================
# SCHEMA VERIFICATION
# =============================================================================
# Why verify schema? Ensures migrations actually created the expected structure.
# This catches issues early rather than when the application tries to run.
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
# Why build the project? Ensures the code compiles without errors.
# Catches compilation issues before trying to run the application.
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
# Why start server in background? Allows us to test it while keeping it running.
# Background process with PID tracking enables proper cleanup.
# =============================================================================
# Start the server in the background for testing
# Why background? We want to test the server while keeping it running.
# The & operator runs the command in the background.
cargo run &
SERVER_PID=$!  # Store the process ID for later management

# Wait for server to start
# Why wait? Servers need time to bind to ports and initialize.
# 5 seconds is usually sufficient for a Rust web server.
print_status "Waiting for server to start..."
sleep 5

# =============================================================================
# API ENDPOINT TESTING
# =============================================================================
# Why test endpoints? Verifies the complete setup works end-to-end.
# API testing ensures the server is responding correctly.
# =============================================================================
print_status "Testing API endpoints..."

# Test overview endpoint
# Why curl? It's a standard tool for testing HTTP endpoints.
# Silent mode (-s) reduces output noise during testing.
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
echo "- Real data exported from production database"
echo
echo "Next Steps:"
echo "1. Keep this terminal open (server is running)"
echo "2. In another terminal: cd ../moneywise-app && npm install && npm start"
echo "3. Test the React Native app with the budget data"
echo
print_warning "Press Ctrl+C to stop the server"

# =============================================================================
# SERVER MANAGEMENT
# =============================================================================
# Why wait for PID? Ensures the script doesn't exit while the server is running.
# wait command blocks until the background process completes.
# =============================================================================
# Keep the server running in the foreground
# Why wait? Prevents the script from exiting while the server is running.
# The wait command blocks until the background process (SERVER_PID) completes.
wait $SERVER_PID