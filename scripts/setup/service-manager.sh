#!/bin/bash

# MoneyWise Service Manager
# Handles system service management for MoneyWise
# Manages: PostgreSQL, Redis, and other required services
# Provides cross-platform compatibility (Linux, macOS, etc.)

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load service utilities
SERVICE_UTILS="$SCRIPT_DIR/../core/service-utils.sh"
source "$SERVICE_UTILS"

# Load command utilities
COMMAND_UTILS="$SCRIPT_DIR/../core/command-utils.sh"
source "$COMMAND_UTILS"

# Start PostgreSQL service
start_postgresql() {
    print_status "Starting PostgreSQL service..."

    # Check if PostgreSQL is already running
    if pg_isready -q 2>/dev/null; then
        print_success "PostgreSQL is already running"
        return 0
    fi

    # Try to start PostgreSQL using service utilities
    if manage_service "postgresql" "start"; then
        # Wait for PostgreSQL to be ready
        if wait_for_service "PostgreSQL" "pg_isready -q" 30 2; then
            print_success "PostgreSQL started successfully"
            return 0
        fi
    fi

    # If automatic start failed, provide guidance
    print_error "Failed to start PostgreSQL automatically"
    local start_cmd
    start_cmd=$(get_service_start_command "postgresql")

    if [ -n "$start_cmd" ]; then
        print_warning "Please start PostgreSQL manually: $start_cmd"
    else
        print_warning "Please start PostgreSQL manually using your system's service manager"
    fi

    print_info "Common commands:"
    print_info "  - Ubuntu/Debian: sudo systemctl start postgresql"
    print_info "  - macOS: brew services start postgresql"
    print_info "  - CentOS/RHEL: sudo systemctl start postgresql"
    return 1
}

# Start Redis service
start_redis() {
    print_status "Starting Redis service..."

    # Check if Redis is available
    if ! command_exists "redis-cli"; then
        print_warning "Redis not found - skipping Redis startup"
        print_info "Redis is optional but improves performance"
        return 0
    fi

    # Check if Redis is already running
    if redis-cli ping &> /dev/null; then
        print_success "Redis is already running"
        return 0
    fi

    # Try to start Redis using service utilities
    if manage_service "redis" "start"; then
        # Wait briefly for Redis to start
        sleep 1
        if wait_for_service "Redis" "redis-cli ping" 5 1; then
            print_success "Redis started successfully"
            return 0
        fi
    fi

    # If service manager failed, try manual start
    if redis-server --daemonize yes &>/dev/null; then
        print_success "Redis started successfully in manual mode"
        return 0
    fi

    # If all start attempts failed, it's not critical (Redis is optional)
    print_warning "Failed to start Redis (optional service)"
    print_info "Redis will work without it, but performance may be reduced"
    return 0
}