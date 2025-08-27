#!/bin/bash

# =============================================================================
# MoneyWise Root Setup Script
# =============================================================================
# This script orchestrates the complete setup of the MoneyWise project.
# It handles: project verification, backend setup, and frontend setup.
#
# Why this approach?
# - Single command setup from project root improves user experience
# - Orchestration separates concerns between root and backend scripts
# - Root script focuses on project-level setup, backend script handles details
# - Works with the new modular database structure
# =============================================================================

set -e  # Exit immediately if any command fails

# =============================================================================
# SOURCE SHARED UTILITIES
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UTILS_SCRIPT="$SCRIPT_DIR/scripts/setup-utils.sh"

if [ ! -f "$UTILS_SCRIPT" ]; then
    echo "❌ Error: Shared utilities script not found at $UTILS_SCRIPT"
    echo "Please ensure the scripts/setup-utils.sh file exists"
    exit 1
fi

# Source the utilities script to get all shared functions
source "$UTILS_SCRIPT"

echo "🚀 MoneyWise Full Project Setup"
echo "==============================="
echo

# =============================================================================
# PROJECT STRUCTURE VERIFICATION
# =============================================================================
verify_project_structure || exit 1

# =============================================================================
# PREREQUISITES CHECK
# =============================================================================
check_all_prerequisites || exit 1

echo

# =============================================================================
# BACKEND SETUP ORCHESTRATION
# =============================================================================
print_status "Setting up backend..."

# Use safe directory change to prevent issues
original_dir=$(safe_cd "moneywise-backend") || exit 1

# Run the backend setup script
if file_exists "setup.sh"; then
    print_status "Running backend setup script..."

    # Make the script executable
    chmod +x setup.sh

    # Execute the backend setup script
    "$(pwd)/setup.sh"
else
    print_error "Backend setup script not found"
    print_warning "Expected: moneywise-backend/setup.sh"
    print_warning "This suggests the project structure is incomplete"
    restore_cd "$original_dir"
    exit 1
fi

# Return to root directory
restore_cd "$original_dir"

echo

# =============================================================================
# FRONTEND SETUP
# =============================================================================
print_status "Setting up frontend..."

# Use safe directory change for frontend setup
original_dir=$(safe_cd "moneywise-app") || exit 1

# Install dependencies
print_status "Installing frontend dependencies..."
npm install || {
    print_error "Failed to install frontend dependencies"
    print_warning "This may be due to network issues or npm configuration problems"
    print_warning "Check your internet connection and npm registry settings"
    restore_cd "$original_dir"
    exit 1
}
print_success "Frontend dependencies installed"

# Return to root directory
restore_cd "$original_dir"

echo

# =============================================================================
# FINAL SUMMARY AND NEXT STEPS
# =============================================================================
print_success "🎉 MoneyWise setup complete!"
echo
echo "🚀 What's Running:"
echo "- Backend API: http://localhost:3000/api"
echo "- Frontend: Ready to start with 'npm start' in moneywise-app/"
echo
echo "📱 Next Steps:"
echo "1. Backend is running in the backend terminal"
echo "2. Start frontend: cd moneywise-app && npm start"
echo "3. Test API: curl http://localhost:3000/api/budgets/overview"
echo
echo "🔧 Project Structure:"
echo "- Backend: Rust API with PostgreSQL + Redis"
echo "- Frontend: React Native with Expo"
echo "- Database: Sample budget data loaded and ready"
echo
echo "🗄️  Database Features:"
echo "- Modular schema structure in database/schema/"
echo "- Auto-generated production scripts with build-deploy.sh"
echo "- Support for both Supabase and local PostgreSQL"
echo
print_success "You're all set! The MoneyWise app is ready to use."
