#!/bin/bash

# MoneyWise Database Utilities - Main Orchestrator
# Orchestrates all specialized database modules for MoneyWise
# Provides: unified interface, module management, and high-level database functions

# Module paths for consistent loading across scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Database modules
DB_OPERATIONS="$SCRIPT_DIR/db-operations.sh"
SCHEMA_MANAGER="$SCRIPT_DIR/schema-manager.sh"

# Module loading functions with error handling and validation
load_database_module() {
    local module_path="$1"
    local module_name="$2"

    if [ ! -f "$module_path" ]; then
        print_error "$module_name module not found at $module_path"
        print_warning "Please ensure all database modules are present in the scripts/database/ directory"
        return 1
    fi

    if source "$module_path"; then
        return 0
    else
        print_error "Failed to load $module_name module from $module_path"
        return 1
    fi
}

# Load all database modules with status reporting
load_all_modules() {
    print_status "Loading database modules..."

    local failed=0

    # Load database operations
    if ! load_database_module "$DB_OPERATIONS" "Database Operations"; then
        failed=1
    fi

    # Load schema manager
    if ! load_database_module "$SCHEMA_MANAGER" "Schema Manager"; then
        failed=1
    fi

    if [ $failed -eq 0 ]; then
        print_success "All database modules loaded successfully"
        return 0
    else
        print_error "Failed to load some database modules"
        return 1
    fi
}



# Initialization to ensure all modules are loaded when this script is sourced
# Provides immediate access to all database functions

# Auto-load modules when script is sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    # Script is being sourced, load modules automatically
    if load_all_modules; then
        print_success "Database utilities initialized successfully"
    else
        print_error "Failed to initialize database utilities"
        return 1
    fi
fi
