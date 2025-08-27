# MoneyWise OCaml Tools Makefile
# Provides convenient targets for building, testing, and development

.PHONY: help build clean test install uninstall run help-command dev-setup check-deps format lint

# Project configuration
PROJECT_NAME := moneywise-tools
BUILD_DIR := _build/default
BIN_DIR := $(BUILD_DIR)/bin
LIB_DIR := $(BUILD_DIR)/lib
EXECUTABLE := $(BIN_DIR)/moneywise_cli.exe
PUBLIC_NAME := moneywise-cli

# Default target
all: build

# Show help
help: ## Show this help message
	@echo "🚀 MoneyWise OCaml Tools - Available Targets"
	@echo "============================================="
	@echo
	@echo "Build Targets:"
	@echo "  build          - Build the project (default)"
	@echo "  clean          - Clean build artifacts"
	@echo "  rebuild        - Clean and rebuild everything"
	@echo
	@echo "Development:"
	@echo "  dev-setup      - Setup development environment"
	@echo "  check-deps     - Check OCaml dependencies"
	@echo "  format         - Format OCaml code"
	@echo "  lint           - Run linting checks"
	@echo
	@echo "Testing:"
	@echo "  test           - Run tests"
	@echo "  test-watch     - Run tests in watch mode"
	@echo
	@echo "Installation:"
	@echo "  install        - Install the tool system-wide"
	@echo "  uninstall      - Uninstall the tool"
	@echo
	@echo "Execution:"
	@echo "  run            - Run the CLI tool"
	@echo "  run-help       - Show CLI help"
	@echo "  run-status     - Run status command"
	@echo
	@echo "Utilities:"
	@echo "  check-ocaml    - Check OCaml installation"
	@echo "  check-dune     - Check Dune installation"
	@echo "  check-opam     - Check OPAM installation"
	@echo
	@echo "Use 'make <target>' to run a specific target"
	@echo "Use 'make help-command <command>' to get help for a specific command"

# Build targets
build: ## Build the project
	@echo "🔨 Building MoneyWise OCaml tools..."
	dune build
	@echo "✅ Build completed successfully!"

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	dune clean
	@echo "✅ Clean completed!"

rebuild: clean build ## Clean and rebuild everything

# Development setup
dev-setup: ## Setup development environment
	@echo "🛠️  Setting up development environment..."
	@echo "Checking OCaml installation..."
	@which ocamlc > /dev/null || (echo "❌ OCaml not found. Please install OCaml first." && exit 1)
	@echo "✅ OCaml found: $(shell ocamlc -version)"
	@echo
	@echo "Checking Dune installation..."
	@which dune > /dev/null || (echo "❌ Dune not found. Please install Dune first." && exit 1)
	@echo "✅ Dune found: $(shell dune --version)"
	@echo
	@echo "Checking OPAM installation..."
	@which opam > /dev/null || (echo "❌ OPAM not found. Please install OPAM first." && exit 1)
	@echo "✅ OPAM found: $(shell opam --version)"
	@echo
	@echo "Installing dependencies..."
	opam install --deps-only --with-test --with-doc .
	@echo "✅ Development environment setup completed!"

check-deps: ## Check OCaml dependencies
	@echo "🔍 Checking OCaml dependencies..."
	@echo "Installed packages:"
	@opam list --short --depends-on=. | sort
	@echo
	@echo "Missing packages:"
	@opam list --short --depends-on=. --depends-on=. --recursive | sort -u | while read pkg; do \
		if ! opam list --short | grep -q "^$$pkg$$"; then \
			echo "  ❌ $$pkg"; \
		fi; \
	done

# Code quality
format: ## Format OCaml code
	@echo "🎨 Formatting OCaml code..."
	dune build @fmt --auto-promote
	@echo "✅ Code formatting completed!"

lint: ## Run linting checks
	@echo "🔍 Running linting checks..."
	dune build @lint
	@echo "✅ Linting completed!"

# Testing
test: ## Run tests
	@echo "🧪 Running tests..."
	dune runtest
	@echo "✅ Tests completed!"

test-watch: ## Run tests in watch mode
	@echo "🧪 Running tests in watch mode..."
	dune runtest --watch

# Installation
install: build ## Install the tool system-wide
	@echo "📦 Installing MoneyWise CLI tool..."
	@if [ -f "$(EXECUTABLE)" ]; then \
		sudo cp "$(EXECUTABLE)" /usr/local/bin/$(PUBLIC_NAME); \
		sudo chmod +x /usr/local/bin/$(PUBLIC_NAME); \
		echo "✅ Tool installed to /usr/local/bin/$(PUBLIC_NAME)"; \
		echo "You can now run: $(PUBLIC_NAME) --help"; \
	else \
		echo "❌ Executable not found. Please run 'make build' first."; \
		exit 1; \
	fi

