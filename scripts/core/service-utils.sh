#!/bin/bash

# MoneyWise Service Utilities
# Provides common service management functions across different platforms
# Handles: service detection, status checking, and cross-platform service operations

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Note: Service management functions removed as they are not used anywhere in the codebase
# Functions removed: detect_service_manager, manage_service, wait_for_service, check_service_status, get_service_start_command

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    print_success "Service utilities initialized successfully"
fi
