#!/bin/bash

# MoneyWise Root Setup Script
# Sets up the complete project: verifies structure, runs backend setup, installs frontend

# Load core utilities
ROOT_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_LOADER="$ROOT_SCRIPT_DIR/scripts/core/module-loader.sh"

# Load module loader first
if [ ! -f "$MODULE_LOADER" ]; then
    echo "❌ Error: Module loader not found at $MODULE_LOADER"
    exit 1
fi

source "$MODULE_LOADER"

# Load additional utilities
SETUP_UTILS="$ROOT_SCRIPT_DIR/scripts/core/setup-utils.sh"
CHECK_UTILS="$ROOT_SCRIPT_DIR/scripts/core/check-utils.sh"
PATH_UTILS="$ROOT_SCRIPT_DIR/scripts/core/path-utils.sh"

source "$SETUP_UTILS"
source "$CHECK_UTILS"
source "$PATH_UTILS"

echo "🚀 MoneyWise Full Project Setup"
echo "==============================="
echo

# Verify project structure
verify_project_structure || exit 1

# Check prerequisites
check_all_prerequisites || exit 1

echo

# Setup backend
print_status "Setting up backend..."

# Use safe directory change to prevent issues
original_dir=$(safe_cd "moneywise-backend") || exit 1

# Run the backend setup script
if check_file_exists "setup.sh" "Backend setup script" true; then
    print_status "Running backend setup script..."

    # Make the script executable
    chmod +x setup.sh

    # Execute the backend setup script
    "$(pwd)/setup.sh"
else
    restore_cd "$original_dir"
    exit 1
fi

# Return to root directory
restore_cd "$original_dir"

echo

# Setup frontend
print_status "Setting up frontend..."

# Use safe directory change for frontend setup
original_dir=$(safe_cd "moneywise-app") || exit 1

# Install dependencies
print_status "Installing frontend dependencies..."
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    print_warning "This may be due to network issues or npm configuration problems"
    print_warning "Check your internet connection and npm registry settings"
    restore_cd "$original_dir"
    exit 1
fi

# Return to root directory
restore_cd "$original_dir"

echo

# Final summary
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