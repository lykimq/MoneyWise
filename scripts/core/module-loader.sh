#!/bin/bash

# MoneyWise Module Loader
# Provides centralized module loading functionality for all MoneyWise scripts
# Handles: module discovery, loading, validation, and error reporting

# Get the absolute path of the script directory
get_script_dir() {
    if [ -n "${BASH_SOURCE[0]}" ]; then
        echo "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    else
        echo "$(cd "$(dirname "$0")" && pwd)"
    fi
}

SCRIPT_DIR="$(get_script_dir)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Core module paths
OUTPUT_UTILS="$SCRIPT_DIR/output-utils.sh"

# Load output utilities first as it's required by other modules
if [ ! -f "$OUTPUT_UTILS" ]; then
    echo "❌ Error: Output utilities not found at $OUTPUT_UTILS"
    exit 1
fi

source "$OUTPUT_UTILS"

# Module loading function with error handling and validation
load_module() {
    local module_path="$1"
    local module_name="$2"
    local module_type="${3:-Core}"  # Default to "Core" if not specified

    # Convert relative paths to absolute paths
    if [[ "$module_path" != /* ]]; then
        module_path="$SCRIPT_DIR/$module_path"
    fi

    if [ ! -f "$module_path" ]; then
        print_error "$module_name module not found at $module_path"
        print_warning "Please ensure all $module_type modules are present in their respective directories"
        return 1
    fi

    if source "$module_path"; then
        print_success "$module_name module loaded successfully"
        return 0
    else
        print_error "Failed to load $module_name module from $module_path"
        return 1
    fi
}

# Load multiple modules with status reporting
load_modules() {
    local module_type="$1"
    shift
    local -a module_paths=("$@")

    print_status "Loading $module_type modules..."
    local failed=0

    for module_path in "${module_paths[@]}"; do
        local module_name=$(basename "$module_path" .sh)
        if ! load_module "$module_path" "$module_name" "$module_type"; then
            failed=1
        fi
    done

    if [ $failed -eq 0 ]; then
        print_success "All $module_type modules loaded successfully"
        return 0
    else
        print_error "Failed to load some $module_type modules"
        return 1
    fi
}

# Verify project structure
verify_project_structure() {
    if [ ! -d "$PROJECT_ROOT/moneywise-backend" ] || [ ! -d "$PROJECT_ROOT/moneywise-app" ]; then
        print_error "Invalid project structure"
        print_warning "Expected structure: MoneyWise/{moneywise-backend, moneywise-app}"
        return 1
    fi
    return 0
}

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    # Script is being sourced
    if verify_project_structure; then
        print_success "Module loader initialized successfully"
    else
        print_error "Failed to initialize module loader"
        return 1
    fi
fi