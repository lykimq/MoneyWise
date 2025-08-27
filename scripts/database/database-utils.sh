#!/bin/bash

# MoneyWise Database Utilities - Main Orchestrator
# Orchestrates all specialized database modules for MoneyWise
# Provides: unified interface and module management

# Load core utilities
DB_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$DB_SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Database modules to load
DB_OPERATIONS="$DB_SCRIPT_DIR/db-operations.sh"
SCHEMA_MANAGER="$DB_SCRIPT_DIR/schema-manager.sh"

# Initialize database modules
initialize_database() {
    local database_modules=(
        "$DB_OPERATIONS"
        "$SCHEMA_MANAGER"
    )

    load_modules "Database" "${database_modules[@]}"
}

# Auto-load modules when script is sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    # Script is being sourced
    if initialize_database; then
        print_success "Database utilities initialized successfully"
    else
        print_error "Failed to initialize database utilities"
        return 1
    fi
fi