uninstall: ## Uninstall the tool
	@echo "🗑️  Uninstalling MoneyWise CLI tool..."
	@if [ -f "/usr/local/bin/$(PUBLIC_NAME)" ]; then \
		sudo rm -f /usr/local/bin/$(PUBLIC_NAME); \
		echo "✅ Tool uninstalled from /usr/local/bin/$(PUBLIC_NAME)"; \
	else \
		echo "ℹ️  Tool not found in /usr/local/bin/"; \
	fi

# Execution
run: build ## Run the CLI tool
	@echo "🚀 Running MoneyWise CLI tool..."
	@if [ -f "$(EXECUTABLE)" ]; then \
		$(EXECUTABLE) $(ARGS); \
	else \
		echo "❌ Executable not found. Please run 'make build' first."; \
		exit 1; \
	fi

run-help: build ## Show CLI help
	@echo "📖 Showing CLI help..."
	$(EXECUTABLE) --help

run-status: build ## Run status command
	@echo "📊 Running status command..."
	$(EXECUTABLE) status

# Utility checks
check-ocaml: ## Check OCaml installation
	@echo "🔍 Checking OCaml installation..."
	@if which ocamlc > /dev/null; then \
		echo "✅ OCaml found: $(shell ocamlc -version)"; \
		echo "  Location: $(shell which ocamlc)"; \
		echo "  Standard library: $(shell ocamlc -where)"; \
	else \
		echo "❌ OCaml not found"; \
		echo "  Please install OCaml from https://ocaml.org/"; \
		exit 1; \
	fi

check-dune: ## Check Dune installation
	@echo "🔍 Checking Dune installation..."
	@if which dune > /dev/null; then \
		echo "✅ Dune found: $(shell dune --version)"; \
		echo "  Location: $(shell which dune)"; \
	else \
		echo "❌ Dune not found"; \
		echo "  Please install Dune: opam install dune"; \
		exit 1; \
	fi

check-opam: ## Check OPAM installation
	@echo "🔍 Checking OPAM installation..."
	@if which opam > /dev/null; then \
		echo "✅ OPAM found: $(shell opam --version)"; \
		echo "  Location: $(shell which opam)"; \
		echo "  Switch: $(shell opam switch show)"; \
	else \
		echo "❌ OPAM not found"; \
		echo "  Please install OPAM from https://opam.ocaml.org/"; \
		exit 1; \
	fi

# Project information
info: ## Show project information
	@echo "📋 MoneyWise OCaml Tools - Project Information"
	@echo "==============================================="
	@echo "Project Name: $(PROJECT_NAME)"
	@echo "Build Directory: $(BUILD_DIR)"
	@echo "Executable: $(EXECUTABLE)"
	@echo "Public Name: $(PUBLIC_NAME)"
	@echo
	@echo "OCaml Version: $(shell ocamlc -version 2>/dev/null || echo 'Not available')"
	@echo "Dune Version: $(shell dune --version 2>/dev/null || echo 'Not available')"
	@echo "OPAM Version: $(shell opam --version 2>/dev/null || echo 'Not available')"
	@echo
	@if [ -f "$(EXECUTABLE)" ]; then \
		echo "✅ Executable is built and ready"; \
		echo "  Size: $(shell ls -lh "$(EXECUTABLE)" | awk '{print $$5}')"; \
		echo "  Last modified: $(shell ls -l "$(EXECUTABLE)" | awk '{print $$6, $$7, $$8}')"; \
	else \
		echo "❌ Executable not built yet"; \
		echo "  Run 'make build' to build the project"; \
	fi

# Development workflow
dev: dev-setup build test ## Complete development workflow
	@echo "🎉 Development workflow completed successfully!"

# Quick development cycle
quick: build test ## Quick build and test cycle

# Help for specific commands
help-command: ## Get help for a specific command (usage: make help-command COMMAND=setup)
	@if [ -z "$(COMMAND)" ]; then \
		echo "❌ Please specify a command: make help-command COMMAND=<command>"; \
		echo "Available commands: setup, check, test, status"; \
		exit 1; \
	fi
	@echo "📖 Help for command: $(COMMAND)"
	@if [ -f "$(EXECUTABLE)" ]; then \
		$(EXECUTABLE) $(COMMAND) --help; \
	else \
		echo "❌ Executable not built. Run 'make build' first."; \
		exit 1; \
	fi

# Default target
.DEFAULT_GOAL := help
