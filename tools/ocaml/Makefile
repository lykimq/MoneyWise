# Provides convenient targets for building, testing, and development

.PHONY: help build clean test install uninstall run doc format

# Project configuration
PROJECT_NAME := moneywise-tools
BUILD_DIR := _build/default
BIN_DIR := $(BUILD_DIR)/bin
LIB_DIR := $(BUILD_DIR)/lib
EXECUTABLE := $(BIN_DIR)/moneywise_cli.exe
PUBLIC_NAME := moneywise

# Project root (for setup/check commands)
PROJECT_ROOT ?= $(shell cd ../.. && pwd)

# Default target
all: build

# Show help
help: ## Show this help message
	@echo "🚀 MoneyWise OCaml Tools"
	@echo "======================="
	@echo
	@echo "Project Commands:"
	@echo "  verify         - Verify project structure and prerequisites"
	@echo "  test-project   - Run project tests"
	@echo
	@echo "Build Commands:"
	@echo "  build          - Build the project"
	@echo "  clean          - Clean build artifacts"
	@echo "  rebuild        - Clean and rebuild"
	@echo "  test           - Run OCaml tests"
	@echo
	@echo "Documentation:"
	@echo "  doc            - Generate OCaml documentation"
	@echo
	@echo "Development:"
	@echo "  run ARGS=...   - Run CLI with custom arguments"
	@echo "  logs           - Show logs with different levels"
	@echo "  help-cli       - Show detailed CLI help"
	@echo "  install        - Install CLI tool system-wide"
	@echo "  uninstall      - Uninstall CLI tool"
	@echo
	@echo "Examples:"
	@echo "  make verify                        # Verify project"
	@echo "  make verify LOG_LEVEL=app          # Verify with app logging"
	@echo "  make verify LOG_LEVEL=info         # Verify with info logging"
	@echo "  make run ARGS='verify --help'      # Show verify command help"
	@echo "  make run ARGS='check --verbose'    # Run check with options"
	@echo "  make logs                          # Test logging output"
	@echo
	@echo "Note: Only OCaml components are currently implemented."

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
	dune build @doc
	@echo "📁 Copying documentation to docs/ folder for GitHub Pages..."
	rm -f ../../docs/*.html
	rm -rf ../../docs/moneywise-tools ../../docs/odoc.support
	cp -r _build/default/_doc/_html/* ../../docs/
	@echo "✅ Documentation generated and copied to docs/"
	@echo "🌐 Open ../../docs/index.html in your browser"
	@echo "🚀 Documentation ready for GitHub Pages deployment"

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

# Project commands
verify: build ## Verify project structure and prerequisites
	@echo "🔍 Verifying project structure and prerequisites..."
	@if [ -n "$(LOG_LEVEL)" ]; then \
		$(EXECUTABLE) verify --project-root $(PROJECT_ROOT) --log-level=$(LOG_LEVEL); \
	else \
		$(EXECUTABLE) verify --project-root $(PROJECT_ROOT); \
	fi

status: build ## Show project status
	@echo "📊 Getting project status..."
	$(EXECUTABLE) status --project-root $(PROJECT_ROOT)

test-project: build ## Run project tests
	@echo "🧪 Running project tests..."
	$(EXECUTABLE) test --project-root $(PROJECT_ROOT)

# Development commands
format: ## Format OCaml code with ocamlformat
	@echo "🎨 Formatting OCaml code..."
	-dune fmt

run: build ## Run the CLI tool with custom arguments
	@echo "🚀 Running MoneyWise CLI tool..."
	@if [ -f "$(EXECUTABLE)" ]; then \
		if [ -n "$(ARGS)" ]; then \
			$(EXECUTABLE) $(ARGS); \
		else \
			echo "ℹ️  No arguments provided. Use 'make help' to see available commands."; \
			$(EXECUTABLE) --help=plain; \
		fi; \
	else \
		echo "❌ Executable not found. Please run 'make build' first."; \
		exit 1; \
	fi

help-cli: build ## Show detailed CLI help
	@echo "📖 Showing CLI help..."
	$(EXECUTABLE) --help=plain

# Logging examples
logs: build ## Test different logging levels
	@echo "📝 Testing logging levels..."
	@echo "🔍 Info level (default):"
	$(EXECUTABLE) verify --log-level=info --project-root $(PROJECT_ROOT) | head -20
	@echo ""
	@echo "📱 App level:"
	$(EXECUTABLE) verify --log-level=app --project-root $(PROJECT_ROOT) | head -20

# Default target
.DEFAULT_GOAL := help
