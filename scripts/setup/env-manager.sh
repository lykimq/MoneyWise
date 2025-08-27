#!/bin/bash

# MoneyWise Environment Manager
# Handles environment file operations for MoneyWise
# Manages: .env file creation, loading, and configuration

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load environment utilities
ENV_UTILS="$SCRIPT_DIR/../core/env-utils.sh"
source "$ENV_UTILS"

# Note: Environment manager functions removed as they are not used anywhere in the codebase
# Functions removed: create_moneywise_env, load_moneywise_env
# These functions were not called by any scripts in the project