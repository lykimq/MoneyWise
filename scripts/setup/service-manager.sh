#!/bin/bash

# MoneyWise Service Manager
# Handles system service management for MoneyWise
# Manages: PostgreSQL, Redis, and other required services
# Provides cross-platform compatibility (Linux, macOS, etc.)

# Source output utilities for consistent formatting
# Use the path provided by setup-utils.sh if available, otherwise fall back to local path
if [ -z "$OUTPUT_UTILS" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    OUTPUT_UTILS="$SCRIPT_DIR/../core/output-utils.sh"
fi

if [ ! -f "$OUTPUT_UTILS" ]; then
    echo "❌ Error: Output utilities not found at $OUTPUT_UTILS"
    exit 1
fi

source "$OUTPUT_UTILS"

# Service detection functions for different service managers
# Different systems use different service managers (systemd, brew, launchctl, etc.)

# Detect the service manager available on the system
detect_service_manager() {
    if command -v systemctl &> /dev/null; then
        echo "systemd"
    elif command -v brew &> /dev/null; then
        echo "brew"
    elif command -v launchctl &> /dev/null; then
        echo "launchctl"
    elif command -v service &> /dev/null; then
        echo "service"
    else
        echo "manual"
    fi
}

# PostgreSQL service management
# Primary database for MoneyWise - automates service startup

# Start PostgreSQL service
start_postgresql() {
    print_status "Starting PostgreSQL service..."

    # Check if PostgreSQL is already running
    if pg_isready -q 2>/dev/null; then
        print_success "PostgreSQL is already running"
        return 0
    fi

    local service_manager=$(detect_service_manager)

    case "$service_manager" in
        "systemd")
            print_progress "Starting PostgreSQL with systemctl"
            if sudo systemctl start postgresql; then
                print_success "PostgreSQL started successfully with systemctl"
            else
                print_error "Failed to start PostgreSQL with systemctl"
                print_warning "Please start PostgreSQL manually: sudo systemctl start postgresql"
                print_info "Check system logs: sudo journalctl -u postgresql"
                return 1
            fi
            ;;
        "brew")
            print_progress "Starting PostgreSQL with brew"
            if brew services start postgresql; then
                print_success "PostgreSQL started successfully with brew"
            else
                print_error "Failed to start PostgreSQL with brew"
                print_warning "Please start PostgreSQL manually: brew services start postgresql"
                return 1
            fi
            ;;
        "launchctl")
            print_progress "Starting PostgreSQL with launchctl"
            if launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist 2>/dev/null; then
                print_success "PostgreSQL started successfully with launchctl"
            else
                print_error "Failed to start PostgreSQL with launchctl"
                print_warning "Please start PostgreSQL manually"
                return 1
            fi
            ;;
        "service")
            print_progress "Starting PostgreSQL with service command"
            if sudo service postgresql start; then
                print_success "PostgreSQL started successfully with service command"
            else
                print_error "Failed to start PostgreSQL with service command"
                print_warning "Please start PostgreSQL manually: sudo service postgresql start"
                return 1
            fi
            ;;
        *)
            print_error "Unable to auto-start PostgreSQL on this system"
            print_warning "Please start PostgreSQL manually and run this script again"
            print_info "Common commands:"
            print_info "  - Ubuntu/Debian: sudo systemctl start postgresql"
            print_info "  - macOS: brew services start postgresql"
            print_info "  - CentOS/RHEL: sudo systemctl start postgresql"
            return 1
            ;;
    esac

    # Wait for PostgreSQL to fully start
    print_progress "Waiting for PostgreSQL to initialize"
    local attempts=0
    local max_attempts=30

    while [ $attempts -lt $max_attempts ]; do
        if pg_isready -q 2>/dev/null; then
            print_success "PostgreSQL is ready to accept connections"
            return 0
        fi

        attempts=$((attempts + 1))
        sleep 2

        if [ $((attempts % 5)) -eq 0 ]; then
            print_progress "Still waiting for PostgreSQL... (attempt $attempts/$max_attempts)"
        fi
    done

    print_error "PostgreSQL failed to start within expected time"
    print_warning "Check PostgreSQL logs for startup errors"
    return 1
}

# Redis service management for caching and session storage
# Redis is optional but improves performance significantly

# Start Redis service
start_redis() {
    print_status "Starting Redis service..."

    # Check if Redis is available
    if ! command -v redis-cli &> /dev/null; then
        print_warning "Redis not found - skipping Redis startup"
        print_info "Redis is optional but improves performance"
        return 0
    fi

    # Check if Redis is already running
    if redis-cli ping &> /dev/null; then
        print_success "Redis is already running"
        return 0
    fi

    local service_manager=$(detect_service_manager)

    case "$service_manager" in
        "systemd")
            print_progress "Starting Redis with systemctl"
            if sudo systemctl start redis; then
                print_success "Redis started successfully with systemctl"
            else
                print_warning "Failed to start Redis with systemctl (optional service)"
                print_info "Redis will work without it, but performance may be reduced"
            fi
            ;;
        "brew")
            print_progress "Starting Redis with brew"
            if brew services start redis; then
                print_success "Redis started successfully with brew"
            else
                print_warning "Failed to start Redis with brew (optional service)"
                print_info "Redis will work without it, but performance may be reduced"
            fi
            ;;
        "launchctl")
            print_progress "Starting Redis with launchctl"
            if launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.redis.plist 2>/dev/null; then
                print_success "Redis started successfully with launchctl"
            else
                print_warning "Failed to start Redis with launchctl (optional service)"
                print_info "Redis will work without it, but performance may be reduced"
            fi
            ;;
        "service")
            print_progress "Starting Redis with service command"
            if sudo service redis start; then
                print_success "Redis started successfully with service command"
            else
                print_warning "Failed to start Redis with service command (optional service)"
                print_info "Redis will work without it, but performance may be reduced"
            fi
            ;;
        *)
            print_progress "Starting Redis manually"
            if redis-server --daemonize yes; then
                print_success "Redis started successfully manually"
            else
                print_warning "Failed to start Redis manually (optional service)"
                print_info "Redis will work without it, but performance may be reduced"
            fi
            ;;
    esac

    # Wait briefly for Redis to start
    sleep 1

    # Verify Redis is working
    if redis-cli ping &> /dev/null; then
        print_success "Redis is ready to accept connections"
    else
        print_warning "Redis may not be fully ready (optional service)"
    fi

    return 0
}
