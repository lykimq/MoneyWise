#!/bin/bash

# MoneyWise Hybrid Wrapper Script
#
# This script provides a unified interface that routes commands to either:
# 1. OCaml CLI tools (DEFAULT - for complex operations like prerequisites checking)
# 2. Shell scripts (use --shell flag to explicitly run shell commands)
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
    print_info() { echo "💡 $1"; }
    print_section_header() {
        echo
        echo "$1"
        echo "$(printf '=%.0s' $(seq 1 ${#1}))"
        echo
    }
fi

# OCaml tool path
OCAML_TOOL="$SCRIPT_DIR/ocaml/_build/default/bin/moneywise_cli.exe"

# Check if OCaml tool is available and build if needed
check_ocaml_tool() {
    if [ -f "$OCAML_TOOL" ]; then
        return 0
    else
        # Build quietly to avoid duplicate messages
        if cd "$SCRIPT_DIR/ocaml" && dune build --display=quiet; then
            cd "$PROJECT_ROOT"
            return 0
        else
            print_error "Failed to build OCaml tool"
            return 1
        fi
    fi
}

# Parse command line arguments
SHELL_MODE=false
COMMAND=""
ARGS=()

# Parse arguments to detect --shell flag
while [[ $# -gt 0 ]]; do
    case $1 in
        --shell)
            SHELL_MODE=true
            shift
            ;;
        --help|-h)
            COMMAND="help"
            shift
            ;;
        *)
            if [[ -z "$COMMAND" ]]; then
                COMMAND="$1"
            else
                ARGS+=("$1")
            fi
            shift
            ;;
    esac
done

# Set default command if none provided
COMMAND="${COMMAND:-help}"

