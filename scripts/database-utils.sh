#!/bin/bash

# =============================================================================
# MoneyWise Database Utilities - Main Orchestrator
# =============================================================================
# This script orchestrates all specialized database modules for MoneyWise.
# It provides: unified interface, module management, and high-level database functions.
#
# Why this approach?
# - Modular design separates concerns for better maintainability
# - Each module focuses on specific database functionality
# - Easy to extend with new database features
# - Centralized orchestration for consistency
# =============================================================================

# =============================================================================
# MODULE PATHS
# =============================================================================
# Why define module paths? Ensures consistent module loading across scripts.
# This makes it easy to add new modules or reorganize existing ones.
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Database modules
ENV_MANAGER="$SCRIPT_DIR/env-manager.sh"
DB_OPERATIONS="$SCRIPT_DIR/db-operations.sh"
SCHEMA_MANAGER="$SCRIPT_DIR/schema-manager.sh"

# =============================================================================
# MODULE LOADING FUNCTIONS
# =============================================================================
# Why module loading functions? Provides error handling and validation.
# This ensures all required modules are available before proceeding.
# =============================================================================

# Load a module with error checking
load_module() {
    local module_path="$1"
    local module_name="$2"

    if [ ! -f "$module_path" ]; then
        echo "❌ Error: $module_name module not found at $module_path"
        echo "Please ensure all database modules are present in the scripts/ directory"
        return 1
    fi

    if source "$module_path"; then
        return 0
    else
        echo "❌ Error: Failed to load $module_name module from $module_path"
        return 1
    fi
}

# Load all database modules
load_all_modules() {
    print_status "Loading database modules..."

    local failed=0

    # Load environment manager
    if ! load_module "$ENV_MANAGER" "Environment Manager"; then
        failed=1
    fi

    # Load database operations
    if ! load_module "$DB_OPERATIONS" "Database Operations"; then
        failed=1
    fi

    # Load schema manager
    if ! load_module "$SCHEMA_MANAGER" "Schema Manager"; then
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

# =============================================================================
# COMPREHENSIVE DATABASE SETUP
# =============================================================================
# Why comprehensive setup? Provides a single interface for all database operations.
# This makes it easy to set up the complete database environment.
# =============================================================================

# Setup complete database environment
setup_database_environment() {
    local env_file="$1"
    local database_name="$2"

    print_section_header "Database Environment Setup"

    local failed=0

    # Create environment file if it doesn't exist
    if ! create_default_env "$env_file"; then
        failed=1
    fi

    # Load environment variables
    if ! load_env_file "$env_file"; then
        failed=1
    fi

    # Extract database name from environment if not provided
    if [ -z "$database_name" ] && [ -n "$DATABASE_URL" ]; then
        database_name=$(extract_database_name "$DATABASE_URL")
        print_info "Extracted database name: $database_name"
    fi

    # Create database if it doesn't exist
    if [ -n "$database_name" ]; then
        if ! create_database "$database_name"; then
            failed=1
        fi
    else
        print_warning "No database name specified - skipping database creation"
    fi

    # Test database connection
    if [ -n "$DATABASE_URL" ]; then
        if ! test_database_connection "$DATABASE_URL"; then
            failed=1
        fi
    else
        print_warning "No DATABASE_URL found - skipping connection test"
    fi

    print_separator

    if [ $failed -eq 0 ]; then
        print_success "Database environment setup completed successfully"
    else
        print_error "Database environment setup encountered issues"
        print_warning "Please check the error messages above"
    fi

    return $failed
}

# =============================================================================
# INITIALIZATION
# =============================================================================
# Why initialization? Ensures all modules are loaded when this script is sourced.
# This provides immediate access to all database functions.
# =============================================================================

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
