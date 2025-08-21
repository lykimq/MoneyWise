# MoneyWise Setup Guide

Get MoneyWise running in minutes with this streamlined setup guide. Designed for developers who want to get started quickly without getting bogged down in technical details.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites Check
Ensure you have these installed:
- **Rust** - [rustup.rs](https://rustup.rs/)
- **Node.js 18+** - [nodejs.org](https://nodejs.org/)
- **PostgreSQL 12+** - [postgresql.org](https://postgresql.org/download/)
- **Redis** (optional) - [redis.io](https://redis.io/download/)

### 2. Clone & Setup
```bash
git clone <repository-url>
cd MoneyWise

# Backend setup (automated)
cd moneywise-backend
./setup.sh

# Frontend setup
cd ../moneywise-app
npm install
npm start
```

That's it! The setup script handles everything else automatically.

---

## 🔧 What the Setup Script Does

The `./setup.sh` script automatically:
- ✅ Verifies all prerequisites are installed
- ✅ Starts PostgreSQL and Redis services
- ✅ Creates database and environment files
- ✅ Installs dependencies and runs migrations
- ✅ Loads sample data (real production data)
- ✅ Starts the backend server
- ✅ Tests API endpoints

**Sample Data Included:**
- 5 budget categories (Housing, Utilities, Transportation, Food, Entertainment)
- Real budget data for December 2024 & August 2025
- USD currency with realistic spending patterns

---

## 🌐 Access Points

Once running:
- **Backend API**: http://localhost:3000/api
- **Frontend App**: Expo development server (QR code in terminal)
- **API Test**: `curl http://localhost:3000/api/budgets/overview`

---

## 🛠 Manual Setup (if needed)

### Backend
```bash
cd moneywise-backend

# Start services
sudo systemctl start postgresql  # Ubuntu/Debian
brew services start postgresql    # macOS

# Environment & database
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise" > .env
createdb moneywise
cargo install sqlx-cli --no-default-features --features postgres
sqlx migrate run
cargo run
```

### Frontend
```bash
cd moneywise-app
npm install
npm start
```

---

## 🔧 Configuration

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/moneywise
RUST_LOG=info
HOST=127.0.0.1
PORT=3000
REDIS_URL=redis://localhost:6379  # Optional
```

### Frontend API
Edit `moneywise-app/src/services/api.ts` to change backend URL.

---

## 🧪 Testing

```bash
# Backend tests
cd moneywise-backend && cargo test

# Frontend tests
cd moneywise-app && npm test
```

---

## 🚨 Troubleshooting

### Common Issues
- **PostgreSQL not running**: `sudo systemctl start postgresql`
- **Port 3000 busy**: Change PORT in .env file
- **Database errors**: Run `sqlx migrate run` again
- **Frontend connection**: Ensure backend is running on correct port

### Reset Everything
```bash
cd moneywise-backend
dropdb moneywise
createdb moneywise
sqlx migrate run
```

---

## 📁 Project Structure
```
MoneyWise/
├── moneywise-backend/     # Rust API server
│   ├── setup.sh          # Automated setup
│   ├── migrations/       # Database schema
│   └── src/              # Source code
└── moneywise-app/        # React Native app
    ├── src/              # App source
    └── package.json      # Dependencies
```

---

## 🎯 What You Get

**Backend:**
- Full REST API for budget management
- PostgreSQL with real sample data
- Redis caching (optional)
- Comprehensive error handling

**Frontend:**
- Budget overview with insights
- Category-wise tracking
- Time period selection
- AI-generated recommendations

---

## 🚀 Next Steps

1. **Explore the app** - Navigate through budget categories
2. **Test the API** - Use curl or Postman on the endpoints
3. **Check the code** - Review the architecture in individual READMEs
4. **Run tests** - Ensure everything works as expected

The setup is designed to get you productive immediately. All technical complexity is abstracted away, so you can focus on building features rather than fighting with configuration.