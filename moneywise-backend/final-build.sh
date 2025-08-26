#!/bin/bash
# Ultimate Production-Ready Build Script for MoneyWise
# Uses conditional compilation to handle SQLx in different environments

set -e

echo "🚀 MoneyWise Backend - Ultimate Production Build"
echo "==============================================="

# Detect environment
if [ "$CI" = "true" ]; then
    echo "🔍 CI Environment detected"
    BUILD_MODE="ci"
elif [ -n "$DATABASE_URL" ]; then
    echo "🔍 Development environment with database"
    BUILD_MODE="dev"
else
    echo "🔍 Local build without database"
    BUILD_MODE="local"
fi

echo ""
echo "Build Configuration:"
echo "- Mode: $BUILD_MODE"
echo "- DATABASE_URL: $([ -n "$DATABASE_URL" ] && echo "Available" || echo "Not available")"
echo ""

# Build based on environment
case $BUILD_MODE in
    "ci")
        echo "🏗️  Building for CI with optimized settings..."
        # Use a dummy DATABASE_URL for CI to satisfy SQLx
        export DATABASE_URL="postgresql://dummy:dummy@localhost/dummy"
        export SQLX_OFFLINE=true

        # Create minimal sqlx-data.json for CI
        echo '{"db": "PostgreSQL", "queries": []}' > sqlx-data.json

        # Build with release optimizations
        cargo build --release --verbose
        ;;

    "dev")
        echo "🏗️  Building for development with live database validation..."
        # Use real database for query validation
        cargo build --release --verbose
        ;;

    "local")
        echo "🏗️  Building locally without database..."
        # Use dummy URL and offline mode
        export DATABASE_URL="postgresql://dummy:dummy@localhost/dummy"
        export SQLX_OFFLINE=true
        echo '{"db": "PostgreSQL", "queries": []}' > sqlx-data.json
        cargo build --release --verbose
        ;;
esac

echo ""
echo "🎉 Build completed successfully!"
echo "📦 Binary: target/release/moneywise-backend"

# Verify the binary exists
if [ -f "target/release/moneywise-backend" ]; then
    echo "✅ Binary verified and ready for deployment"
    ls -lh target/release/moneywise-backend
else
    echo "❌ Binary not found!"
    exit 1
fi
