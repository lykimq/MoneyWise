#!/bin/bash

# MoneyWise Setup Utilities - Main Orchestrator
# Orchestrates all specialized setup modules for MoneyWise
# Provides: unified interface, module management, and utility functions

# Module paths for consistent loading across scripts
# Use a more reliable method to get script directory when sourced
if [ -n "${BASH_SOURCE[0]}" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
fi



# Core modules
OUTPUT_UTILS="$SCRIPT_DIR/output-utils.sh"
PREREQ_CHECKER="$SCRIPT_DIR/../setup/prereq-checker.sh"
SERVICE_MANAGER="$SCRIPT_DIR/../setup/service-manager.sh"
DATABASE_UTILS="$SCRIPT_DIR/../database/database-utils.sh"

# Module loading functions with error handling and validation
load_module() {
    local module_path="$1"
    local module_name="$2"

    if [ ! -f "$module_path" ]; then
        print_error "$module_name module not found at $module_path"
        print_warning "Please ensure all setup modules are present in the scripts/core/, scripts/setup/, and scripts/database/ directories"
        return 1
    fi

    if source "$module_path"; then
        return 0
    else
        print_error "Failed to load $module_name module from $module_path"
        return 1
    fi
}

# Load all core modules with status reporting
load_all_modules() {
    print_status "Loading setup modules..."

    local failed=0

    # Output utilities are already loaded by the initialization block
    # Load prerequisite checker
    if ! load_module "$PREREQ_CHECKER" "Prerequisites Checker"; then
        failed=1
    fi

    # Load service manager
    if ! load_module "$SERVICE_MANAGER" "Service Manager"; then
        failed=1
    fi

    # Load database utilities
    if ! load_module "$DATABASE_UTILS" "Database Utilities"; then
        failed=1
    fi

    if [ $failed -eq 0 ]; then
        print_success "All setup modules loaded successfully"
        return 0
    else
        print_error "Failed to load some setup modules"
        return 1
    fi
}

# Utility functions for common operations across setup scripts
file_exists() {
    [ -f "$1" ]
}

# Safe directory change with return to original
safe_cd() {
    local target_dir="$1"
    local original_dir="$(pwd)"

    if cd "$target_dir"; then
        echo "$original_dir"  # Return original directory for restoration
    else
        print_error "Failed to change to directory: $target_dir"
        return 1
    fi
}

# Restore to original directory
restore_cd() {
    local original_dir="$1"
    cd "$original_dir"
}

# Project structure verification to ensure scripts are run from correct locations
# Prevents errors due to wrong working directory
verify_project_structure() {
    if [ ! -d "moneywise-backend" ] || [ ! -d "moneywise-app" ]; then
        print_error "Please run this script from the MoneyWise project root directory"
        print_warning "Expected structure: MoneyWise/{moneywise-backend, moneywise-app}"
        print_warning "This ensures the script can find all necessary components"
        return 1
    fi
    print_success "Project structure verified"
    return 0
}

# Initialization to ensure all modules are loaded when this script is sourced
# Provides immediate access to all setup functions

# Auto-load modules when script is sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    # Script is being sourced, load modules automatically
    # First, load output utilities to get print functions
    if ! load_module "$OUTPUT_UTILS" "Output Utilities"; then
        echo "❌ Error: Failed to load Output Utilities module"
        return 1
    fi

    # Now we can use print functions to load other modules
    if load_all_modules; then
        print_success "Setup utilities initialized successfully"
    else
        print_error "Failed to initialize setup utilities"
        return 1
    fi
fi
