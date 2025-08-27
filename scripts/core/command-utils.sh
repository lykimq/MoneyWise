#!/bin/bash

# MoneyWise Command Utilities
# Provides common command checking functions
# Handles: command availability

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Check if a command exists
command_exists() {
    local cmd="$1"
    command -v "$cmd" &> /dev/null
}

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    print_success "Command utilities initialized successfully"
fi
