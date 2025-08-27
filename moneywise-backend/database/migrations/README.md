# Database Migrations

This directory contains database migrations for development.

## Current Migration

### `20250827000000_initial_schema.sql`
Initial database setup with complete schema.

## Usage

```bash
# Apply migration to local database
psql -d your_database -f migrations/20250827000000_initial_schema.sql
```

## Workflow

1. Make changes to schema files in `../schema/`
2. Update migration file manually
3. Test locally
4. Run `../build-deploy.sh` to update production scripts

## Best Practices

- Test migrations on local database first
- Keep migrations small and focused
- Document changes clearly
