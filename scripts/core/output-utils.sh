#!/bin/bash

# MoneyWise Output Utilities
# Provides consistent output formatting and user experience across all scripts
# Handles: colors, print functions, and visual feedback

# Color definitions for consistent output
RED='\033[0;31m'      # Error messages
GREEN='\033[0;32m'    # Success messages
YELLOW='\033[1;33m'   # Warning messages
BLUE='\033[0;34m'     # Status/info messages
CYAN='\033[0;36m'     # Additional info
NC='\033[0m'          # No Color (reset)

# Print functions for different message types
print_status() {
    echo -e "${BLUE}▶${NC} $1"    # Blue arrow for status updates
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"  # Green checkmark for success
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1" # Yellow warning for non-critical issues
}

print_error() {
    echo -e "${RED}❌${NC} $1"    # Red X for errors
}

print_info() {
    echo -e "${CYAN}ℹ️${NC} $1"   # Cyan info for additional details
}

# Section headers for clear visual organization
print_section_header() {
    local title="$1"
    echo
    echo -e "${BLUE}=============================================================================${NC}"
    echo -e "${BLUE} $title${NC}"
    echo -e "${BLUE}=============================================================================${NC}"
}

print_subsection_header() {
    local title="$1"
    echo
    echo -e "${CYAN}--- $title ---${NC}"
}

# Progress indicators to show script activity
print_progress() {
    local message="$1"
    echo -e "${BLUE}⏳${NC} $message..."
}

# Utility functions for consistent formatting
print_separator() {
    echo "─────────────────────────────────────────────────────────────────────────────"
}
