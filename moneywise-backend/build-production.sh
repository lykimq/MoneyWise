#!/bin/bash
# Production-Ready Build Script for MoneyWise Backend
# Handles both development (with database) and CI (offline mode) scenarios

set -e

echo "🚀 MoneyWise Backend - Production Build"
echo "======================================"

# Check if we're in CI environment
if [ "$CI" = "true" ]; then
    echo "🔍 CI Environment detected"
    export SQLX_OFFLINE=true
    echo "✅ Using SQLx offline mode for CI build"
else
    echo "🔍 Development environment detected"
    if [ -n "$DATABASE_URL" ]; then
        echo "✅ DATABASE_URL available - using live database"
    else
        echo "⚠️  No DATABASE_URL - falling back to offline mode"
        export SQLX_OFFLINE=true
    fi
fi

# Show current configuration
echo ""
echo "Build Configuration:"
echo "- SQLX_OFFLINE: ${SQLX_OFFLINE:-false}"
echo "- DATABASE_URL: $([ -n "$DATABASE_URL" ] && echo "Set" || echo "Not set")"
echo ""

# Build the project
echo "🏗️  Building MoneyWise Backend..."
cargo build --release --verbose

echo ""
echo "🎉 Build completed successfully!"
echo "📦 Binary location: target/release/moneywise-backend"
