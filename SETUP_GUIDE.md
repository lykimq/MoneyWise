# MoneyWise Setup Guide (current implementation)

This guide helps you run the existing MoneyWise stack: Rust backend (Axum) + React Native app (Expo), with PostgreSQL and Redis.

### What’s implemented
- Backend budgets API under `/api`:
  - `GET /api/budgets`
  - `GET /api/budgets/overview`
  - `GET /api/budgets/:id`
  - `POST /api/budgets`
  - `PUT /api/budgets/:id`
- Database migrations with sample categories and budgets
- Frontend wired to `http://127.0.0.1:3000/api`

## Prerequisites
- Rust (stable), Cargo
- Node.js 18+ (recommended), npm or yarn
- PostgreSQL 12+
- Redis 6+ (required; backend uses caching)
- curl (optional for smoke tests)

## 1) Backend setup
```bash
# Start services (Ubuntu/Debian)
sudo systemctl start postgresql
sudo systemctl start redis

cd moneywise-backend

# Create .env (required for build/runtime)
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneywise
RUST_LOG=info
# Optional overrides:
# HOST=127.0.0.1
# PORT=3000
# REDIS_URL=redis://localhost:6379
# DATABASE_MAX_CONNECTIONS=5
# CACHE_OVERVIEW_TTL_SECS=900
# CACHE_CATEGORIES_TTL_SECS=300
# CACHE_BUDGET_TTL_SECS=600
EOF

# Create database
createdb moneywise

# Option A: one-shot setup (checks Postgres, installs sqlx-cli, runs migrations, builds)
./setup.sh

# Option B: manual
cargo install sqlx-cli --no-default-features --features postgres
sqlx migrate run
cargo run
```
Backend runs at `http://127.0.0.1:3000` (API at `/api`).

### Smoke test
```bash
curl -s "http://127.0.0.1:3000/api/budgets/overview"
curl -s "http://127.0.0.1:3000/api/budgets?month=6&year=2025"
```

## 2) Frontend setup
```bash
cd moneywise-app
npm install
npm start
# or: npm run android | npm run ios | npm run web
```
The app expects the API at `http://127.0.0.1:3000/api`. To change it, edit `moneywise-app/src/services/api.ts` (`API_BASE_URL`).

## Configuration reference
Backend env (in `moneywise-backend/.env`):
- DATABASE_URL (required)
- RUST_LOG (default: `info`)
- HOST (default: `127.0.0.1`)
- PORT (default: `3000`)
- REDIS_URL (default: `redis://localhost:6379`)
- DATABASE_MAX_CONNECTIONS (default: `5`)
- CACHE_OVERVIEW_TTL_SECS, CACHE_CATEGORIES_TTL_SECS, CACHE_BUDGET_TTL_SECS

## Migrations
```bash
cd moneywise-backend
sqlx migrate run
# create new migration:
sqlx migrate add migration_name
```
Migrations include sample data (categories, sample budgets/transactions).

## Troubleshooting
- Backend won’t start
  - Ensure PostgreSQL and Redis are running
  - Verify `.env` is present and `DATABASE_URL` is correct
  - Port 3000 free; adjust `HOST`/`PORT` if needed
- SQLx compile-time errors
  - Ensure `DATABASE_URL` is set and DB is reachable when running `cargo build/run`
- Frontend can’t connect
  - Confirm backend is on `127.0.0.1:3000`
  - Update `API_BASE_URL` if running on different host/port

## Minimal project structure
```
MoneyWise/
├── moneywise-backend/
│   ├── src/ (Axum app, routes, models, DB/cache setup)
│   ├── migrations/
│   ├── Cargo.toml
│   └── setup.sh
└── moneywise-app/
    ├── src/
    │   ├── screens/
    │   └── services/api.ts
    └── package.json
```