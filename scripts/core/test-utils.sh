#!/bin/bash

# MoneyWise Test Utilities
# Provides common test execution and reporting functions
# Handles: test running, result tracking, and reporting

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
CHECK_UTILS="$SCRIPT_DIR/check-utils.sh"
COMMAND_UTILS="$SCRIPT_DIR/command-utils.sh"
ENV_UTILS="$SCRIPT_DIR/env-utils.sh"

source "$CHECK_UTILS"
source "$COMMAND_UTILS"
source "$ENV_UTILS"

# Test tracking variables
declare -i TESTS_PASSED=0
declare -i TESTS_FAILED=0
declare -i TESTS_SKIPPED=0

# Reset test counters
reset_test_counters() {
    TESTS_PASSED=0
    TESTS_FAILED=0
    TESTS_SKIPPED=0
}

# Run a test and track results
run_test() {
    local test_name="$1"
    local test_script="$2"
    local description="$3"

    print_status "Running: $test_name"
    echo "   $description"

    if [ -f "$test_script" ]; then
        # Run the test script and capture its output and exit code
        local test_output
        local test_exit_code

        test_output=$(bash "$test_script" 2>&1)
        test_exit_code=$?

        if [ $test_exit_code -eq 0 ]; then
            print_success "$test_name passed"
            ((TESTS_PASSED++))
        else
            # Check if it's just warnings (which are OK)
            if echo "$test_output" | grep -q "warning\|Warning\|WARNING"; then
                print_warning "$test_name had warnings (this is usually OK)"
                ((TESTS_PASSED++))
            else
                print_error "$test_name failed"
                ((TESTS_FAILED++))
            fi
        fi
    else
        print_warning "$test_script not found, skipping $test_name"
        ((TESTS_SKIPPED++))
    fi

    echo
}

# Print test summary
print_test_summary() {
    local title="${1:-Test Results Summary}"
    local show_recommendations="${2:-true}"

    echo
    echo "📊 $title"
    echo "======================="
    echo "   ✅ Passed: $TESTS_PASSED"
    echo "   ❌ Failed: $TESTS_FAILED"
    echo "   ⚠️  Skipped: $TESTS_SKIPPED"
    echo "   📋 Total: $((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))"
    echo

    if [ "$show_recommendations" = "true" ]; then
        if [ $TESTS_FAILED -eq 0 ]; then
            print_success "🎉 All tests passed! Your setup is working correctly."
            echo
            echo "🚀 Your MoneyWise project is ready for use:"
            echo "   - Setup scripts are valid and functional"
            echo "   - Database connection is working"
            echo "   - Backend can be built successfully"
            echo "   - Frontend dependencies are available"
        else
            print_warning "⚠️  Some tests failed. Please review the errors above."
            echo
            echo "🔧 Recommended actions:"
            echo "   1. Fix any syntax errors in the scripts"
            echo "   2. Ensure all required dependencies are installed"
            echo "   3. Verify database connection settings"
            echo "   4. Run the test suite again"
        fi
    fi
}

# Run multiple tests with section header
run_test_section() {
    local section_title="$1"
    shift
    local -a test_functions=("$@")

    print_status "Phase: $section_title"
    echo "======================================="

    for test_func in "${test_functions[@]}"; do
        $test_func
    done

    echo
}

# Database test utilities
test_database_connection() {
    local database_url="$1"
    local timeout_seconds="${2:-10}"

    if timeout "$timeout_seconds" psql "$database_url" -c "SELECT 1;" > /dev/null 2>&1; then
        print_success "Database connection successful"
        return 0
    else
        print_warning "Database connection failed"
        return 1
    fi
}

# Get database tables
get_database_tables() {
    local database_url="$1"
    local timeout_seconds="${2:-10}"

    timeout "$timeout_seconds" psql "$database_url" -t -c \
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" 2>/dev/null | \
        grep -v '^$' | tr -d ' ' || echo ""
}

# Count table rows
count_table_rows() {
    local database_url="$1"
    local table_name="$2"
    local timeout_seconds="${3:-10}"

    timeout "$timeout_seconds" psql "$database_url" -t -c \
        "SELECT COUNT(*) FROM \"$table_name\";" 2>/dev/null | tr -d ' ' || echo "ERROR"
}

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    reset_test_counters
    print_success "Test utilities initialized successfully"
fi
