# Database Deployment

This directory contains production deployment scripts.

## Available Scripts

### `supabase.sql`
Complete database setup for Supabase hosting.

## Deployment

1. Copy contents of `supabase.sql` to Supabase SQL Editor
2. Run the script
3. Verify tables were created

## Verification

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check data
SELECT COUNT(*) FROM category_groups;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM budgets;
```

## Notes

- Files in this directory are auto-generated
- To modify schema, edit files in `../schema/` and run `../build-deploy.sh`
