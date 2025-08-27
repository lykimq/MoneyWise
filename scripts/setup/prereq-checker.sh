#!/bin/bash

# MoneyWise Prerequisites Checker
# Verifies all required tools and dependencies
# Checks: Rust, Node.js, PostgreSQL, Redis, and other prerequisites

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load command utilities
COMMAND_UTILS="$SCRIPT_DIR/../core/command-utils.sh"
source "$COMMAND_UTILS"

# Check if prerequisites have already been verified
is_prereqs_checked() {
    [ "$MONEYWISE_PREREQS_CHECKED" = "true" ]
}

# Mark prerequisites as checked
mark_prereqs_checked() {
    export MONEYWISE_PREREQS_CHECKED=true
}

# Check Rust/Cargo installation
check_rust() {
    print_status "Checking Rust/Cargo installation..."

    if ! command_exists "cargo"; then
        print_error "Rust/Cargo not found"
        print_warning "Cargo is required to build and run Rust applications"
        print_info "Install from: https://rustup.rs/"
        print_info "Or run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        return 1
    fi

    local rust_version
    rust_version=$(extract_version "cargo" "--version" "[0-9]+\.[0-9]+\.[0-9]+")
    print_success "Rust/Cargo found (version: $rust_version)"
    return 0
}

# Check Node.js installation
check_nodejs() {
    print_status "Checking Node.js installation..."

    if ! command_exists "node"; then
        print_error "Node.js not found"
        print_warning "Node.js is required for the React Native frontend"
        print_info "Install from: https://nodejs.org/"
        print_info "$(get_install_command nodejs)"
        return 1
    fi

    local node_version npm_version
    node_version=$(extract_version "node" "--version" "v?([0-9]+\.[0-9]+\.[0-9]+)")
    npm_version=$(extract_version "npm" "--version")

    if [[ "$node_version" =~ ^v?([0-9]+)\. ]]; then
        local major_version="${BASH_REMATCH[1]}"
        if [ "$major_version" -lt 18 ]; then
            print_warning "Node.js version $node_version detected"
            print_warning "MoneyWise requires Node.js 18+ for optimal performance"
            print_info "Consider upgrading to the latest LTS version"
        fi
    fi

    print_success "Node.js found (version: $node_version, npm: $npm_version)"
    return 0
}

# Check PostgreSQL installation
check_postgresql() {
    print_status "Checking PostgreSQL installation..."

    if ! command_exists "psql"; then
        print_error "PostgreSQL not found"
        print_warning "PostgreSQL is the primary database for the MoneyWise application"
        print_info "Install from: https://postgresql.org/download/"
        print_info "$(get_install_command postgresql)"
        return 1
    fi

    local pg_version
    pg_version=$(extract_version "psql" "--version" "[0-9]+\.[0-9]+")

    if [[ "$pg_version" =~ ^([0-9]+)\. ]]; then
        local major_version="${BASH_REMATCH[1]}"
        if [ "$major_version" -lt 12 ]; then
            print_warning "PostgreSQL version $pg_version detected"
            print_warning "MoneyWise requires PostgreSQL 12+ for full feature support"
            print_info "Consider upgrading to the latest stable version"
        fi
    fi

    print_success "PostgreSQL found (version: $pg_version)"
    return 0
}

# Check Redis installation (optional)
check_redis() {
    print_status "Checking Redis installation..."

    if ! command_exists "redis-cli"; then
        print_warning "Redis not found (optional)"
        print_info "Redis provides caching and session storage for better performance"
        print_info "Install from: https://redis.io/download/"
        print_info "$(get_install_command redis-server)"
        return 0  # Not a failure, just informational
    fi

    local redis_version
    redis_version=$(extract_version "redis-cli" "--version")
    print_success "Redis found (version: $redis_version)"
    return 0
}

# Check Git installation
check_git() {
    print_status "Checking Git installation..."

    if ! command_exists "git"; then
        print_error "Git not found"
        print_warning "Git is required for version control and dependency management"
        print_info "Install from: https://git-scm.com/"
        print_info "$(get_install_command git)"
        return 1
    fi

    local git_version
    git_version=$(extract_version "git" "--version")
    print_success "Git found (version: $git_version)"
    return 0
}

# Check curl installation
check_curl() {
    print_status "Checking curl installation..."

    if ! command_exists "curl"; then
        print_error "curl not found"
        print_warning "curl is required for API testing and downloads"
        print_info "Install from: https://curl.se/"
        print_info "$(get_install_command curl)"
        return 1
    fi

    print_success "curl found"
    return 0
}

# Comprehensive prerequisite checking
check_all_prerequisites() {
    print_section_header "Prerequisites Verification"

    local failed=0
    local total_checks=0
    local passed_checks=0

    # Define which prerequisites to check
    local prereqs=(
        "check_rust"
        "check_nodejs"
        "check_postgresql"
        "check_git"
        "check_curl"
        "check_redis"  # Redis is optional, so don't count as failure
    )

    # Run all prerequisite checks
    for prereq in "${prereqs[@]}"; do
        total_checks=$((total_checks + 1))
        if $prereq; then
            passed_checks=$((passed_checks + 1))
        else
            failed=1
        fi
    done

    print_separator

    # Summary
    if [ $failed -eq 0 ]; then
        print_success "All prerequisites verified successfully!"
        print_info "Passed: $passed_checks/$total_checks checks"
        mark_prereqs_checked
    else
        print_error "Prerequisites check failed"
        print_warning "Passed: $passed_checks/$total_checks checks"
        print_info "Please install missing tools and run the setup again"
        print_info "See the error messages above for installation guidance"
    fi

    return $failed
}