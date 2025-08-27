#!/bin/bash

# MoneyWise Quick Setup Check
# Provides a fast overview of your MoneyWise setup status
# Checks: scripts, database, backend, and frontend without running full tests
# Fast status check (under 30 seconds) - safe to run anytime

# Load core utilities directly
QUICK_CHECK_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load output utilities first
OUTPUT_UTILS="$QUICK_CHECK_SCRIPT_DIR/core/output-utils.sh"
if [ ! -f "$OUTPUT_UTILS" ]; then
    echo "❌ Error: Output utilities not found at $OUTPUT_UTILS"
    exit 1
fi
source "$OUTPUT_UTILS"

# Load other utilities directly
CHECK_UTILS="$QUICK_CHECK_SCRIPT_DIR/core/check-utils.sh"
COMMAND_UTILS="$QUICK_CHECK_SCRIPT_DIR/core/command-utils.sh"
ENV_UTILS="$QUICK_CHECK_SCRIPT_DIR/core/env-utils.sh"

# Check if utilities exist before sourcing
if [ ! -f "$CHECK_UTILS" ] || [ ! -f "$COMMAND_UTILS" ] || [ ! -f "$ENV_UTILS" ]; then
    print_error "One or more utility files not found"
    print_warning "Please ensure all utility files exist in scripts/core/"
    exit 1
fi

# Source utilities with individual error checking
source "$CHECK_UTILS" || { print_error "Failed to load check-utils.sh"; exit 1; }
source "$COMMAND_UTILS" || { print_error "Failed to load command-utils.sh"; exit 1; }
source "$ENV_UTILS" || { print_error "Failed to load env-utils.sh"; exit 1; }

echo "🔍 MoneyWise Quick Setup Check"
echo "=============================="
echo "Fast status overview of your MoneyWise project"
echo

# Reset status counters
reset_status_counters

# Check setup scripts
check_setup_scripts() {
    local project_root="$QUICK_CHECK_SCRIPT_DIR/.."
    local root_setup="$project_root/setup.sh"
    local backend_setup="$project_root/moneywise-backend/setup.sh"

    check_file_exists "$root_setup" "Root setup script" true
    check_file_exists "$backend_setup" "Backend setup script" true
}

# Check backend status
check_backend_status() {
    local project_root="$QUICK_CHECK_SCRIPT_DIR/.."
    local cargo_toml="$project_root/moneywise-backend/Cargo.toml"

    if check_file_exists "$cargo_toml" "Cargo.toml" true; then
        print_status "Testing backend compilation..."
        if cargo check --quiet --manifest-path "$cargo_toml" > /dev/null 2>&1; then
            print_success "Backend compiles successfully"
            increment_good
        else
            print_warning "Backend has compilation issues"
            increment_warn
        fi
    fi
}

# Check frontend status
check_frontend_status() {
    local project_root="$QUICK_CHECK_SCRIPT_DIR/.."
    local package_json="$project_root/moneywise-app/package.json"
    local node_modules="$project_root/moneywise-app/node_modules"

    if check_file_exists "$package_json" "package.json" true; then
        check_dir_exists "$node_modules" "Dependencies" false
    fi
}

# Check database status
check_database_status() {
    local project_root="$QUICK_CHECK_SCRIPT_DIR/.."
    local env_file="$project_root/moneywise-backend/.env"

    if check_file_exists "$env_file" "Environment file" false; then
        local database_url
        database_url=$(extract_env_value "$env_file" "DATABASE_URL")

        if [ -n "$database_url" ]; then
            print_success "Database URL configured"
            increment_good
        else
            print_warning "Database URL not configured"
            increment_warn
        fi
    fi
}

# Check system dependencies
check_system_dependencies() {
    local deps=("cargo" "psql" "redis-cli")
    for dep in "${deps[@]}"; do
        check_command_exists "$dep" "$dep" false
    done
}

# Check project structure
check_project_structure() {
    local project_root="$QUICK_CHECK_SCRIPT_DIR/.."
    local required_dirs=(
        "moneywise-backend/src"
        "moneywise-backend/database"
        "moneywise-app/src"
        "scripts"
    )

    for dir in "${required_dirs[@]}"; do
        check_dir_exists "$project_root/$dir" "$dir" true
    done
}

# Run all checks
print_section_header "Project Status Check"

print_status "Checking setup scripts..."
check_setup_scripts

print_status "Checking backend status..."
check_backend_status

print_status "Checking frontend status..."
check_frontend_status

print_status "Checking database status..."
check_database_status

print_status "Checking system dependencies..."
check_system_dependencies

print_status "Checking project structure..."
check_project_structure

# Print summary and recommendations
print_status_summary "Quick Check Summary" true

echo
echo "🔒 Your current environment remains unchanged"
echo "💡 Run './scripts/testing/run-all-tests.sh' for detailed testing"