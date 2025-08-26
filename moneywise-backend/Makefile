# MoneyWise Backend Makefile
# Provides convenient commands for development and deployment

.PHONY: help build run test clean install-sqlx migrate migrate-local migrate-supabase setup setup-local setup-supabase supabase-setup

# Default target
help:
	@echo "MoneyWise Backend - Available Commands:"
	@echo ""
	@echo "🔧 Setup Commands:"
	@echo "  setup          - Auto-detect environment and setup (recommended)"
	@echo "  setup-local    - Setup for local PostgreSQL development"
	@echo "  setup-supabase - Setup for Supabase production environment"
	@echo "  supabase-setup - Interactive Supabase credentials setup"
	@echo ""
	@echo "🗄️  Database Commands:"
	@echo "  migrate        - Run migrations (auto-detects environment)"
	@echo "  migrate-local  - Run migrations on local database"
	@echo "  migrate-supabase - Run migrations on Supabase"
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
	@echo "  - Use 'make supabase-setup' for interactive Supabase configuration"

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

# Install SQLx CLI
install-sqlx:
	cargo install sqlx-cli --no-default-features --features postgres

# Run migrations (auto-detects environment)
migrate:
	@echo "🔄 Running migrations (auto-detecting environment)..."
	@if [ -f .env ]; then \
		source .env; \
		if [[ "$$DATABASE_URL" == *"supabase"* ]] || [[ "$$DATABASE_URL" == *"localhost"* ]]; then \
			echo "✅ Environment detected, running migrations..."; \
			sqlx migrate run; \
		else \
			echo "❌ No valid DATABASE_URL found in .env"; \
			echo "Please copy env.example to .env and update with your database credentials"; \
			exit 1; \
		fi; \
	else \
		echo "❌ No .env file found"; \
		echo "Please copy env.example to .env and update with your database credentials"; \
		exit 1; \
	fi

# Run migrations on local database
migrate-local:
	@echo "🔄 Running migrations on local database..."
	@if [ -f .env ]; then \
		source .env; \
		if [[ "$$DATABASE_URL" == *"localhost"* ]] || [[ "$$DATABASE_URL" == *"127.0.0.1"* ]]; then \
			sqlx migrate run; \
		else \
			echo "❌ DATABASE_URL in .env is not configured for local development"; \
			echo "Please update .env with local PostgreSQL connection string"; \
			exit 1; \
		fi; \
	else \
		echo "❌ No .env file found"; \
		echo "Please copy env.example to .env and update with your database credentials"; \
		exit 1; \
	fi

# Run migrations on Supabase
migrate-supabase:
	@echo "🔄 Running migrations on Supabase..."
	@if [ -f .env ]; then \
		source .env; \
		if [[ "$$DATABASE_URL" == *"supabase"* ]]; then \
			sqlx migrate run; \
		else \
			echo "❌ DATABASE_URL in .env is not configured for Supabase"; \
			echo "Please update .env with Supabase connection string"; \
			exit 1; \
		fi; \
	else \
		echo "❌ No .env file found"; \
		echo "Please copy env.example to .env and update with your database credentials"; \
		exit 1; \
	fi

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
		echo ""; \
		echo "💡 Pro Tip: Use the helper script for easy setup:"; \
		echo "   ../scripts/get-supabase-credentials.sh"; \
		exit 1; \
	fi
	@echo "✅ .env file exists, running setup..."
	./setup.sh

# Interactive Supabase credentials setup
supabase-setup:
	@echo "🔑 Running Supabase credentials helper..."
	@if [ -f "../scripts/get-supabase-credentials.sh" ]; then \
		../scripts/get-supabase-credentials.sh; \
	else \
		echo "❌ Helper script not found at ../scripts/get-supabase-credentials.sh"; \
		echo "Please run from the moneywise-backend directory"; \
		exit 1; \
	fi