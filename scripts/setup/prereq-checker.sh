#!/bin/bash

# =============================================================================
# MoneyWise Prerequisites Checker
# =============================================================================
# This module handles verification of all required tools and dependencies.
# It checks: Rust, Node.js, PostgreSQL, Redis, and other prerequisites.
#
# Why this approach?
# - Centralized prerequisite checking for consistency
# - Easy to add new prerequisites or modify existing checks
# - Provides clear error messages and installation guidance
# - Can be used independently or as part of larger setup processes
# =============================================================================

# =============================================================================
# SOURCE OUTPUT UTILITIES
# =============================================================================
# Why source output utilities? Provides consistent formatting and user experience.
# This module depends on the output utilities for all user communication.
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_UTILS="$SCRIPT_DIR/output-utils.sh"

if [ ! -f "$OUTPUT_UTILS" ]; then
    echo "❌ Error: Output utilities not found at $OUTPUT_UTILS"
    exit 1
fi

source "$OUTPUT_UTILS"

# =============================================================================
# PREREQUISITE CHECKING FUNCTIONS
# =============================================================================
# Why separate functions? Allows selective prerequisite checking.
# Scripts can choose which prerequisites to verify based on their needs.
# =============================================================================

# Check if prerequisites have already been verified
# This prevents redundant checking when called from root script
is_prereqs_checked() {
    [ "$MONEYWISE_PREREQS_CHECKED" = "true" ]
}

# Mark prerequisites as checked
mark_prereqs_checked() {
    export MONEYWISE_PREREQS_CHECKED=true
}

# =============================================================================
# INDIVIDUAL PREREQUISITE CHECKS
# =============================================================================
# Why individual checks? Allows granular control and specific error messages.
# Each check provides tailored guidance for the specific tool.
# =============================================================================

# Check Rust/Cargo installation
check_rust() {
    print_status "Checking Rust/Cargo installation..."

    if ! command -v cargo &> /dev/null; then
        print_error "Rust/Cargo not found"
        print_warning "Cargo is required to build and run Rust applications"
        print_info "Install from: https://rustup.rs/"
        print_info "Or run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        return 1
    fi

    # Check Rust version
    local rust_version=$(cargo --version 2>/dev/null | cut -d' ' -f2 || echo "unknown")
    print_success "Rust/Cargo found (version: $rust_version)"
    return 0
}

# Check Node.js installation
check_nodejs() {
    print_status "Checking Node.js installation..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js not found"
        print_warning "Node.js is required for the React Native frontend"
        print_info "Install from: https://nodejs.org/"
        print_info "Or use package manager: sudo apt install nodejs npm (Ubuntu/Debian)"
        return 1
    fi

    # Check Node.js version
    local node_version=$(node --version 2>/dev/null || echo "unknown")
    local npm_version=$(npm --version 2>/dev/null || echo "unknown")

    # Verify minimum version requirement
    if [[ "$node_version" =~ v([0-9]+)\. ]]; then
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

    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL not found"
        print_warning "PostgreSQL is the primary database for the MoneyWise application"
        print_info "Install from: https://postgresql.org/download/"
        print_info "Or use package manager: sudo apt install postgresql postgresql-contrib (Ubuntu/Debian)"
        return 1
    fi

    # Check PostgreSQL version
    local pg_version=$(psql --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1 || echo "unknown")

    # Verify minimum version requirement
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

    if ! command -v redis-cli &> /dev/null; then
        print_warning "Redis not found (optional)"
        print_info "Redis provides caching and session storage for better performance"
        print_info "Install from: https://redis.io/download/"
        print_info "Or use package manager: sudo apt install redis-server (Ubuntu/Debian)"
        return 0  # Not a failure, just informational
    fi

    # Check Redis version
    local redis_version=$(redis-cli --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
    print_success "Redis found (version: $redis_version)"
    return 0
}

# Check Git installation
check_git() {
    print_status "Checking Git installation..."

    if ! command -v git &> /dev/null; then
        print_error "Git not found"
        print_warning "Git is required for version control and dependency management"
        print_info "Install from: https://git-scm.com/"
        print_info "Or use package manager: sudo apt install git (Ubuntu/Debian)"
        return 1
    fi

    # Check Git version
    local git_version=$(git --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
    print_success "Git found (version: $git_version)"
    return 0
}

# Check curl installation
check_curl() {
    print_status "Checking curl installation..."

    if ! command -v curl &> /dev/null; then
        print_error "curl not found"
        print_warning "curl is required for API testing and downloads"
        print_info "Install from: https://curl.se/"
        print_info "Or use package manager: sudo apt install curl (Ubuntu/Debian)"
        return 1
    fi

    print_success "curl found"
    return 0
}

# =============================================================================
# COMPREHENSIVE PREREQUISITE CHECKING
# =============================================================================
# Why comprehensive checking? Ensures all required tools are available.
# This function can be called once from the root script.
# =============================================================================
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
