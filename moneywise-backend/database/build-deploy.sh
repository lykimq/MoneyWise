#!/bin/bash

# MoneyWise Database Deployment Builder
# This script combines modular schema files into a single deployment script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print status function
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
SCHEMA_DIR="schema"
DEPLOY_DIR="deploy"
OUTPUT_FILE="supabase.sql"

# Header template
HEADER_TEMPLATE="-- MoneyWise Database Schema for Supabase Production Deployment
-- ⚠️  AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY  ⚠️
-- This file combines all schema components for one-time deployment to Supabase
-- Generated from modular schema files in database/schema/
-- Generated on: $(date)
--
-- To modify the schema:
-- 1. Edit files in ../schema/ directory
-- 2. Run this build script to regenerate this file
-- 3. Or edit ../migrations/ for development changes
--
-- ==============================================================================
-- TABLE CREATION
-- ==============================================================================
"

# Check if schema directory exists
if [ ! -d "$SCHEMA_DIR" ]; then
    print_error "Schema directory '$SCHEMA_DIR' not found!"
    exit 1
fi

# Check if deploy directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    print_error "Deploy directory '$DEPLOY_DIR' not found!"
    exit 1
fi

print_status "Building deployment script from modular schema files..."

# Create output file with header
echo "$HEADER_TEMPLATE" > "$DEPLOY_DIR/$OUTPUT_FILE"

# Function to add file content with separator
add_file_content() {
    local file="$1"
    local description="$2"

    if [ -f "$file" ]; then
        echo "" >> "$DEPLOY_DIR/$OUTPUT_FILE"
        echo "-- ==============================================================================" >> "$DEPLOY_DIR/$OUTPUT_FILE"
        echo "-- $description" >> "$DEPLOY_DIR/$OUTPUT_FILE"
        echo "-- ==============================================================================" >> "$DEPLOY_DIR/$OUTPUT_FILE"
        echo "" >> "$DEPLOY_DIR/$OUTPUT_FILE"
        cat "$file" >> "$DEPLOY_DIR/$OUTPUT_FILE"
        print_status "Added $description from $file"
    else
        print_warning "File $file not found, skipping $description"
    fi
}

# Add schema files in order
add_file_content "$SCHEMA_DIR/tables.sql" "TABLE CREATION"
add_file_content "$SCHEMA_DIR/indexes.sql" "INDEXES FOR PERFORMANCE"
add_file_content "$SCHEMA_DIR/triggers.sql" "TRIGGERS FOR AUTOMATIC updated_at COLUMNS"
add_file_content "$SCHEMA_DIR/sample_data.sql" "SAMPLE DATA INSERTION"

# Add footer
echo "" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- ==============================================================================" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- VERIFICATION QUERIES (Optional - you can run these to verify the data)" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- ==============================================================================" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- Uncomment these to verify your data after import:" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- SELECT 'Category Groups' as table_name, count(*) as row_count FROM category_groups" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- UNION ALL" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- SELECT 'Categories' as table_name, count(*) as row_count FROM categories" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- UNION ALL" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- SELECT 'Budgets' as table_name, count(*) as row_count FROM budgets;" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- SELECT * FROM category_groups ORDER BY sort_order;" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- SELECT * FROM categories ORDER BY name;" >> "$DEPLOY_DIR/$OUTPUT_FILE"
echo "-- SELECT * FROM budgets ORDER BY year, month, category_id;" >> "$DEPLOY_DIR/$OUTPUT_FILE"

print_status "Deployment script built successfully: $DEPLOY_DIR/$OUTPUT_FILE"
print_status "File size: $(wc -l < "$DEPLOY_DIR/$OUTPUT_FILE") lines"

# Make the script executable
chmod +x "$DEPLOY_DIR/$OUTPUT_FILE"

print_status "Build complete! You can now use $DEPLOY_DIR/$OUTPUT_FILE for Supabase deployment."
