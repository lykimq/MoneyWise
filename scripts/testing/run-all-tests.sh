#!/bin/bash

# MoneyWise Complete Test Suite Runner
# Runs all tests safely without affecting your current setup
# Executes: setup script tests, database tests, and provides a summary

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load additional utilities
TEST_UTILS="$SCRIPT_DIR/../core/test-utils.sh"
CHECK_UTILS="$SCRIPT_DIR/../core/check-utils.sh"
COMMAND_UTILS="$SCRIPT_DIR/../core/command-utils.sh"

source "$TEST_UTILS"
source "$CHECK_UTILS"
source "$COMMAND_UTILS"

echo "🧪 MoneyWise Complete Test Suite"
echo "================================"
echo "Running all tests safely without affecting your current setup"
echo

# Backend build test functions
test_backend_build() {
    cd "$SCRIPT_DIR/../../moneywise-backend" || return 1

    # Test Cargo.toml syntax
    if check_file_exists "Cargo.toml" "Cargo.toml" true; then
        if cargo check --quiet; then
            print_success "Cargo.toml is valid and dependencies are available"
            increment_good
        else
            print_error "Cargo.toml has issues or dependencies are missing"
            increment_error
        fi
    fi

    # Test if we can build without running
    if [ -f "Cargo.toml" ]; then
        print_status "Testing project compilation (dry run)..."
        if cargo check --quiet; then
            print_success "Project compiles successfully"
            increment_good
        else
            print_error "Project has compilation errors"
            increment_error
        fi
    fi

    cd - > /dev/null || return 1
}

# Frontend test functions
test_frontend_dependencies() {
    cd "$SCRIPT_DIR/../../moneywise-app" || return 1

    if check_file_exists "package.json" "package.json" true; then
        # Check if node_modules exists and is valid
        if check_dir_exists "node_modules" "node_modules directory" false; then
            # Test if key dependencies are available
            if [ -d "node_modules/react" ] && [ -d "node_modules/expo" ]; then
                print_success "Core dependencies (React, Expo) are available"
                increment_good
            else
                print_warning "Some core dependencies may be missing"
                increment_warn
            fi
        fi

        # Validate package.json syntax
        if node -e "JSON.parse(require('fs').readFileSync('package.json'))" > /dev/null 2>&1; then
            print_success "package.json syntax is valid"
            increment_good
        else
            print_error "package.json has syntax errors"
            increment_error
        fi
    fi

    cd - > /dev/null || return 1
}

# Project structure test functions
test_project_structure() {
    print_status "Validating project structure..."

    # Check for required directories and files
    local required_structure=(
        "setup.sh"
        "moneywise-backend/"
        "moneywise-backend/setup.sh"
        "moneywise-backend/Cargo.toml"
        "moneywise-backend/src/"
        "moneywise-app/"
        "moneywise-app/package.json"
        "scripts/"
        "scripts/core/setup-utils.sh"
    )

    for item in "${required_structure[@]}"; do
        if [ -e "$SCRIPT_DIR/../../$item" ]; then
            print_success "$item exists"
            increment_good
        else
            print_error "$item is missing"
            increment_error
        fi
    done
}

# Run all test sections
run_test "Setup Scripts Test" \
    "$SCRIPT_DIR/test-setup-scripts.sh" \
    "Validates syntax, dependencies, and structure of all setup scripts"

run_test "Database Connection Test" \
    "$SCRIPT_DIR/test-database-connection.sh" \
    "Tests database connectivity and schema without making changes"

run_test_section "Backend Build Test (Safe)" test_backend_build
run_test_section "Frontend Dependencies Test" test_frontend_dependencies
run_test_section "Project Structure Validation" test_project_structure

# Print final summary
print_test_summary "Test Suite Complete!" true

echo
echo "🔒 Your current setup remains completely unchanged"
echo "📝 All tests were performed in safe, read-only mode"
echo
print_success "Test suite completed successfully!"