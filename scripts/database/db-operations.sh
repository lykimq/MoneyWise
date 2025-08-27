#!/bin/bash

# MoneyWise Database Operations
# Handles core database operations for MoneyWise
# Manages: database creation, connection testing, and basic operations

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
SETUP_UTILS="$SCRIPT_DIR/../core/setup-utils.sh"
CHECK_UTILS="$SCRIPT_DIR/../core/check-utils.sh"
COMMAND_UTILS="$SCRIPT_DIR/../core/command-utils.sh"

source "$SETUP_UTILS"
source "$CHECK_UTILS"
source "$COMMAND_UTILS"

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    print_success "Database operations utilities initialized successfully"
fi