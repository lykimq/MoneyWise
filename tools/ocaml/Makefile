# Provides convenient targets for building, testing, and development

.PHONY: help build clean test install uninstall run doc

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
	@echo "Testing:"
	@echo "  test           - Run tests"
	@echo
	@echo "Documentation:"
	@echo "  doc            - Generate documentation with odoc"
	@echo
	@echo "Installation:"
	@echo "  install        - Install the tool system-wide"
	@echo "  uninstall      - Uninstall the tool"
	@echo
	@echo "Execution:"
	@echo "  run            - Run the CLI tool (defaults to 'status' command)"
	@echo "  run ARGS=setup - Run the CLI tool with specific command (e.g., setup)"
	@echo "  run-help       - Show CLI help"
	@echo "  run-status     - Run status command"
	@echo
	@echo "Use 'make <target>' to run a specific target"

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

# Testing
test: ## Run tests
	@echo "🧪 Running tests..."
	dune runtest
	@echo "✅ Tests completed!"

# Documentation
doc: ## Generate documentation with odoc
	@echo "📚 Generating documentation with odoc..."
	@if command -v odoc >/dev/null 2>&1; then \
		dune build @doc; \
		echo "📁 Copying documentation to docs/ folder for GitHub Pages..."; \
		rm -f ../../docs/*.html; \
		rm -rf ../../docs/moneywise-tools ../../docs/odoc.support; \
		cp -r _build/default/_doc/_html/* ../../docs/; \
		echo "✅ Documentation generated and copied to docs/"; \
		echo "🌐 Open ../../docs/index.html in your browser"; \
		echo "🚀 Documentation ready for GitHub Pages deployment"; \
	else \
		echo "❌ odoc not found. Installing..."; \
		opam install odoc; \
		$(MAKE) doc; \
	fi

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
run: build ## Run the CLI tool (defaults to status command)
	@echo "🚀 Running MoneyWise CLI tool..."
	@if [ -f "$(EXECUTABLE)" ]; then \
		if [ -n "$(ARGS)" ]; then \
			$(EXECUTABLE) $(ARGS); \
		else \
			echo "ℹ️  No arguments provided, running default 'status' command..."; \
			$(EXECUTABLE) status; \
		fi; \
	else \
		echo "❌ Executable not found. Please run 'make build' first."; \
		exit 1; \
	fi

run-help: build ## Show CLI help
	@echo "📖 Showing CLI help..."
	$(EXECUTABLE) --help=plain

run-status: build ## Run status command
	@echo "📊 Running status command..."
	$(EXECUTABLE) status

# Default target
.DEFAULT_GOAL := help
