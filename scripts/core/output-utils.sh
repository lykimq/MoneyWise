#!/bin/bash

# =============================================================================
# MoneyWise Output Utilities
# =============================================================================
# This module provides consistent output formatting and user experience.
# It handles: colors, print functions, and visual feedback.
#
# Why this approach?
# - Centralized output formatting for consistency across all scripts
# - Easy to modify colors, symbols, or formatting in one place
# - Improves readability and user experience during setup
# =============================================================================

# =============================================================================
# COLOR OUTPUT SYSTEM
# =============================================================================
# Why use colors? Improves readability and user experience during setup.
# ANSI color codes work in most modern terminals and provide visual feedback.
# =============================================================================
RED='\033[0;31m'      # Error messages
GREEN='\033[0;32m'    # Success messages
YELLOW='\033[1;33m'   # Warning messages
BLUE='\033[0;34m'     # Status/info messages
CYAN='\033[0;36m'     # Additional info
NC='\033[0m'          # No Color (reset)

# =============================================================================
# PRINT FUNCTIONS
# =============================================================================
# Why functions? DRY principle - reusable, consistent output formatting.
# Each function handles a specific message type with appropriate color coding.
# =============================================================================
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

# =============================================================================
# SECTION HEADERS
# =============================================================================
# Why section headers? Provides clear visual separation and organization.
# Makes it easier for users to follow the setup process.
# =============================================================================
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

# =============================================================================
# PROGRESS INDICATORS
# =============================================================================
# Why progress indicators? Shows users that the script is working.
# Prevents users from thinking the script has frozen.
# =============================================================================
print_progress() {
    local message="$1"
    echo -e "${BLUE}⏳${NC} $message..."
}

# =============================================================================
# FORMATTING UTILITIES
# =============================================================================
# Why formatting utilities? Ensures consistent spacing and layout.
# Makes output more professional and easier to read.
# =============================================================================
print_separator() {
    echo "─────────────────────────────────────────────────────────────────────────────"
}
