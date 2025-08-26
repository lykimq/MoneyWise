#!/bin/bash
# Prepare SQLx offline data for CI builds
# This script generates the proper .sqlx directory that SQLx 0.6 expects

set -e

echo "🔄 Preparing SQLx offline data..."

# Check if we have a DATABASE_URL for generating fresh metadata
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL available - generating fresh query metadata"

    # Install sqlx-cli if not present
    if ! command -v sqlx &> /dev/null; then
        echo "📦 Installing SQLx CLI..."
        cargo install sqlx-cli --no-default-features --features postgres
    fi

    # Generate fresh metadata
    echo "🔍 Analyzing queries and generating metadata..."
    cargo sqlx prepare -- --lib

    echo "✅ Fresh query metadata generated in .sqlx directory"

elif [ -d "target/sqlx/moneywise-backend" ] && [ "$(ls -A target/sqlx/moneywise-backend 2>/dev/null)" ]; then
    echo "📁 Using existing query metadata from target/sqlx/"

    # Copy existing metadata to .sqlx directory
    mkdir -p .sqlx
    cp target/sqlx/moneywise-backend/* .sqlx/

    echo "✅ Copied $(ls .sqlx | wc -l) query files to .sqlx directory"

else
    echo "⚠️  No DATABASE_URL and no existing metadata found"
    echo "Creating minimal .sqlx directory for basic offline support"

    mkdir -p .sqlx
    echo "❌ Warning: Offline mode may not work properly without query metadata"
fi

# Verify the .sqlx directory
if [ -d ".sqlx" ] && [ "$(ls -A .sqlx 2>/dev/null)" ]; then
    echo "✅ SQLx offline preparation complete!"
    echo "📊 Query files: $(ls .sqlx | wc -l)"
    echo "📂 Directory size: $(du -sh .sqlx | cut -f1)"
else
    echo "❌ Failed to prepare .sqlx directory"
    exit 1
fi
