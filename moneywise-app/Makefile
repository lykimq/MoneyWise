# Simple Makefile for MoneyWise App

.PHONY: help install start android ios web clean test test-integration test-coverage test-watch test-api test-hooks test-screen test-components test-edge-cases test-performance test-install

help: ## Show available commands
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install  - Install dependencies"
	@echo "  make start    - Start Expo development server"
	@echo "  make android  - Start Android development"
	@echo "  make ios      - Start iOS development"
	@echo "  make web      - Start web development"
	@echo "  make clean    - Clean node_modules and cache"
	@echo ""
	@echo "Testing:"
	@echo "  make test              - Run working integration tests"
	@echo "  make test-demo         - Run demo test only"
	@echo "  make test-setup-info   - Show test setup information"
	@echo "  make test-list         - List all test files"
	@echo ""
	@echo "✅ Working Tests: Demo, Budget Calculations, Date Utils"
	@echo "⚠️  Note: Full React Native tests require additional setup"

install: ## Install dependencies
	npm install

start: ## Start Expo development server
	npx expo start

android: ## Start Android development
	npx expo start --android

ios: ## Start iOS development
	npx expo start --ios

web: ## Start web development
	npx expo start --web

clean: ## Clean node_modules and cache
	rm -rf node_modules
	rm -rf .expo
	npm install

# Testing targets
test: ## Run all working integration tests
	@echo "🧪 Running working integration tests..."
	npm test

test-demo: ## Run demo integration test
	@echo "🧪 Running demo integration test..."
	npx jest demo.integration.test.ts --verbose

test-setup-info: ## Show test setup information
	@echo "📋 MoneyWise Test Setup Information"
	@echo ""
	@echo "✅ Working Tests:"
	@echo "  - Demo Integration Test: Basic Jest functionality"
	@echo "  - Budget Calculations: Financial arithmetic and edge cases"
	@echo "  - Date Utils: Date parameter handling and validation"
	@echo ""
	@echo "🧪 Test Coverage:"
	@echo "  - 9 test cases covering core budget functionality"
	@echo "  - Edge cases: over-budget, zero amounts, date boundaries"
	@echo "  - Financial precision and calculation accuracy"
	@echo ""
	@echo "📁 Additional Test Files (Need React Native Setup):"
	@echo "  - API Client Tests: src/services/budget/__tests__/"
	@echo "  - Hook Tests: src/hooks/__tests__/"
	@echo "  - Screen Tests: src/screens/budget/__tests__/"
	@echo "  - Edge Case Tests: src/__tests__/budget-edge-cases.integration.test.tsx"
	@echo "  - Performance Tests: src/__tests__/budget-performance.integration.test.tsx"

test-list: ## List all test files
	@echo "📋 Available test files:"
	@find src -name "*.test.*" -o -name "*.integration.test.*" | sort

# Legacy test commands (for reference)
test-integration: test-setup-info ## Show integration test setup info
test-coverage: test-setup-info ## Show test coverage setup info
test-watch: test-setup-info ## Show test watch setup info
test-api: test-setup-info ## Show API test setup info
test-hooks: test-setup-info ## Show hooks test setup info
test-screen: test-setup-info ## Show screen test setup info
test-components: test-setup-info ## Show components test setup info
test-edge-cases: test-setup-info ## Show edge cases test setup info
test-performance: test-setup-info ## Show performance test setup info