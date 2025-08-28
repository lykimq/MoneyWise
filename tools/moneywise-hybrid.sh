#!/bin/bash

# MoneyWise Hybrid Wrapper Script
#
# This script provides a unified interface that routes commands to either:
# 1. OCaml CLI tools (for complex operations like prerequisites checking)
# 2. Existing shell scripts (for operations already implemented)
#
# Current Implementation Status:
# - ✅ OCaml CLI: prerequisites checking, basic setup/status/test commands
# - ✅ Shell Scripts: database operations, environment management, service management
# - 🔄 Future: Will gradually migrate more functionality to OCaml tools

# Load core utilities from existing scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CORE_UTILS="$PROJECT_ROOT/scripts/core/output-utils.sh"

# Source core utilities if available
if [ -f "$CORE_UTILS" ]; then
    source "$CORE_UTILS"
else
    # Fallback output functions if core utils not available
    print_status() { echo "ℹ️  $1"; }
    print_success() { echo "✅ $1"; }
    print_error() { echo "❌ $1"; }
    print_warning() { echo "⚠️  $1"; }
fi

# OCaml tool path
OCAML_TOOL="$SCRIPT_DIR/ocaml/_build/default/bin/moneywise_cli.exe"

# Check if OCaml tool is available and build if needed
check_ocaml_tool() {
    if [ -f "$OCAML_TOOL" ]; then
        return 0
    else
        print_warning "OCaml tool not found, building..."
        if cd "$SCRIPT_DIR/ocaml" && dune build; then
            cd "$PROJECT_ROOT"
            return 0
        else
            print_error "Failed to build OCaml tool"
            return 1
        fi
    fi
}

# Route commands to appropriate handlers
case "${1:-help}" in
    # ========================================
    # OCaml CLI Commands (Currently Implemented)
    # ========================================

    "check")
        # Check project prerequisites using OCaml tool
        if check_ocaml_tool; then
            print_status "Checking prerequisites with OCaml tool..."
            "$OCAML_TOOL" check
        else
            print_error "Cannot check prerequisites: OCaml tool unavailable"
            exit 1
        fi
        ;;

    "status")
        # Show project status using OCaml tool
        if check_ocaml_tool; then
            print_status "Getting project status with OCaml tool..."
            "$OCAML_TOOL" status
        else
            print_error "Cannot get status: OCaml tool unavailable"
            exit 1
        fi
        ;;

    "test")
        # Run project tests using OCaml tool
        if check_ocaml_tool; then
            print_status "Running tests with OCaml tool..."
            "$OCAML_TOOL" test
        else
            print_error "Cannot run tests: OCaml tool unavailable"
            exit 1
        fi
        ;;

    "setup")
        # Setup project using OCaml tool
        if check_ocaml_tool; then
            print_status "Setting up project with OCaml tool..."
            shift  # Remove 'setup' command, pass remaining args
            "$OCAML_TOOL" setup "$@"
        else
            print_error "Cannot setup project: OCaml tool unavailable"
            exit 1
        fi
        ;;

    # ========================================
    # Shell Script Commands (Currently Available)
    # ========================================

    "env-manage")
        # Environment management using existing shell scripts
        print_status "Using shell script for environment management..."
        "$PROJECT_ROOT/scripts/setup/env-manager.sh" "${@:2}"
        ;;

    "service-manage")
        # Service management using existing shell scripts
        print_status "Using shell script for service management..."
        "$PROJECT_ROOT/scripts/setup/service-manager.sh" "${@:2}"
        ;;

    "db-schema")
        # Database schema management using existing shell scripts
        print_status "Using shell script for database schema management..."
        "$PROJECT_ROOT/scripts/database/schema-manager.sh" "${@:2}"
        ;;

    "db-operations")
        # Database operations using existing shell scripts
        print_status "Using shell script for database operations..."
        "$PROJECT_ROOT/scripts/database/db-operations.sh" "${@:2}"
        ;;

    "quick-check")
        # Quick project check using existing shell script
        print_status "Using shell script for quick project check..."
        "$PROJECT_ROOT/scripts/quick-check.sh"
        ;;

    # ========================================
    # Help and Information
    # ========================================

    "help"|"--help"|"-h")
        echo "🚀 MoneyWise Hybrid Wrapper"
        echo "=========================="
        echo
        echo "This wrapper routes commands to appropriate tools:"
        echo
        echo "🔧 OCaml CLI Commands (Currently Implemented):"
        echo "  check      - Check project prerequisites"
        echo "  status     - Show project status"
        echo "  test       - Run project tests"
        echo "  setup      - Setup project (basic implementation)"
        echo
        echo "📁 Shell Script Commands (Currently Available):"
        echo "  env-manage      - Environment management"
        echo "  service-manage  - Service management"
        echo "  db-schema       - Database schema management"
        echo "  db-operations   - Database operations"
        echo "  quick-check     - Quick project check"
        echo
        echo "💡 Examples:"
        echo "  $0 check                    # Check prerequisites (OCaml)"
        echo "  $0 db-schema --help         # Database schema help"
        echo "  $0 env-manage --help        # Environment management help"
        echo
        echo "🔄 Migration Status:"
        echo "  - Prerequisites checking: ✅ Fully implemented in OCaml CLI"
        echo "  - Other operations: Shell scripts (will migrate to OCaml gradually)"
        ;;

    # ========================================
    # Error Handling
    # ========================================

    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for usage information"
        exit 1
        ;;
esac
