#!/bin/bash

# MoneyWise Quick Setup Check
# Provides a fast overview of your MoneyWise setup status
# Checks: scripts, database, backend, and frontend without running full tests
# Fast status check (under 30 seconds) - safe to run anytime

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_UTILS="$SCRIPT_DIR/output-utils.sh"

# Source output utilities for consistent messaging
if [ -f "$OUTPUT_UTILS" ]; then
    source "$OUTPUT_UTILS"
else
    # Fallback functions if output-utils.sh is not available
    print_status() { echo "▶ $1"; }
    print_success() { echo "✅ $1"; }
    print_warning() { echo "⚠️  $1"; }
    print_error() { echo "❌ $1"; }
fi

echo "🔍 MoneyWise Quick Setup Check"
echo "=============================="
echo "Fast status overview of your MoneyWise project"
echo

# Quick checks with status tracking
STATUS_GOOD=0
STATUS_WARN=0
STATUS_ERROR=0

# Check 1: Setup Scripts
print_status "Checking setup scripts..."

if [ -f "$SCRIPT_DIR/../setup.sh" ]; then
    print_success "✅ Root setup script exists"
    ((STATUS_GOOD++))
else
    print_error "❌ Root setup script missing"
    ((STATUS_ERROR++))
fi

if [ -f "$SCRIPT_DIR/../moneywise-backend/setup.sh" ]; then
    print_success "✅ Backend setup script exists"
    ((STATUS_GOOD++))
else
    print_error "❌ Backend setup script missing"
    ((STATUS_ERROR++))
fi

# Check 2: Backend Status
print_status "Checking backend status..."

if [ -f "$SCRIPT_DIR/../moneywise-backend/Cargo.toml" ]; then
    print_success "✅ Cargo.toml exists"
    ((STATUS_GOOD++))

    # Quick cargo check (fast)
    if cargo check --quiet --manifest-path "$SCRIPT_DIR/../moneywise-backend/Cargo.toml" > /dev/null 2>&1; then
        print_success "✅ Backend compiles successfully"
        ((STATUS_GOOD++))
    else
        print_warning "⚠️  Backend has compilation issues"
        ((STATUS_WARN++))
    fi
else
    print_error "❌ Cargo.toml missing"
    ((STATUS_ERROR++))
fi

# Check 3: Frontend Status
print_status "Checking frontend status..."

if [ -f "$SCRIPT_DIR/../moneywise-app/package.json" ]; then
    print_success "✅ package.json exists"
    ((STATUS_GOOD++))

    if [ -d "$SCRIPT_DIR/../moneywise-app/node_modules" ]; then
        print_success "✅ Dependencies installed"
        ((STATUS_GOOD++))
    else
        print_warning "⚠️  Dependencies not installed"
        ((STATUS_WARN++))
    fi
else
    print_error "❌ package.json missing"
    ((STATUS_ERROR++))
fi

# Check 4: Database Status
print_status "Checking database status..."

if [ -f "$SCRIPT_DIR/../moneywise-backend/.env" ]; then
    print_success "✅ Environment file exists"
    ((STATUS_GOOD++))

    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL" "$SCRIPT_DIR/../moneywise-backend/.env"; then
        print_success "✅ Database URL configured"
        ((STATUS_GOOD++))
    else
        print_warning "⚠️  Database URL not configured"
        ((STATUS_WARN++))
    fi
else
    print_warning "⚠️  Environment file missing"
    ((STATUS_WARN++))
fi

# Check 5: Dependencies
print_status "Checking system dependencies..."

DEPS=("cargo" "psql" "redis-cli")
for dep in "${DEPS[@]}"; do
    if command -v "$dep" &> /dev/null; then
        print_success "✅ $dep available"
        ((STATUS_GOOD++))
    else
        print_warning "⚠️  $dep not available"
        ((STATUS_WARN++))
    fi
done

# Check 6: Project Structure
print_status "Checking project structure..."

REQUIRED_DIRS=(
    "moneywise-backend/src"
    "moneywise-backend/database"
    "moneywise-app/src"
    "scripts"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$SCRIPT_DIR/../$dir" ]; then
        print_success "✅ $dir exists"
        ((STATUS_GOOD++))
    else
        print_warning "⚠️  $dir missing"
        ((STATUS_WARN++))
    fi
done

# Status summary and recommendations
echo
echo "📊 Quick Check Summary"
echo "====================="
echo "✅ Good: $STATUS_GOOD"
echo "⚠️  Warnings: $STATUS_WARN"
echo "❌ Errors: $STATUS_ERROR"
echo

# Overall status
if [ $STATUS_ERROR -eq 0 ]; then
    if [ $STATUS_WARN -eq 0 ]; then
        print_success "🎉 All systems are go! Your setup is ready."
        echo
        echo "🚀 You can now run:"
        echo "   ./setup.sh                    # Full setup from root"
        echo "   cd moneywise-backend && ./setup.sh  # Backend setup only"
    else
        print_success "✅ Setup is functional with some minor warnings."
        echo
        echo "⚠️  Consider addressing warnings for optimal performance"
        echo "🚀 You can still run the setup scripts"
    fi
else
    print_warning "⚠️  Setup has some issues that should be addressed."
    echo
    echo "🔧 Recommended actions:"
    echo "   1. Fix any missing files or directories"
    echo "   2. Install missing dependencies"
    echo "   3. Run full test suite: ./scripts/testing/run-all-tests.sh"
fi

echo
echo "🔒 Your current environment remains unchanged"
echo "💡 Run './scripts/testing/run-all-tests.sh' for detailed testing"
