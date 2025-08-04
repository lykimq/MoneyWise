#!/bin/bash

echo "Setting up MoneyWise Backend..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Check if database exists, create if not
if ! psql -lqt | cut -d \| -f 1 | grep -qw moneywise; then
    echo "Creating database 'moneywise'..."
    createdb moneywise
else
    echo "Database 'moneywise' already exists."
fi

# Install sqlx CLI if not present
if ! command -v sqlx &> /dev/null; then
    echo "Installing sqlx CLI..."
    cargo install sqlx-cli --no-default-features --features postgres
fi

# Run migrations
echo "Running database migrations..."
sqlx migrate run

# Build the project
echo "Building the project..."
cargo build

echo "Setup complete! You can now run 'cargo run' to start the server."