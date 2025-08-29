# MoneyWise Project Makefile

.PHONY: all build clean install test check setup

# Default target
all: build

# Build the OCaml CLI tool
build:
	@echo "🔨 Building MoneyWise CLI tool..."
	@cd tools/ocaml && dune build @all

# Install the CLI tool (makes it available in PATH)
install: build
	@echo "📦 Installing MoneyWise CLI tool..."
	@cd tools/ocaml && dune install

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@cd tools/ocaml && dune clean

# Verify project structure and prerequisites
verify: build
	@echo "🔍 Verifying MoneyWise project..."
	@tools/ocaml/_build/default/bin/moneywise_cli.exe verify --project-root $(PWD)

# Run tests
test: build
	@echo "🧪 Running tests..."
	@tools/ocaml/_build/default/bin/moneywise_cli.exe test --project-root $(PWD)

# Show help
help:
	@echo "MoneyWise Project Management"
	@echo "==========================="
	@echo
	@echo "Project Commands:"
	@echo "  make verify   - Verify project structure and prerequisites"
	@echo "  make test     - Run tests"
	@echo
	@echo "Build Commands:"
	@echo "  make build    - Build the OCaml CLI tool"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make install  - Install the CLI tool"
	@echo "  make help     - Show this help message"
	@echo
	@echo "Note: Only OCaml components are currently implemented."
	@echo "Shell script functionality will be migrated to OCaml in future updates."