# Route commands to appropriate handlers
case "$COMMAND" in
    # ========================================
    # OCaml CLI Commands (DEFAULT - Currently Implemented)
    # ========================================

    "setup")
        if [[ "$SHELL_MODE" == true ]]; then
            print_error "Setup command is only available in OCaml mode"
            print_info "The OCaml tool will verify project structure and prerequisites"
            print_info "Then use individual shell commands for remaining setup steps:"
            print_info "  ./tools/moneywise-hybrid.sh --shell setup-backend"
            print_info "  ./tools/moneywise-hybrid.sh --shell get-supabase-credentials"
            print_info "  ./tools/moneywise-hybrid.sh --shell service-manager"
            exit 1
        fi

        # Setup project using OCaml tool (DEFAULT)
        if check_ocaml_tool; then
            # Export project root for OCaml tool
            export PROJECT_ROOT

            # Run OCaml setup tool directly without additional output
            if [[ "${#ARGS[@]}" -eq 0 ]]; then
                # If no args provided, use project root
                "$OCAML_TOOL" setup --project-root "$PROJECT_ROOT"

                # If verification passes, print next steps
                if [ $? -eq 0 ]; then
                    print_section_header "Next Steps"
                    print_info "Project structure and prerequisites verified!"
                    print_info "To complete setup, run these commands in order:"
                    echo
                    print_info "1. Setup backend:"
                    echo "   ./tools/moneywise-hybrid.sh --shell setup-backend"
                    echo
                    print_info "2. Configure environment:"
                    echo "   ./tools/moneywise-hybrid.sh --shell get-supabase-credentials"
                    echo
                    print_info "3. Start services:"
                    echo "   ./tools/moneywise-hybrid.sh --shell service-manager"
                    echo
                    print_info "4. Verify setup:"
                    echo "   ./tools/moneywise-hybrid.sh --shell quick-check"
                fi
            else
                # Pass through any provided args
                "$OCAML_TOOL" setup "${ARGS[@]}"
            fi
        else
            print_error "Cannot setup project: OCaml tool unavailable"
            exit 1
        fi
        ;;

    "check")
        # Check project prerequisites using OCaml tool (DEFAULT)
        if check_ocaml_tool; then
            print_status "Checking prerequisites with OCaml tool (default)..."
            "$OCAML_TOOL" check "${ARGS[@]}"
        else
            print_error "Cannot check prerequisites: OCaml tool unavailable"
            exit 1
        fi
        ;;

    "status")
        # Show project status using OCaml tool (DEFAULT)
        if check_ocaml_tool; then
            print_status "Getting project status with OCaml tool (default)..."
            "$OCAML_TOOL" status "${ARGS[@]}"
        else
            print_error "Cannot get status: OCaml tool unavailable"
            exit 1
        fi
        ;;

    "test")
        # Run project tests using OCaml tool (DEFAULT)
        if check_ocaml_tool; then
            print_status "Running tests with OCaml tool (default)..."
            "$OCAML_TOOL" test "${ARGS[@]}"
        else
            print_error "Cannot run tests: OCaml tool unavailable"
            exit 1
        fi
        ;;

    # ========================================
    # Shell Script Commands (Use --shell flag)
    # ========================================

    "prereq-checker")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script for prerequisites checking (--shell mode)..."
            "$PROJECT_ROOT/scripts/setup/prereq-checker.sh" "${ARGS[@]}"
        else
            print_status "Prerequisites checking defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                "$OCAML_TOOL" check "${ARGS[@]}"
            else
                print_error "Cannot check prerequisites: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "get-supabase-credentials")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script to get Supabase credentials (--shell mode)..."
            "$PROJECT_ROOT/scripts/setup/get-supabase-credentials.sh" "${ARGS[@]}"
        else
            print_status "get-supabase-credentials defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement get-supabase-credentials in OCaml CLI tool"
            else
                print_error "Cannot get Supabase credentials: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "env-manager")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script for environment management (--shell mode)..."
            "$PROJECT_ROOT/scripts/setup/env-manager.sh" "${ARGS[@]}"
        else
            print_status "env-manager defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement env-manager in OCaml CLI tool"
            else
                print_error "Cannot get environment manager: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "setup-backend")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using backend setup script (--shell mode)..."
            "$PROJECT_ROOT/moneywise-backend/setup.sh" "${ARGS[@]}"
        else
            print_status "setup-backend defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement setup-backend in OCaml CLI tool"
            else
                print_error "Cannot setup backend: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "schema-manager")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script for database schema management (--shell mode)..."
            "$PROJECT_ROOT/scripts/database/schema-manager.sh" "${ARGS[@]}"
        else
            print_status "schema-manager defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement schema-manager in OCaml CLI tool"
            else
                print_error "Cannot manage database schema: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "db-operations")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script for database operations (--shell mode)..."
            "$PROJECT_ROOT/scripts/database/db-operations.sh" "${ARGS[@]}"
        else
            print_status "db-operations defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement db-operations in OCaml CLI tool"
            else
                print_error "Cannot perform database operations: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "service-manager")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script for service management (--shell mode)..."
            "$PROJECT_ROOT/scripts/setup/service-manager.sh" "${ARGS[@]}"
        else
            print_status "service-manager defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement service-manager in OCaml CLI tool"
            else
                print_error "Cannot manage services: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "test-schema-manager")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script to test database schema (--shell mode)..."
            "$PROJECT_ROOT/scripts/testing/test-schema-manager.sh" "${ARGS[@]}"
        else
            print_status "test-schema-manager defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement test-schema-manager in OCaml CLI tool"
            else
                print_error "Cannot test database schema: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "test-db-connection")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script to test database connection (--shell mode)..."
            "$PROJECT_ROOT/scripts/testing/test-database-connection.sh" "${ARGS[@]}"
        else
            print_status "test-db-connection defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement test-db-connection in OCaml CLI tool"
            else
                print_error "Cannot test database connection: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "test-setup-scripts")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script to test setup scripts (--shell mode)..."
            "$PROJECT_ROOT/scripts/testing/test-setup-scripts.sh" "${ARGS[@]}"
        else
            print_status "test-setup-scripts defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement test-setup-scripts in OCaml CLI tool"
            else
                print_error "Cannot test setup scripts: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "run-all-tests")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script to run all tests (--shell mode)..."
            "$PROJECT_ROOT/scripts/testing/run-all-tests.sh" "${ARGS[@]}"
        else
            print_status "run-all-tests defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement run-all-tests in OCaml CLI tool"
            else
                print_error "Cannot run all tests: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    "quick-check")
        if [[ "$SHELL_MODE" == true ]]; then
            print_status "Using shell script for quick project check (--shell mode)..."
            "$PROJECT_ROOT/scripts/quick-check.sh" "${ARGS[@]}"
        else
            print_status "quick-check defaults to OCaml tool. Use --shell to run shell script instead."
            if check_ocaml_tool; then
                print_status "TODO: Implement quick-check in OCaml CLI tool"
            else
                print_error "Cannot run quick check: OCaml tool unavailable"
                exit 1
            fi
        fi
        ;;

    # ========================================
    # Help and Information
    # ========================================

    "help"|"--help"|"-h")
        echo "🚀 MoneyWise Hybrid Wrapper"
        echo "=========================="
        echo
        echo "This wrapper provides a unified interface with OCaml tools as DEFAULT:"
        echo
        echo "🔧 OCaml CLI Commands (DEFAULT - No flags needed):"
        echo "  setup      - Setup project (OCaml)"
        echo "  check      - Check project prerequisites (OCaml)"
        echo "  status     - Show project status (OCaml)"
        echo "  test       - Run project tests (OCaml)"
        echo
        echo "📁 Shell Script Commands (Use --shell flag):"
        echo
        echo "  🚀 PHASE 1: Initial Setup & Prerequisites:"
        echo "    prereq-checker     - Check project prerequisites (Shell)"
        echo
        echo "  ⚙️  PHASE 2: Environment & Configuration:"
        echo "    get-supabase-credentials    - Get Supabase credentials (Shell)"
        echo "    env-manager        - Environment management (Shell)"
        echo
        echo "  🚀 PHASE 2.5: Project Setup & Installation:"
        echo "    setup-backend      - Backend-specific setup (Shell)"
        echo
        echo "  🗄️  PHASE 3: Database Setup & Management:"
        echo "    schema-manager     - Database schema management (Shell)"
        echo "    db-operations      - Database operations (Shell)"
        echo
        echo "  🔧 PHASE 4: Service Management:"
        echo "    service-manager     - Service management (Shell)"
        echo
        echo "  🧪 PHASE 5: Testing & Validation:"
        echo "    test-schema-manager - Test database schema (Shell)"
        echo "    test-db-connection  - Test database connection (Shell)"
        echo "    test-setup-scripts  - Test setup scripts (Shell)"
        echo "    run-all-tests       - Run all tests (Shell)"
        echo
        echo "  📊 PHASE 6: Monitoring & Quick Checks:"
        echo "    quick-check         - Quick project check (Shell)"
        echo
        echo "💡 Examples:"
        echo "  $0 setup                    # Setup project (OCaml - DEFAULT)"
        echo "  $0 check                    # Check prerequisites (OCaml - DEFAULT)"
        echo "  $0 --shell prereq-checker   # Check prerequisites (Shell)"
        echo "  $0 --shell setup-backend    # Backend setup (Shell)"
        echo "  $0 --shell schema-manager   # Database schema (Shell)"
        echo "  $0 --shell run-all-tests    # Run all tests (Shell)"
        echo
        echo "🔄 Typical Setup Workflow:"
        echo "  1. $0 setup                     # Complete project setup (OCaml)"
        echo "  2. $0 check                     # Verify setup was successful (OCaml)"
        echo "  3. $0 --shell get-supabase-credentials  # Configure database access (Shell)"
        echo "  4. $0 --shell setup-backend     # Backend-specific setup (Shell)"
        echo "  5. $0 --shell schema-manager    # Set up database structure (Shell)"
        echo "  6. $0 --shell service-manager   # Start required services (Shell)"
        echo "  7. $0 --shell run-all-tests     # Validate everything works (Shell)"
        echo "  8. $0 --shell quick-check       # Monitor ongoing status (Shell)"
        echo
        echo "📝 Note: OCaml tools are the DEFAULT. Use --shell flag to run shell scripts."
        ;;

    # ========================================
    # Error Handling
    # ========================================

    *)
        print_error "Unknown command: $COMMAND"
        print_status "Use '$0 help' for usage information"
        exit 1
        ;;
esac
