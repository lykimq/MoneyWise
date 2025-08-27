-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the trigger function for updated_at columns if it doesn't exist
-- This function automatically updates the updated_at column when a row is modified
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 1: Create category_groups table
-- Organizes categories into logical groups (Housing, Transportation, etc.)
CREATE TABLE IF NOT EXISTS public.category_groups (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    sort_order integer DEFAULT 0,
    color text NOT NULL,
    icon text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT category_groups_pkey PRIMARY KEY (id)
);

-- Step 2: Create categories table
-- Individual budget categories (Rent, Groceries, Gas, etc.)
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    group_id uuid,
    type text NOT NULL,
    icon text,
    color text NOT NULL,
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

-- Step 3: Create budgets table
-- Monthly budget allocations and spending tracking
CREATE TABLE IF NOT EXISTS public.budgets (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    month smallint NOT NULL DEFAULT (EXTRACT(month FROM CURRENT_DATE))::smallint,
    year integer NOT NULL DEFAULT (EXTRACT(year FROM CURRENT_DATE))::integer,
    category_id uuid NOT NULL,
    planned numeric(12,2) NOT NULL DEFAULT 0,
    spent numeric(12,2) NOT NULL DEFAULT 0,
    carryover numeric(12,2) NOT NULL DEFAULT 0,
    currency character(3) NOT NULL,
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
