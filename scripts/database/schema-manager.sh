#!/bin/bash

# MoneyWise Schema Manager
# Handles database schema operations for MoneyWise
# Manages: schema verification, migration support, and schema validation

# Load core utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$SCRIPT_DIR/../core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load setup utilities for database functions
SETUP_UTILS="$SCRIPT_DIR/../core/setup-utils.sh"
if [ ! -f "$SETUP_UTILS" ]; then
    print_error "Setup utilities not found at $SETUP_UTILS"
    exit 1
fi
source "$SETUP_UTILS"

# Schema verification to ensure database is working correctly
# Catches issues early rather than when the application tries to run
# Note: verify_database_schema function is defined in setup-utils.sh to avoid duplication

# Additional schema management functions
validate_schema_structure() {
    local database_url="$1"

    print_status "Validating schema structure..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    # Check if all required tables exist
    local required_tables=("category_groups" "categories" "budgets")
    local missing_tables=()

    for table in "${required_tables[@]}"; do
        local table_exists
        table_exists=$(psql "$database_url" -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table');" -t 2>/dev/null | tr -d ' ' || echo "f")

        if [ "$table_exists" != "t" ]; then
            missing_tables+=("$table")
        fi
    done

    if [ ${#missing_tables[@]} -eq 0 ]; then
        print_success "All required tables exist"
        return 0
    else
        print_error "Missing required tables: ${missing_tables[*]}"
        return 1
    fi
}

check_schema_constraints() {
    local database_url="$1"

    print_status "Checking schema constraints..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    # Check if foreign key constraints exist
    local fk_check
    fk_check=$(psql "$database_url" -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY';" -t 2>/dev/null | tr -d ' ' || echo "0")

    if [ "$fk_check" -gt 0 ]; then
        print_success "Foreign key constraints found ($fk_check constraints)"
        return 0
    else
        print_warning "No foreign key constraints found - this may indicate incomplete schema"
        return 1
    fi
}

validate_sample_data() {
    local database_url="$1"

    print_status "Validating sample data integrity..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    # Check if category_groups has data
    local category_groups_count
    category_groups_count=$(psql "$database_url" -c "SELECT COUNT(*) FROM category_groups;" -t 2>/dev/null | tr -d ' ' || echo "0")

    if [ "$category_groups_count" -gt 0 ]; then
        print_success "Category groups found ($category_groups_count entries)"
    else
        print_warning "No category groups found"
    fi

    # Check if categories has data
    local categories_count
    categories_count=$(psql "$database_url" -c "SELECT COUNT(*) FROM categories;" -t 2>/dev/null | tr -d ' ' || echo "0")

    if [ "$categories_count" -gt 0 ]; then
        print_success "Categories found ($categories_count entries)"
    else
        print_warning "No categories found"
    fi

    return 0
}

run_schema_migration() {
    local database_url="$1"
    local migration_file="$2"

    print_status "Running schema migration..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    if [ -z "$migration_file" ]; then
        print_error "No migration file specified"
        return 1
    fi

    if [ ! -f "$migration_file" ]; then
        print_error "Migration file not found: $migration_file"
        return 1
    fi

    print_status "Applying migration: $migration_file"
    if psql "$database_url" -f "$migration_file" >/dev/null 2>&1; then
        print_success "Migration applied successfully"
        return 0
    else
        print_error "Migration failed"
        return 1
    fi
}

generate_schema_report() {
    local database_url="$1"

    print_status "Generating schema report..."

    if [ -z "$database_url" ]; then
        print_error "No database URL provided"
        return 1
    fi

    # Get table counts
    local tables_info
    tables_info=$(psql "$database_url" -c "
        SELECT
            schemaname,
            tablename,
            n_tup_ins as inserts,
            n_tup_upd as updates,
            n_tup_del as deletes
        FROM pg_stat_user_tables
        ORDER BY tablename;
    " 2>/dev/null)

    if [ $? -eq 0 ]; then
        print_success "Schema report generated:"
        echo "$tables_info"
    else
        print_warning "Could not generate complete schema report"
    fi

    return 0
}

# Main schema management function
manage_schema() {
    local database_url="$1"
    local action="${2:-verify}"

    if [ -z "$database_url" ]; then
        print_error "Usage: manage_schema <database_url> [action]"
        print_error "Actions: verify, validate, migrate, report"
        return 1
    fi

    case "$action" in
        "verify")
            print_status "Running schema verification..."
            verify_database_schema "$database_url"
            ;;
        "validate")
            print_status "Running comprehensive schema validation..."
            validate_schema_structure "$database_url" && \
            check_schema_constraints "$database_url" && \
            validate_sample_data "$database_url"
            ;;
        "migrate")
            local migration_file="$3"
            if [ -z "$migration_file" ]; then
                print_error "Migration file required for migrate action"
                return 1
            fi
            run_schema_migration "$database_url" "$migration_file"
            ;;
        "report")
            generate_schema_report "$database_url"
            ;;
        *)
            print_error "Unknown action: $action"
            print_error "Valid actions: verify, validate, migrate, report"
            return 1
            ;;
    esac
}

# Main execution when script is run directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # Script is being run directly
    if [ $# -lt 1 ]; then
        echo "Usage: $0 <database_url> [action] [migration_file]"
        echo "Actions:"
        echo "  verify   - Verify basic schema (default)"
        echo "  validate - Comprehensive schema validation"
        echo "  migrate  - Run migration file"
        echo "  report   - Generate schema report"
        echo ""
        echo "Examples:"
        echo "  $0 postgresql://user:pass@localhost:5432/moneywise"
        echo "  $0 postgresql://user:pass@localhost:5432/moneywise validate"
        echo "  $0 postgresql://user:pass@localhost:5432/moneywise migrate /path/to/migration.sql"
        exit 1
    fi

    DATABASE_URL="$1"
    ACTION="${2:-verify}"
    MIGRATION_FILE="$3"

    # Test database connection first
    if ! test_database_connection "$DATABASE_URL"; then
        exit 1
    fi

    # Run the requested action
    if [ "$ACTION" = "migrate" ]; then
        manage_schema "$DATABASE_URL" "$ACTION" "$MIGRATION_FILE"
    else
        manage_schema "$DATABASE_URL" "$ACTION"
    fi
fi