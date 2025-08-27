# Database Schema

This directory contains the database schema definitions.

## Files

- **`tables.sql`** - Table definitions
- **`indexes.sql`** - Performance indexes
- **`triggers.sql`** - Database triggers
- **`sample_data.sql`** - Initial data

## Table Structure

```
category_groups (1) ←→ (N) categories (1) ←→ (N) budgets
```

### Tables

1. **`category_groups`** - Budget category groups (Housing, Transportation, etc.)
2. **`categories`** - Individual budget categories (Rent, Groceries, etc.)
3. **`budgets`** - Monthly budget allocations and spending tracking

## Usage

Edit these files to modify the database schema, then run `../build-deploy.sh` to update production scripts.
