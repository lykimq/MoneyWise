#!/bin/bash

# MoneyWise Path Utilities
# Provides consistent path resolution and directory operations across all scripts
# Handles: path resolution, directory navigation, and path validation

# Get the absolute path of the script directory
# Note: get_script_dir function is defined in module-loader.sh to avoid duplication
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source output utilities if not already loaded
if [ -z "$OUTPUT_UTILS" ]; then
    OUTPUT_UTILS="$SCRIPT_DIR/output-utils.sh"
    if [ ! -f "$OUTPUT_UTILS" ]; then
        echo "❌ Error: Output utilities not found at $OUTPUT_UTILS"
        exit 1
    fi
    source "$OUTPUT_UTILS"
fi

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

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    # Script is being sourced
    print_success "Path utilities initialized successfully"
fi
