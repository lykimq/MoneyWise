# MoneyWise Setup Guide

This guide will help you set up the complete MoneyWise application with a Rust backend and React Native frontend.

## Project Overview

MoneyWise is a financial management application with:
- **Frontend**: React Native app with Expo
- **Backend**: Rust API with Axum framework
- **Database**: PostgreSQL with SQLx migrations
- **Features**: Budget tracking, category management, insights

## Prerequisites

- **Rust** (latest stable version)
- **Node.js** (v16 or higher)
- **PostgreSQL** (12 or higher)
- **Cargo** (Rust package manager)
- **npm** or **yarn**

## Quick Setup

### 1. Database Setup

```bash
# Start PostgreSQL (if not already running)
sudo systemctl start postgresql

# Create the database
createdb moneywise
```

### 2. Backend Setup

```bash
cd moneywise-backend

# Run the automated setup script
./setup.sh

# Or manually:
# Install sqlx CLI
cargo install sqlx-cli --no-default-features --features postgres

# Run migrations
sqlx migrate run

# Build and run
cargo run
```

The backend will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd moneywise-app

# Install dependencies
npm install

# Start the development server
npm start
```

## API Endpoints

The backend provides the following endpoints:

- `GET /api/budgets` - Get all budgets with overview and insights
- `GET /api/budgets/overview` - Get budget overview only
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `GET /api/budgets/:id` - Get a specific budget

## Database Schema

The application includes:

- **Languages & Translations**: Multi-language support
- **Categories & Groups**: Budget categorization
- **Transactions**: Income and expense tracking
- **Budgets**: Monthly budget allocations
- **Savings Goals**: Financial goal tracking
- **User Preferences**: App settings

## Sample Data

The backend comes with sample data including:
- Default categories (Housing, Transport, Food, etc.)
- Sample budgets for December 2024
- Sample transactions to demonstrate spending tracking

## Development Workflow

### Backend Development

```bash
cd moneywise-backend

# Run in development mode
cargo run

# Run tests
cargo test

# Create new migration
sqlx migrate add migration_name

# Run migrations
sqlx migrate run
```

### Frontend Development

```bash
cd moneywise-app

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Configuration

### Backend Configuration

Create a `.env` file in `moneywise-backend/`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise
RUST_LOG=info
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:3000` by default. Update `src/services/api.ts` if needed.

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists: `psql -l`

2. **Backend Won't Start**
   - Check if port 3000 is available
   - Verify all dependencies are installed
   - Check logs for specific errors

3. **Frontend Can't Connect**
   - Ensure backend is running on port 3000
   - Check CORS configuration
   - Verify API endpoint in `api.ts`

4. **Migration Errors**
   - Drop and recreate database if needed
   - Check migration files for syntax errors
   - Ensure PostgreSQL version compatibility

## Project Structure

```
MoneyWise/
├── moneywise-backend/          # Rust backend
│   ├── src/
│   │   ├── main.rs            # Application entry point
│   │   ├── budget.rs          # Budget API handlers
│   │   ├── models.rs          # Data models
│   │   ├── database.rs        # Database connection
│   │   └── error.rs           # Error handling
│   ├── migrations/            # Database migrations
│   ├── Cargo.toml            # Rust dependencies
│   └── README.md             # Backend documentation
├── moneywise-app/             # React Native frontend
│   ├── src/
│   │   ├── screens/          # Screen components
│   │   ├── services/         # API services
│   │   └── components/       # Reusable components
│   ├── package.json          # Node.js dependencies
│   └── README.md             # Frontend documentation
└── docs/                     # Project documentation
```

## Next Steps

1. **Test the Integration**: Verify the frontend can fetch data from the backend
2. **Add Authentication**: Implement user authentication and authorization
3. **Expand Features**: Add more screens and functionality
4. **Deploy**: Set up production deployment for both frontend and backend

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the individual README files in each directory
3. Check the logs for specific error messages
4. Ensure all prerequisites are properly installed

## License

This project is licensed under the MIT License.