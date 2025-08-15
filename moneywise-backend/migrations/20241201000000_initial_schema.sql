-- MoneyWise Initial Schema
-- Creates the complete database schema with UUID types, proper constraints, and sample data
-- This is the foundational migration that sets up all tables, indexes, and relationships.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Update category_groups table
-- Drop existing table and recreate with UUID and proper constraints
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.category_groups CASCADE;

-- Recreate category_groups with UUID
CREATE TABLE IF NOT EXISTS public.category_groups
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text COLLATE pg_catalog."default" NOT NULL,
    sort_order integer DEFAULT 0,
    color text COLLATE pg_catalog."default" NOT NULL,
    icon text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT category_groups_pkey PRIMARY KEY (id)
);

-- Step 2: Recreate categories table with UUID
CREATE TABLE IF NOT EXISTS public.categories
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text COLLATE pg_catalog."default" NOT NULL,
    group_id uuid,
    type text COLLATE pg_catalog."default" NOT NULL,
    icon text COLLATE pg_catalog."default",
    color text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT fk_categories_group FOREIGN KEY (group_id)
        REFERENCES public.category_groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT categories_type_check CHECK (type = ANY (ARRAY['expense'::text, 'income'::text]))
);

-- Step 3: Recreate budgets table with UUID and proper constraints
CREATE TABLE IF NOT EXISTS public.budgets
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    month smallint NOT NULL DEFAULT (EXTRACT(month FROM CURRENT_DATE))::smallint,
    year integer NOT NULL DEFAULT (EXTRACT(year FROM CURRENT_DATE))::integer,
    category_id uuid NOT NULL,
    planned numeric(12,2) NOT NULL DEFAULT 0,
    spent numeric(12,2) NOT NULL DEFAULT 0,
    carryover numeric(12,2) NOT NULL DEFAULT 0,
    currency character(3) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT budgets_pkey PRIMARY KEY (id),
    CONSTRAINT budgets_month_year_cat_uniq UNIQUE (year, month, category_id),
    CONSTRAINT fk_budgets_category FOREIGN KEY (category_id)
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT budgets_month_check CHECK (month >= 1 AND month <= 12),
    CONSTRAINT budgets_year_check CHECK (year >= 2000),
    CONSTRAINT budgets_currency_check CHECK (length(currency) = 3)
);

-- Step 4: Create indexes for performance

-- Category groups indexes
-- (None needed beyond primary key for this simple table)

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_default
    ON public.categories USING btree
    (is_default ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_categories_group
    ON public.categories USING btree
    (group_id ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_categories_type
    ON public.categories USING btree
    (type COLLATE pg_catalog."default" ASC NULLS LAST);

-- Budgets indexes
CREATE INDEX IF NOT EXISTS idx_budgets_currency
    ON public.budgets USING btree
    (currency COLLATE pg_catalog."default" ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_budgets_month_category
    ON public.budgets USING btree
    (month ASC NULLS LAST, category_id ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_budgets_year_category
    ON public.budgets USING btree
    (year ASC NULLS LAST, category_id ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_budgets_year_month
    ON public.budgets USING btree
    (year ASC NULLS LAST, month ASC NULLS LAST);

-- Step 5: Create triggers for updated_at columns

-- Category groups trigger
CREATE OR REPLACE TRIGGER trg_category_groups_updated
    BEFORE UPDATE
    ON public.category_groups
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Categories trigger
CREATE OR REPLACE TRIGGER trg_categories_updated
    BEFORE UPDATE
    ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Budgets trigger
CREATE OR REPLACE TRIGGER trg_budgets_updated
    BEFORE UPDATE
    ON public.budgets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Set table ownership
ALTER TABLE IF EXISTS public.category_groups OWNER to postgres;
ALTER TABLE IF EXISTS public.categories OWNER to postgres;
ALTER TABLE IF EXISTS public.budgets OWNER to postgres;

-- Step 7: Load sample data from CSV files
-- This approach uses PostgreSQL's COPY command to efficiently load data from CSV files
-- The CSV files are located in the same directory as this migration file

-- Load category groups from CSV
\copy public.category_groups FROM 'migrations/data-1755248781085.csv' WITH CSV HEADER;

-- Load categories from CSV
\copy public.categories FROM 'migrations/data-1755248801052.csv' WITH CSV HEADER;

-- Load budget data from CSV
\copy public.budgets FROM 'migrations/data-1755248683962.csv' WITH CSV HEADER;

-- Step 9: Add comments for documentation
COMMENT ON TABLE public.category_groups IS 'Budget category groups for organizing categories';
COMMENT ON TABLE public.categories IS 'Budget categories for expense and income tracking';
COMMENT ON TABLE public.budgets IS 'Monthly budget allocations and spending tracking';

COMMENT ON COLUMN public.budgets.month IS 'Month as integer (1-12, where 1=January, 12=December)';
COMMENT ON COLUMN public.budgets.year IS 'Year as integer (e.g., 2024)';
COMMENT ON COLUMN public.budgets.currency IS 'ISO 4217 currency code (3 characters, e.g., EUR, USD)';
COMMENT ON COLUMN public.budgets.planned IS 'Planned/budgeted amount for this category and period';
COMMENT ON COLUMN public.budgets.spent IS 'Actual amount spent in this category and period';
COMMENT ON COLUMN public.budgets.carryover IS 'Amount carried over from previous period';
