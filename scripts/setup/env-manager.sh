#!/bin/bash

# MoneyWise Environment Manager
# Handles environment file operations for MoneyWise
# Manages: .env file creation, loading, and configuration

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

# Environment file operations for working defaults and user customization
# Ensures the database connection works out of the box

# Create default environment file
create_default_env() {
    local env_file="$1"

    print_status "Creating default environment configuration..."

    if [ -f "$env_file" ]; then
        print_warning "Environment file already exists: $env_file"
        print_info "Skipping creation to preserve existing configuration"
        return 0
    fi

    # Create default .env file with working configuration
    cat > "$env_file" << 'EOF'
# MoneyWise Database Configuration
# =================================

# Database Connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise

# Application Settings
RUST_LOG=info
HOST=127.0.0.1
PORT=3000

# Optional Redis Configuration
# REDIS_URL=redis://localhost:6379

# =================================
# Configuration Notes:
# - DATABASE_URL: Update with your PostgreSQL credentials if needed
# - Default assumes: username=postgres, password=password, database=moneywise
# - RUST_LOG: Set to 'debug' for more verbose logging
# - HOST/PORT: Server binding configuration
# =================================
EOF

    print_success "Default environment file created: $env_file"
    print_warning "Please review and update DATABASE_URL if needed"
    print_info "Default configuration assumes standard PostgreSQL setup"

    return 0
}

# Load environment variables from file
load_env_file() {
    local env_file="$1"

    if [ ! -f "$env_file" ]; then
        print_error "Environment file not found: $env_file"
        return 1
    fi

    # Source the .env file to load variables
    # Note: This is a simple approach; in production, you might use a proper .env parser
    if source "$env_file" 2>/dev/null; then
        print_success "Environment variables loaded from: $env_file"
        return 0
    else
        print_error "Failed to load environment file: $env_file"
        print_warning "Check file syntax and permissions"
        return 1
    fi
}

# Extract database name from DATABASE_URL
extract_database_name() {
    local database_url="$1"

    if [[ $database_url =~ /([^/]+)$ ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        echo "moneywise"  # Default fallback
    fi
}
