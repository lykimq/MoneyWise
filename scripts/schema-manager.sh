#!/bin/bash

# =============================================================================
# MoneyWise Schema Manager
# =============================================================================
# This module handles database schema operations for MoneyWise.
# It manages: schema verification, migration support, and schema validation.
#
# Why this approach?
# - Focused responsibility for schema management
# - Reusable across different parts of the setup system
# - Easy to maintain and extend schema functionality
# =============================================================================

# =============================================================================
# SOURCE OUTPUT UTILITIES
# =============================================================================
# Why source output utilities? Provides consistent formatting and user experience.
# This module depends on the output utilities for all user communication.
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_UTILS="$SCRIPT_DIR/output-utils.sh"

if [ ! -f "$OUTPUT_UTILS" ]; then
    echo "❌ Error: Output utilities not found at $OUTPUT_UTILS"
    exit 1
fi

source "$OUTPUT_UTILS"

# =============================================================================
# SCHEMA VERIFICATION
# =============================================================================
# Why schema verification? Ensures the database is working correctly.
# This catches issues early rather than when the application tries to run.
# =============================================================================

# Verify database schema
verify_database_schema() {
    local database_url="$1"

    print_status "Verifying database schema..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    # Check if the budgets table has UUID columns (indicates proper schema creation)
    local budget_table_check=$(psql "$database_url" -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='budgets' AND column_name='id';" -t 2>/dev/null | grep -c "uuid" || echo "0")

    if [ "$budget_table_check" -gt 0 ]; then
        print_success "UUID schema verified successfully"

        # Check if sample data was inserted
        local sample_data_check=$(psql "$database_url" -c "SELECT COUNT(*) FROM budgets;" -t 2>/dev/null | tr -d ' ' || echo "0")
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
