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

    # ========================================
    # PHASE 1: Initial Setup & Prerequisites
    # ========================================

    "prereq-checker")
        # Check project prerequisites using existing shell script
        print_status "Using shell script for prerequisites checking..."
        "$PROJECT_ROOT/scripts/setup/prereq-checker.sh" "${@:2}"
        ;;

    # ========================================
    # PHASE 2: Environment & Configuration
    # ========================================

    "get-supabase-credentials")
        # Get Supabase credentials using existing shell script
        print_status "Using shell script to get Supabase credentials..."
        "$PROJECT_ROOT/scripts/setup/get-supabase-credentials.sh" "${@:2}"
        ;;

    "env-manager")
        # Environment management using existing shell scripts
        print_status "Using shell script for environment management..."
        "$PROJECT_ROOT/scripts/setup/env-manager.sh" "${@:2}"
        ;;

    # ========================================
    # PHASE 2.5: Project Setup & Installation
    # ========================================

    "setup")
        # Main project setup using root setup script
        print_status "Using main project setup script..."
        "$PROJECT_ROOT/setup.sh" "${@:2}"
        ;;

    "setup-backend")
        # Backend-specific setup using backend setup script
        print_status "Using backend setup script..."
        "$PROJECT_ROOT/moneywise-backend/setup.sh" "${@:2}"
        ;;

    # ========================================
    # PHASE 3: Database Setup & Management
    # ========================================

    "schema-manager")
        # Database schema management using existing shell scripts
        print_status "Using shell script for database schema management..."
        "$PROJECT_ROOT/scripts/database/schema-manager.sh" "${@:2}"
        ;;

    "db-operations")
        # Database operations using existing shell scripts
        print_status "Using shell script for database operations..."
        "$PROJECT_ROOT/scripts/database/db-operations.sh" "${@:2}"
        ;;

    # ========================================
    # PHASE 4: Service Management
    # ========================================

    "service-manager")
        # Service management using existing shell scripts
        print_status "Using shell script for service management..."
        "$PROJECT_ROOT/scripts/setup/service-manager.sh" "${@:2}"
        ;;

    # ========================================
    # PHASE 5: Testing & Validation
    # ========================================

    "test-schema-manager")
        # Test database schema using existing shell script
        print_status "Using shell script to test database schema..."
        "$PROJECT_ROOT/scripts/testing/test-schema-manager.sh" "${@:2}"
        ;;

    "test-db-connection")
        # Test database connection using existing shell script
        print_status "Using shell script to test database connection..."
        "$PROJECT_ROOT/scripts/testing/test-database-connection.sh" "${@:2}"
        ;;

    "test-setup-scripts")
        # Test setup scripts using existing shell script
        print_status "Using shell script to test setup scripts..."
        "$PROJECT_ROOT/scripts/testing/test-setup-scripts.sh" "${@:2}"
        ;;

    "run-all-tests")
        # Run all tests using existing shell script
        print_status "Using shell script to run all tests..."
        "$PROJECT_ROOT/scripts/testing/run-all-tests.sh" "${@:2}"
        ;;

    # ========================================
    # PHASE 6: Monitoring & Quick Checks
    # ========================================

    "quick-check")
        # Quick project check using existing shell script
        print_status "Using shell script for quick project check..."
        "$PROJECT_ROOT/scripts/quick-check.sh" "${@:2}"
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
        echo
        echo "  🚀 PHASE 1: Initial Setup & Prerequisites:"
        echo "    prereq-checker     - Check project prerequisites"
        echo
        echo "  ⚙️  PHASE 2: Environment & Configuration:"
        echo "    get-supabase-credentials    - Get Supabase credentials"
        echo "    env-manager        - Environment management"
        echo
        echo "  🚀 PHASE 2.5: Project Setup & Installation:"
        echo "    setup              - Complete project setup (root)"
        echo "    setup-backend      - Backend-specific setup"
        echo
        echo "  🗄️  PHASE 3: Database Setup & Management:"
        echo "    schema-manager     - Database schema management"
        echo "    db-operations      - Database operations"
        echo
        echo "  🔧 PHASE 4: Service Management:"
        echo "    service-manager     - Service management"
        echo
        echo "  🧪 PHASE 5: Testing & Validation:"
        echo "    test-schema-manager - Test database schema"
        echo "    test-db-connection  - Test database connection"
        echo "    test-setup-scripts  - Test setup scripts"
        echo "    run-all-tests       - Run all tests"
        echo
        echo "  📊 PHASE 6: Monitoring & Quick Checks:"
        echo "    quick-check         - Quick project check"
        echo
        echo "💡 Examples:"
        echo "  $0 check                    # Check prerequisites (OCaml)"
        echo "  $0 prereq-checker           # Check prerequisites (Shell)"
        echo "  $0 setup                    # Complete project setup"
        echo "  $0 setup-backend            # Backend setup only"
        echo "  $0 test-schema-manager      # Test database schema"
        echo "  $0 run-all-tests            # Run all tests"
        echo "  $0 schema-manager --help    # Database schema help"
        echo "  $0 env-manager --help       # Environment management help"
        echo
        echo "🔄 Typical Setup Workflow:"
        echo "  1. $0 prereq-checker            # Verify system requirements"
        echo "  2. $0 get-supabase-credentials  # Configure database access"
        echo "  3. $0 setup                     # Complete project setup"
        echo "  4. $0 setup-backend             # Backend-specific setup (if needed)"
        echo "  5. $0 schema-manager            # Set up database structure"
        echo "  6. $0 service-manager           # Start required services"
        echo "  7. $0 run-all-tests             # Validate everything works"
        echo "  8. $0 quick-check               # Monitor ongoing status"
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
