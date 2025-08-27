# Database Management

This directory contains database files for the MoneyWise backend.

## Structure

```
database/
├── README.md                 # This file
├── build-deploy.sh          # Build script for deployment files
├── migrations/              # Development migrations
├── schema/                  # Schema definitions
└── deploy/                  # Production deployment scripts
```

## Quick Start

```bash
# Build production script
cd database
./build-deploy.sh

# Local development
psql -d your_database -f migrations/20250827000000_initial_schema.sql

# Production deployment
# Copy deploy/supabase.sql to Supabase SQL Editor
```

## File Purposes

- **`schema/`** - Source schema files (edit these)
- **`migrations/`** - Development migrations (can edit)
- **`deploy/`** - Production scripts (auto-generated)
- **`build-deploy.sh`** - Combines schema files into deployment script

## Workflow

1. Edit files in `schema/` directory
2. Test with migration files locally
3. Run `./build-deploy.sh` to update production scripts
4. Deploy to production

## Schema Overview

Three main tables:
- `category_groups` - Budget category groups
- `categories` - Individual budget categories
- `budgets` - Monthly budget tracking
