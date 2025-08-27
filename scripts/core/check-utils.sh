#!/bin/bash

# MoneyWise Check Utilities
# Provides status tracking and reporting functions for check scripts
# Handles: status counters, check results, and summary reporting

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Status tracking variables
declare -i STATUS_GOOD=0
declare -i STATUS_WARN=0
declare -i STATUS_ERROR=0

# Reset status counters
reset_status_counters() {
    STATUS_GOOD=0
    STATUS_WARN=0
    STATUS_ERROR=0
}

# Increment status counters
increment_good() { ((STATUS_GOOD++)); }
increment_warn() { ((STATUS_WARN++)); }
increment_error() { ((STATUS_ERROR++)); }

# Check file existence with status tracking
check_file_exists() {
    local file_path="$1"
    local description="$2"
    local is_critical="${3:-true}"  # Default to true for backward compatibility

    if [ -f "$file_path" ]; then
        print_success "$description exists"
        increment_good
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            print_error "$description missing"
            increment_error
        else
            print_warning "$description missing"
            increment_warn
        fi
        return 1
    fi
}

# Check directory existence with status tracking
check_dir_exists() {
    local dir_path="$1"
    local description="$2"
    local is_critical="${3:-true}"  # Default to true for backward compatibility

    if [ -d "$dir_path" ]; then
        print_success "$description exists"
        increment_good
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            print_error "$description missing"
            increment_error
        else
            print_warning "$description missing"
            increment_warn
        fi
        return 1
    fi
}

# Check command availability with status tracking
check_command_exists() {
    local cmd="$1"
    local description="${2:-$cmd}"
    local is_critical="${3:-true}"

    if command -v "$cmd" &> /dev/null; then
        print_success "$description available"
        increment_good
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            print_error "$description not available"
            increment_error
        else
            print_warning "$description not available"
            increment_warn
        fi
        return 1
    fi
}

# Check environment variable with status tracking
check_env_var() {
    local var_name="$1"
    local description="${2:-$var_name}"
    local is_critical="${3:-true}"

    if [ -n "${!var_name+x}" ]; then
        print_success "$description configured"
        increment_good
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            print_error "$description not configured"
            increment_error
        else
            print_warning "$description not configured"
            increment_warn
        fi
        return 1
    fi
}

# Print status summary
print_status_summary() {
    local title="${1:-Status Summary}"
    local show_recommendations="${2:-true}"

    echo
    echo "📊 $title"
    echo "====================="
    echo "✅ Good: $STATUS_GOOD"
    echo "⚠️  Warnings: $STATUS_WARN"
    echo "❌ Errors: $STATUS_ERROR"
    echo

    if [ "$show_recommendations" = "true" ]; then
        if [ $STATUS_ERROR -eq 0 ]; then
            if [ $STATUS_WARN -eq 0 ]; then
                print_success "🎉 All checks passed successfully!"
            else
                print_success "✅ Checks passed with some warnings"
                echo
                echo "⚠️  Consider addressing warnings for optimal performance"
            fi
        else
            print_warning "⚠️  Some checks failed and need attention"
            echo
            echo "🔧 Recommended actions:"
            echo "   1. Review error messages above"
            echo "   2. Fix critical issues first"
            echo "   3. Address warnings for better performance"
        fi
    fi
}

# Run multiple checks with section header
run_checks() {
    local section_title="$1"
    shift
    local -a check_functions=("$@")

    print_status "Checking $section_title..."

    for check_func in "${check_functions[@]}"; do
        $check_func
    done
}

# Auto-initialization when sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    reset_status_counters
    print_success "Check utilities initialized successfully"
fi
