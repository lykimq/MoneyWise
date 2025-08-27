#!/bin/bash

# MoneyWise Hybrid Wrapper Script
# Uses OCaml tools for complex operations and shell scripts for simple file operations
# This is the bridge between the old shell script system and the new OCaml tools

# Load core utilities from existing scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CORE_UTILS="$PROJECT_ROOT/scripts/core/output-utils.sh"

# Source core utilities if available
if [ -f "$CORE_UTILS" ]; then
    source "$CORE_UTILS"
else
    # Fallback output functions
    print_status() { echo "ℹ️  $1"; }
    print_success() { echo "✅ $1"; }
    print_error() { echo "❌ $1"; }
    print_warning() { echo "⚠️  $1"; }
fi

# OCaml tool path
OCAML_TOOL="$SCRIPT_DIR/ocaml/_build/default/bin/moneywise_cli.exe"

# Check if OCaml tool is available
check_ocaml_tool() {
    if [ -f "$OCAML_TOOL" ]; then
        return 0
    else
        print_warning "OCaml tool not found at $OCAML_TOOL"
        print_status "Building OCaml tool..."
        if cd "$SCRIPT_DIR/ocaml" && dune build; then
            cd "$PROJECT_ROOT"
            return 0
        else
            print_error "Failed to build OCaml tool"
            return 1
        fi
    fi
}

# Function to handle complex operations with OCaml
handle_complex_operation() {
    local operation="$1"
    shift

    if check_ocaml_tool; then
        print_status "Using OCaml tool for complex operation: $operation"
        "$OCAML_TOOL" "$operation" "$@"
        return $?
    else
        print_error "Cannot perform complex operation: OCaml tool unavailable"
        return 1
    fi
}

# Function to handle simple file operations with shell
handle_simple_operation() {
    local operation="$1"
    shift

    print_status "Using shell script for simple operation: $operation"

    case "$operation" in
        "file-copy"|"cp")
            if [ $# -ge 2 ]; then
                cp "$@"
                print_success "File copy completed"
            else
                print_error "Usage: file-copy <source> <destination>"
                return 1
            fi
            ;;
        "file-move"|"mv")
            if [ $# -ge 2 ]; then
                mv "$@"
                print_success "File move completed"
            else
                print_error "Usage: file-move <source> <destination>"
                return 1
            fi
            ;;
        "file-delete"|"rm")
            if [ $# -ge 1 ]; then
                rm "$@"
                print_success "File deletion completed"
            else
                print_error "Usage: file-delete <file>..."
                return 1
            fi
            ;;
        "make-executable"|"chmod")
            if [ $# -ge 1 ]; then
                chmod +x "$@"
                print_success "Files made executable"
            else
                print_error "Usage: make-executable <file>..."
                return 1
            fi
            ;;
        "create-dir"|"mkdir")
            if [ $# -ge 1 ]; then
                mkdir -p "$@"
                print_success "Directories created"
            else
                print_error "Usage: create-dir <directory>..."
                return 1
            fi
            ;;
        *)
            print_error "Unknown simple operation: $operation"
            return 1
            ;;
    esac
}

# Main command routing
case "${1:-help}" in
    # Complex operations - use OCaml tool
    "setup"|"check"|"test"|"status"|"database"|"api"|"config")
        handle_complex_operation "$@"
        ;;

    # Simple operations - use shell scripts
    "file-copy"|"cp"|"file-move"|"mv"|"file-delete"|"rm"|"make-executable"|"chmod"|"create-dir"|"mkdir")
        handle_simple_operation "$@"
        ;;

    # Legacy shell script operations - delegate to existing scripts
    "legacy-setup")
        print_status "Using legacy shell script setup"
        "$PROJECT_ROOT/setup.sh"
        ;;
    "legacy-check")
        print_status "Using legacy shell script check"
        "$PROJECT_ROOT/scripts/core/check-utils.sh"
        ;;

    # Help and information
    "help"|"--help"|"-h")
        echo "🚀 MoneyWise Hybrid Wrapper"
        echo "=========================="
        echo
        echo "This wrapper intelligently routes operations:"
        echo
        echo "🔧 Complex Operations (OCaml):"
        echo "  setup      - Setup complete project"
        echo "  check      - Check prerequisites and status"
        echo "  test       - Run project tests"
        echo "  status     - Show project status"
        echo "  database   - Database operations"
        echo "  api        - API operations"
        echo "  config     - Configuration management"
        echo
        echo "📁 Simple Operations (Shell):"
        echo "  file-copy <src> <dst>  - Copy files"
        echo "  file-move <src> <dst>  - Move files"
        echo "  file-delete <file>     - Delete files"
        echo "  make-executable <file> - Make files executable"
        echo "  create-dir <dir>       - Create directories"
        echo
        echo "🔄 Legacy Operations:"
        echo "  legacy-setup           - Use original setup.sh"
        echo "  legacy-check           - Use original check scripts"
        echo
        echo "💡 Examples:"
        echo "  $0 setup                    # Setup project (OCaml)"
        echo "  $0 file-copy src.txt dst/   # Copy file (Shell)"
        echo "  $0 status                   # Check status (OCaml)"
        ;;

    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for usage information"
        exit 1
        ;;
esac
