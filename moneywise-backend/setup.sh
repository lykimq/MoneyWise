#!/bin/bash

# MoneyWise Backend Setup Script
# Sets up backend service with database structure for both Supabase and local PostgreSQL

# Load core utilities
BACKEND_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$BACKEND_SCRIPT_DIR/../scripts/core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load additional utilities
SETUP_UTILS="$BACKEND_SCRIPT_DIR/../scripts/core/setup-utils.sh"
CHECK_UTILS="$BACKEND_SCRIPT_DIR/../scripts/core/check-utils.sh"
SERVICE_UTILS="$BACKEND_SCRIPT_DIR/../scripts/core/service-utils.sh"
ENV_UTILS="$BACKEND_SCRIPT_DIR/../scripts/core/env-utils.sh"
COMMAND_UTILS="$BACKEND_SCRIPT_DIR/../scripts/core/command-utils.sh"

source "$SETUP_UTILS"
source "$CHECK_UTILS"
source "$SERVICE_UTILS"
source "$ENV_UTILS"
source "$COMMAND_UTILS"

echo "🚀 MoneyWise Backend Setup"
echo "========================="
echo

# Check prerequisites
if ! is_prereqs_checked; then
    print_warning "Prerequisites not verified by root script"
    print_status "Running prerequisite check for standalone execution..."
    check_all_prerequisites || exit 1
else
    print_success "Prerequisites already verified by root script"
fi

# Verify backend structure
if ! check_file_exists "$BACKEND_SCRIPT_DIR/Cargo.toml" "Cargo.toml" true; then
    print_error "Please run this script from the moneywise-backend directory"
    print_warning "This indicates we're not in a Rust project"
    exit 1
fi

print_success "Backend project structure verified"

# Setup environment
print_status "Setting up environment..."

# Create environment file if it doesn't exist
if ! check_file_exists "$BACKEND_SCRIPT_DIR/.env" "Environment file" false; then
    print_status "Creating environment file from template..."

    if check_file_exists "$BACKEND_SCRIPT_DIR/env.example" "Environment template" true; then
        create_default_env "$BACKEND_SCRIPT_DIR/.env" "$BACKEND_SCRIPT_DIR/env.example"
        print_warning "⚠️  IMPORTANT: Please edit .env file with your database credentials"
        print_warning "   - For Supabase: Update DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY"
        print_warning "   - For local: Update DATABASE_URL to point to local PostgreSQL"
        print_warning "   - Then run this script again"
        exit 1
    else
        exit 1
    fi
fi

# Load environment variables
load_env_file "$BACKEND_SCRIPT_DIR/.env" || exit 1

# Detect database environment
DATABASE_URL=$(extract_env_value "$BACKEND_SCRIPT_DIR/.env" "DATABASE_URL")
if [[ "$DATABASE_URL" == *"supabase.com"* ]] || [[ "$DATABASE_URL" == *"supabase.co"* ]]; then
    DATABASE_TYPE="supabase"
    print_success "Detected Supabase database environment"
elif [[ "$DATABASE_URL" == *"localhost"* ]] || [[ "$DATABASE_URL" == *"127.0.0.1"* ]]; then
    DATABASE_TYPE="local"
    print_success "Detected local database environment"
else
    print_warning "Unknown database environment - assuming Supabase"
    DATABASE_TYPE="supabase"
fi

echo

# Local service management
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

# Setup database
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

# Install SQLx CLI
print_status "Setting up SQLx CLI..."

if ! command_exists "sqlx"; then
    print_status "Installing SQLx CLI (this may take a few minutes)..."

    # Install SQLx CLI with PostgreSQL features only
    if cargo install sqlx-cli --no-default-features --features postgres; then
        print_success "SQLx CLI installed"
    else
        print_error "Failed to install SQLx CLI"
        print_warning "This may be due to network issues or Rust toolchain problems"
        exit 1
    fi
else
    print_success "SQLx CLI already installed"
fi

echo

# Run migrations
print_status "Running database migrations..."

if ! sqlx migrate run; then
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
fi

print_success "Database migrations completed"

# Verify schema
print_status "Verifying database schema..."

# Use shared database utilities for schema verification
if ! verify_database_schema "$DATABASE_URL"; then
    print_error "Schema verification failed"
    exit 1
fi

echo

# Build project
print_status "Building the project..."

if ! cargo build; then
    print_error "Failed to build the project"
    print_warning "This may indicate code compilation errors"
    print_warning "Check the error messages above for specific issues"
    exit 1
fi

print_success "Project built successfully"

echo
print_success "🎉 Setup complete!"
echo
echo "The backend will be available at: http://localhost:3000"
echo "API endpoints will be at: http://localhost:3000/api/*"
echo
print_status "Starting the server..."

# Start server
# Start the server in the background for testing
cargo run &
SERVER_PID=$!

# Wait for server to start
print_status "Waiting for server to start..."
sleep 5

# Test API endpoints
print_status "Testing API endpoints..."

# Test overview endpoint
if curl -s "http://localhost:3000/api/budgets/overview" > /dev/null 2>&1; then
    print_success "Overview endpoint working"
else
    print_warning "Overview endpoint not responding"
fi

# Test main budgets endpoint
if curl -s "http://localhost:3000/api/budgets" > /dev/null 2>&1; then
    print_success "Budgets endpoint working"
else
    print_warning "Budgets endpoint not responding"
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