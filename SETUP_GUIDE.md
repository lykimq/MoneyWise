# MoneyWise Setup Guide

Get the MoneyWise personal finance app running in 5 minutes! This guide covers both the Rust backend API and React Native frontend.

## 🚀 Quick Start

### Prerequisites
- **Rust** (latest stable) - [Install here](https://rustup.rs/)
- **Node.js 18+** - [Install here](https://nodejs.org/)
- **PostgreSQL 12+** - [Install here](https://postgresql.org/download/)
- **Redis** (optional but recommended) - [Install here](https://redis.io/download/)

### Option 1: Automated Setup (Recommended)
```bash
# Clone and navigate to the project
git clone <repository-url>
cd MoneyWise

# Run the automated setup script
cd moneywise-backend
./setup.sh

# The script will:
# ✅ Check prerequisites
# ✅ Create database and .env file
# ✅ Install dependencies and run migrations
# ✅ Start the backend server
```

### Option 2: Manual Setup
If you prefer manual control, follow the detailed steps below.

---

## 🔧 Backend Setup (Manual)

### 1. Start Required Services
```bash
# Ubuntu/Debian
sudo systemctl start postgresql
sudo systemctl start redis  # Optional

# macOS (with Homebrew)
brew services start postgresql
brew services start redis    # Optional

# Or start Redis manually
redis-server --daemonize yes
```

### 2. Configure Environment
```bash
cd moneywise-backend

# Create environment file
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise
RUST_LOG=info
EOF

# Adjust the DATABASE_URL with your PostgreSQL credentials
```

### 3. Database Setup
```bash
# Create the database
createdb moneywise

# Install SQLx CLI
cargo install sqlx-cli --no-default-features --features postgres

# Run migrations (creates tables and sample data)
sqlx migrate run
```

### 4. Start Backend
```bash
# Build and run
cargo run

# Backend will be available at http://localhost:3000
```

### 5. Test Backend
```bash
# Test the API
curl "http://localhost:3000/api/budgets/overview"
curl "http://localhost:3000/api/budgets"
```

---

## 📱 Frontend Setup

### 1. Install Dependencies
```bash
cd moneywise-app
npm install
```

### 2. Start Development Server
```bash
# Start Expo development server
npm start

# Or run directly on platform
npm run android  # Android emulator/device
npm run ios      # iOS simulator
npm run web      # Web browser
```

The app will automatically connect to the backend at `http://localhost:3000/api`.

---

## 🎯 What You'll Get

**Backend Features:**
- ✅ Full REST API for budget management
- ✅ PostgreSQL database with sample data
- ✅ Redis caching for performance
- ✅ Comprehensive error handling

**Frontend Features:**
- ✅ Budget overview with spending insights
- ✅ Category-wise budget tracking
- ✅ Time period selection (Monthly/Yearly)
- ✅ AI-generated budget insights

---

## 🔧 Configuration Options

### Backend Environment Variables
Create `moneywise-backend/.env` with:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/moneywise  # Required
RUST_LOG=info                    # Logging level
HOST=127.0.0.1                   # Server host (default: 127.0.0.1)
PORT=3000                        # Server port (default: 3000)
REDIS_URL=redis://localhost:6379 # Redis connection (optional)
```

### Frontend Configuration
To change the API endpoint, edit `moneywise-app/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

---

## 🧪 Testing

### Backend Tests
```bash
cd moneywise-backend
cargo test
```

### Frontend Tests
```bash
cd moneywise-app
npm test              # Run all tests
npm run test:coverage # Run with coverage
```

---

## 🛠 Troubleshooting

### Backend Issues
**"Connection refused" errors:**
- Ensure PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Verify port 3000 is available

**"Database does not exist" errors:**
- Create database: `createdb moneywise`
- Run migrations: `sqlx migrate run`

### Frontend Issues
**"Network request failed" errors:**
- Ensure backend is running on `http://localhost:3000`
- Check if API endpoint is correct in `src/services/api.ts`
- For Android emulator, you may need: `adb reverse tcp:3000 tcp:3000`

**Metro bundler issues:**
- Clear cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

---

## 📁 Project Structure
```
MoneyWise/
├── moneywise-backend/          # Rust API server
│   ├── src/                    # Source code
│   ├── migrations/             # Database migrations
│   ├── setup.sh               # Automated setup script
│   └── .env                   # Environment configuration
└── moneywise-app/             # React Native app
    ├── src/
    │   ├── screens/           # App screens
    │   ├── services/          # API integration
    │   └── components/        # UI components
    └── package.json
```

---

## 🚀 Next Steps

Once everything is running:
1. Open the React Native app
2. Navigate to the "Budgets" tab
3. Explore the sample budget data
4. Try the API endpoints with curl or Postman
5. Check out the comprehensive test suites

For development, see the individual README files in each directory for detailed information about the codebase architecture and development workflows.