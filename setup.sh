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
# - Modular design allows backend script to be run independently if needed
# =============================================================================

set -e  # Exit immediately if any command fails (fail-fast approach)

# =============================================================================
# SOURCE SHARED UTILITIES
# =============================================================================
# Why source utilities? Eliminates code duplication and centralizes maintenance.
# The utilities script provides all common functions and prerequisite checking.
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
# Why verify project structure first? Ensures we're in the correct directory.
# This prevents running the script from the wrong location and provides
# clear error messages about expected project structure.
# =============================================================================
verify_project_structure || exit 1

# =============================================================================
# PREREQUISITES CHECK
# =============================================================================
# Why check prerequisites first? Fail early if essential tools are missing.
# This prevents wasting time on setup steps that will inevitably fail.
# We check the most critical tools needed for both backend and frontend.
# =============================================================================
check_all_prerequisites || exit 1

echo

# =============================================================================
# BACKEND SETUP ORCHESTRATION
# =============================================================================
# Why orchestrate backend setup? The root script delegates detailed backend
# configuration to a specialized script, maintaining separation of concerns.
# This allows the backend script to be run independently if needed.
# =============================================================================
print_status "Setting up backend..."

# Use safe directory change to prevent issues
original_dir=$(safe_cd "moneywise-backend") || exit 1

# Run the backend setup script
# Why check if setup.sh exists? Ensures the backend script is present before
# attempting to run it, providing clear error messages if missing.
if file_exists "setup.sh"; then
    print_status "Running backend setup script..."

    # Make the script executable
    # Why chmod +x? Ensures the script has execute permissions.
    # This prevents permission errors when trying to run the script.
    chmod +x setup.sh

    # Execute the backend setup script
    # Why execute from current directory? The backend script expects to be
    # run from the moneywise-backend directory for proper path resolution.
    ./setup.sh
else
    print_error "Backend setup script not found"
    print_warning "Expected: moneywise-backend/setup.sh"
    print_warning "This suggests the project structure is incomplete"
    restore_cd "$original_dir"
    exit 1
fi

# Return to root directory
# Why return to root? The root script needs to continue with frontend setup.
# restore_cd ensures we're back in the project root for the next steps.
restore_cd "$original_dir"

echo

# =============================================================================
# FRONTEND SETUP
# =============================================================================
# Why setup frontend after backend? Backend provides the API that frontend
# depends on, so ensuring backend is ready first prevents connection issues.
# Frontend setup is simpler - just dependency installation.
# =============================================================================
print_status "Setting up frontend..."

# Use safe directory change for frontend setup
original_dir=$(safe_cd "moneywise-app") || exit 1

# Install dependencies
# Why npm install? Installs all required packages defined in package.json.
# This ensures the React Native app has all necessary dependencies to run.
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
# Why return to root? The root script needs to be in the project root
# to provide the final summary and next steps.
restore_cd "$original_dir"

echo

# =============================================================================
# FINAL SUMMARY AND NEXT STEPS
# =============================================================================
# Why provide a comprehensive summary? Users need clear guidance on what
# was accomplished and what to do next. This reduces confusion and
# improves the overall setup experience.
# =============================================================================
# Final Summary
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
print_success "You're all set! The MoneyWise app is ready to use."
