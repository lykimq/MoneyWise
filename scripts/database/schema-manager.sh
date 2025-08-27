#!/bin/bash

# MoneyWise Schema Manager
# Handles database schema operations for MoneyWise
# Manages: schema verification, migration support, and schema validation

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Schema verification to ensure database is working correctly
# Catches issues early rather than when the application tries to run
# Note: verify_database_schema function is defined in setup-utils.sh to avoid duplication