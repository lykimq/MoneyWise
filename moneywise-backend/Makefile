# MoneyWise Backend Makefile
# Simple and clear commands for development and deployment

.PHONY: help build run test clean install-sqlx migrate setup setup-local setup-supabase

# Default target - show available commands
help:
	@echo "MoneyWise Backend - Available Commands:"
	@echo ""
	@echo "🔧 Setup Commands:"
	@echo "  setup          - Auto-detect environment and setup (recommended)"
	@echo "  setup-local    - Setup for local PostgreSQL development"
	@echo "  setup-supabase - Setup for Supabase production environment"
	@echo ""
	@echo "🗄️  Database Commands:"
	@echo "  migrate        - Run database migrations"
	@echo "  build-db       - Build production database script"
	@echo ""
	@echo "🚀 Development Commands:"
	@echo "  build          - Build the project"
	@echo "  run            - Run the server"
	@echo "  test           - Run all tests"
	@echo ""
	@echo "🧹 Maintenance Commands:"
	@echo "  clean          - Clean build artifacts"
	@echo "  install-sqlx   - Install SQLx CLI tool"
	@echo ""
	@echo "📝 Environment:"
	@echo "  - Copy env.example to .env and update with your database credentials"
	@echo "  - For Supabase: Update DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY"
	@echo "  - For local: Update DATABASE_URL to point to local PostgreSQL"

# Build the project
build:
	cargo build

# Run the server
run:
	cargo run

# Run tests
test:
	cargo test

# Clean build artifacts
clean:
	cargo clean

# Install SQLx CLI for database migrations
install-sqlx:
	cargo install sqlx-cli --no-default-features --features postgres

# Run database migrations
migrate:
	@echo "🔄 Running database migrations..."
	@if [ -f .env ]; then \
		source .env; \
		sqlx migrate run; \
	else \
		echo "❌ No .env file found"; \
		echo "Please copy env.example to .env and update with your database credentials"; \
		exit 1; \
	fi

# Build production database deployment script
build-db:
	@echo "🏗️  Building production database script..."
	@cd database && ./build-deploy.sh

# Auto-detect environment and setup (recommended)
setup:
	@echo "🚀 Setting up MoneyWise Backend (auto-detecting environment)..."
	./setup.sh

# Setup for local PostgreSQL development
setup-local:
	@echo "🚀 Setting up MoneyWise Backend for local development..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file for local development..."; \
		cp env.example .env; \
		echo "⚠️  Please edit .env file and update DATABASE_URL for local PostgreSQL"; \
		echo "Example: DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise"; \
		exit 1; \
	fi
	@echo "✅ .env file exists, running setup..."
	./setup.sh

# Setup for Supabase production environment
setup-supabase:
	@echo "🚀 Setting up MoneyWise Backend for Supabase..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file for Supabase..."; \
		cp env.example .env; \
		echo "⚠️  Please edit .env file and update:"; \
		echo "   - DATABASE_URL (Supabase connection string)"; \
		echo "   - SUPABASE_URL (your Supabase project URL)"; \
		echo "   - SUPABASE_ANON_KEY (your Supabase anon key)"; \
		exit 1; \
	fi
	@echo "✅ .env file exists, running setup..."
	./setup.sh