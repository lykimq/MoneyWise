#!/bin/bash

set -e  # Exit on any error

echo "🚀 MoneyWise Backend Setup"
echo "========================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    print_error "Please run this script from the moneywise-backend directory"
    exit 1
fi

# Check Rust installation
if ! command -v cargo &> /dev/null; then
    print_error "Rust/Cargo not found. Install from https://rustup.rs/"
    exit 1
fi
print_success "Rust/Cargo found"

# Check PostgreSQL installation
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL not found. Install from https://postgresql.org/download/"
    exit 1
fi
print_success "PostgreSQL found"

# Check if PostgreSQL is running
if ! pg_isready -q 2>/dev/null; then
    print_warning "PostgreSQL is not running. Attempting to start..."

    # Try to start PostgreSQL (different methods for different systems)
    if command -v systemctl &> /dev/null; then
        sudo systemctl start postgresql || {
            print_error "Failed to start PostgreSQL with systemctl"
            print_warning "Please start PostgreSQL manually and run this script again"
            exit 1
        }
    elif command -v brew &> /dev/null; then
        brew services start postgresql || {
            print_error "Failed to start PostgreSQL with brew"
            print_warning "Please start PostgreSQL manually and run this script again"
            exit 1
        }
    else
        print_error "Please start PostgreSQL manually and run this script again"
        exit 1
    fi

    # Wait a moment for PostgreSQL to start
    sleep 2

    if ! pg_isready -q; then
        print_error "PostgreSQL failed to start"
        exit 1
    fi
fi
print_success "PostgreSQL is running"

# Check Redis (optional)
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        print_success "Redis is running"
    else
        print_warning "Redis found but not running. Attempting to start..."
        if command -v systemctl &> /dev/null; then
            sudo systemctl start redis &> /dev/null || true
        elif command -v brew &> /dev/null; then
            brew services start redis &> /dev/null || true
        else
            redis-server --daemonize yes &> /dev/null || true
        fi

        sleep 1
        if redis-cli ping &> /dev/null; then
            print_success "Redis started successfully"
        else
            print_warning "Could not start Redis (optional - backend will work without it)"
        fi
    fi
else
    print_warning "Redis not found (optional - backend will work without it)"
fi

echo

# Create .env file if it doesn't exist
print_status "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise
RUST_LOG=info
EOF
    print_success "Created .env file with default configuration"
    print_warning "Please update DATABASE_URL in .env with your PostgreSQL credentials if needed"
else
    print_success ".env file already exists"
fi

echo

# Create database
print_status "Setting up database..."
DB_NAME="moneywise"

# Extract database name from DATABASE_URL if possible
if [ -f ".env" ]; then
    source .env
    if [[ $DATABASE_URL =~ /([^/]+)$ ]]; then
        DB_NAME="${BASH_REMATCH[1]}"
    fi
fi

if ! psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    print_status "Creating database '$DB_NAME'..."
    createdb "$DB_NAME" || {
        print_error "Failed to create database. Please check your PostgreSQL permissions"
        print_warning "You may need to:"
        print_warning "1. Update DATABASE_URL in .env with correct credentials"
        print_warning "2. Create the database manually: createdb $DB_NAME"
        exit 1
    }
    print_success "Database '$DB_NAME' created"
else
    print_success "Database '$DB_NAME' already exists"
fi

echo

# Install sqlx CLI
print_status "Setting up SQLx CLI..."
if ! command -v sqlx &> /dev/null; then
    print_status "Installing SQLx CLI (this may take a few minutes)..."
    cargo install sqlx-cli --no-default-features --features postgres || {
        print_error "Failed to install SQLx CLI"
        exit 1
    }
    print_success "SQLx CLI installed"
else
    print_success "SQLx CLI already installed"
fi

echo

# Run migrations
print_status "Running database migrations..."
sqlx migrate run || {
    print_error "Failed to run migrations"
    print_warning "Please check:"
    print_warning "1. DATABASE_URL in .env is correct"
    print_warning "2. PostgreSQL is accessible"
    print_warning "3. Database exists and has proper permissions"
    exit 1
}
print_success "Database migrations completed"

echo

# Build the project
print_status "Building the project..."
cargo build || {
    print_error "Failed to build the project"
    exit 1
}
print_success "Project built successfully"

echo
print_success "🎉 Setup complete!"
echo
echo "Next steps:"
echo "1. Review and update .env file if needed"
echo "2. Start the server: cargo run"
echo "3. Test the API: curl http://localhost:3000/api/budgets/overview"
echo
echo "The backend will be available at: http://localhost:3000"
echo "API endpoints will be at: http://localhost:3000/api/*"
echo
print_status "Starting the server..."
cargo run