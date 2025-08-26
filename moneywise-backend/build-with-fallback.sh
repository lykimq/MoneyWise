#!/bin/bash
# Production-Ready SQLx Build Script
# Tries live database first, falls back to offline mode if needed

set -e

echo "🚀 Starting production-ready build process..."

# Check if DATABASE_URL is available
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set. Using offline mode."
    export SQLX_OFFLINE=true
    cargo build --release --verbose
    exit 0
fi

echo "📡 Attempting build with live database connection..."
echo "Database: $(echo "$DATABASE_URL" | sed 's/:[^@]*@/:***@/')"

# Try building with live database (with timeout)
if timeout 60s cargo build --release --verbose 2>/tmp/build.log; then
    echo "✅ Build successful with live database connection!"
    echo "ℹ️  This is the preferred production approach."
else
    echo "⚠️  Live database build failed. Error details:"
    tail -10 /tmp/build.log || true

    echo ""
    echo "🔄 Falling back to SQLx offline mode..."
    echo "ℹ️  This is expected in CI environments with network restrictions."

    # Use offline mode
    export SQLX_OFFLINE=true
    cargo build --release --verbose

    echo "✅ Build successful with offline mode!"
    echo "ℹ️  Runtime will still use live database connections."
fi

echo "🎉 Build process completed successfully!"
