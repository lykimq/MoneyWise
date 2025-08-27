-- MoneyWise Initial Schema Migration
-- 📝  MANUALLY MAINTAINED FILE - CAN BE EDITED FOR DEVELOPMENT  📝
-- This migration creates the complete database schema with UUID types, proper constraints, and sample data
-- Compatible with both Supabase hosted and local PostgreSQL environments
--
-- Note: This migration combines all schema components. For modular development, see ../schema/ directory.
-- For production deployment, use ../deploy/supabase.sql (auto-generated)
--
-- Development workflow:
-- 1. Make changes to ../schema/ files
-- 2. Update this migration file manually
-- 3. Test locally
-- 4. Run ../build-deploy.sh to update production scripts

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

-- Step 4: Create indexes for performance
-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_default
    ON public.categories USING btree (is_default ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_categories_group
    ON public.categories USING btree (group_id ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_categories_type
    ON public.categories USING btree (type ASC NULLS LAST);

-- Budgets indexes
CREATE INDEX IF NOT EXISTS idx_budgets_currency
    ON public.budgets USING btree (currency ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_budgets_month_category
    ON public.budgets USING btree (month ASC NULLS LAST, category_id ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_budgets_year_category
    ON public.budgets USING btree (year ASC NULLS LAST, category_id ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_budgets_year_month
    ON public.budgets USING btree (year ASC NULLS LAST, month ASC NULLS LAST);

-- Step 5: Create triggers for updated_at columns
-- Category groups trigger
CREATE OR REPLACE TRIGGER trg_category_groups_updated
    BEFORE UPDATE ON public.category_groups
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Categories trigger
CREATE OR REPLACE TRIGGER trg_categories_updated
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Budgets trigger
CREATE OR REPLACE TRIGGER trg_budgets_updated
    BEFORE UPDATE ON public.budgets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Insert sample data (same as supabase_schema.sql)
-- Insert Category Groups
INSERT INTO public.category_groups (id, name, sort_order, color, icon, created_at, updated_at) VALUES
('f63d38ad-b5c8-4443-82ec-04c590651a05', 'Housing', 1, '#FF5733', '🏠', '2025-08-11 14:57:46.736296+02', '2025-08-11 14:57:46.736296+02'),
('1f69ae1e-f29e-4ebc-b2b6-e0ab10497a07', 'Utilities', 2, '#33FF57', '💡', '2025-08-11 14:57:46.736296+02', '2025-08-11 14:57:46.736296+02'),
('c7c27f26-1598-43df-9eff-4927597c22f3', 'Transportation', 3, '#3357FF', '🚗', '2025-08-11 14:57:46.736296+02', '2025-08-11 14:57:46.736296+02'),
('3a18b054-566e-4502-8fcd-b81405bf59fb', 'Food', 4, '#FF33A8', '🍽️', '2025-08-11 14:57:46.736296+02', '2025-08-11 14:57:46.736296+02'),
('ddb307ef-709e-46eb-bfb7-60cfac4c00be', 'Entertainment', 5, '#F3FF33', '🎮', '2025-08-11 14:57:46.736296+02', '2025-08-11 14:57:46.736296+02')
ON CONFLICT (id) DO NOTHING;

-- Insert Categories
INSERT INTO public.categories (id, name, group_id, type, icon, color, is_default, created_at, updated_at) VALUES
('a2902212-8b33-4303-b581-b7cb8ab885a0', 'Rent', 'f63d38ad-b5c8-4443-82ec-04c590651a05', 'expense', '🏠', '#FF5733', true, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('6ef0d632-6d7e-473a-946e-843672bac8bf', 'Utilities', '1f69ae1e-f29e-4ebc-b2b6-e0ab10497a07', 'expense', '💡', '#33FF57', true, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('8b4a9232-4c62-4b99-a986-73e163069c92', 'Gas', 'c7c27f26-1598-43df-9eff-4927597c22f3', 'expense', '⛽', '#3357FF', false, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('c0df596e-072b-4111-a6fe-0f232e00fb7e', 'Public Transport', 'c7c27f26-1598-43df-9eff-4927597c22f3', 'expense', '🚌', '#3357FF', false, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('3d48ca20-13a5-40ba-8f6d-a68054739293', 'Groceries', '3a18b054-566e-4502-8fcd-b81405bf59fb', 'expense', '🛒', '#FF33A8', true, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('0927dd03-ee9a-4aa5-a417-7c7519511944', 'Dining Out', '3a18b054-566e-4502-8fcd-b81405bf59fb', 'expense', '🍽️', '#FF33A8', false, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('c2ebb22d-0118-4b49-b39c-d51740785386', 'Clothing', 'ddb307ef-709e-46eb-bfb7-60cfac4c00be', 'expense', '👗', '#F3FF33', false, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('a70c7480-9b3d-40af-832e-7802e8a05dbf', 'Electronics', 'ddb307ef-709e-46eb-bfb7-60cfac4c00be', 'expense', '💻', '#F3FF33', false, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('018c7ef0-b264-4c05-b7e2-0b1353382a86', 'Emergency Fund', 'f63d38ad-b5c8-4443-82ec-04c590651a05', 'income', '🚑', '#FF5733', false, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02'),
('c0b3f0a7-8e9d-4c6b-a2f1-5b8e7a9c0d3e', 'Salary', '3a18b054-566e-4502-8fcd-b81405bf59fb', 'income', '💰', '#FF33A8', true, '2025-08-11 14:57:59.491458+02', '2025-08-11 14:57:59.491458+02')
ON CONFLICT (id) DO NOTHING;

-- Insert Budget Data (December 2024 and August 2025)
INSERT INTO public.budgets (id, month, year, category_id, planned, spent, carryover, currency, created_at, updated_at) VALUES
-- December 2024 data
('ab329f22-e332-482d-8c3e-aca6d962e698', 12, 2024, 'a2902212-8b33-4303-b581-b7cb8ab885a0', 1000.00, 800.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('1152918f-ef03-4ced-aad0-bd704bab7bca', 12, 2024, '6ef0d632-6d7e-473a-946e-843672bac8bf', 200.00, 180.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('2c2d9b8e-9c4e-444f-814e-f54133b16131', 12, 2024, '8b4a9232-4c62-4b99-a986-73e163069c92', 300.00, 300.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('01bf8153-6d19-44c2-ac00-0b98e48313be', 12, 2024, 'c0df596e-072b-4111-a6fe-0f232e00fb7e', 100.00, 80.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('dcf3d15c-a3ae-493b-9afa-7e9e112cc005', 12, 2024, '3d48ca20-13a5-40ba-8f6d-a68054739293', 400.00, 350.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('f84bbd10-7a48-4fd0-9597-e9f003d10162', 12, 2024, '0927dd03-ee9a-4aa5-a417-7c7519511944', 400.00, 450.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('05dfa311-6fda-4f5e-98bc-9dff3487a44b', 12, 2024, 'c2ebb22d-0118-4b49-b39c-d51740785386', 500.00, 400.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('229da056-0022-4929-993d-c12a9c7ee4cc', 12, 2024, 'a70c7480-9b3d-40af-832e-7802e8a05dbf', 200.00, 150.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('f0bf05e0-a42c-4bd4-8e66-c68d5c952a82', 12, 2024, '018c7ef0-b264-4c05-b7e2-0b1353382a86', 800.00, 500.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('b8c7a9e1-2f4d-4a6b-8c9e-1f3a5b7c9d0e', 12, 2024, 'c0b3f0a7-8e9d-4c6b-a2f1-5b8e7a9c0d3e', 5000.00, 5200.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),

-- August 2025 data
('d1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a', 8, 2025, 'a2902212-8b33-4303-b581-b7cb8ab885a0', 1100.00, 950.00, 50.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b', 8, 2025, '6ef0d632-6d7e-473a-946e-843672bac8bf', 220.00, 200.00, 10.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c', 8, 2025, '8b4a9232-4c62-4b99-a986-73e163069c92', 320.00, 280.00, 20.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('a4b5c6d7-e8f9-40ab-1c2d-3e4f5a6b7c8d', 8, 2025, 'c0df596e-072b-4111-a6fe-0f232e00fb7e', 110.00, 85.00, 5.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('b5c6d7e8-f9a0-41bc-2d3e-4f5a6b7c8d9e', 8, 2025, '3d48ca20-13a5-40ba-8f6d-a68054739293', 450.00, 380.00, 30.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('c6d7e8f9-a0b1-42cd-3e4f-5a6b7c8d9e0f', 8, 2025, '0927dd03-ee9a-4aa5-a417-7c7519511944', 420.00, 400.00, 15.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('d7e8f9a0-b1c2-43de-4f5a-6b7c8d9e0f1a', 8, 2025, 'c2ebb22d-0118-4b49-b39c-d51740785386', 550.00, 480.00, 25.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('e8f9a0b1-c2d3-44ef-5a6b-7c8d9e0f1a2b', 8, 2025, 'a70c7480-9b3d-40af-832e-7802e8a05dbf', 250.00, 180.00, 40.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('f9a0b1c2-d3e4-45fa-6b7c-8d9e0f1a2b3c', 8, 2025, '018c7ef0-b264-4c05-b7e2-0b1353382a86', 850.00, 600.00, 100.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02'),
('a0b1c2d3-e4f5-46ab-7c8d-9e0f1a2b3c4d', 8, 2025, 'c0b3f0a7-8e9d-4c6b-a2f1-5b8e7a9c0d3e', 5200.00, 5400.00, 0.00, 'USD', '2025-08-11 14:58:17.710055+02', '2025-08-11 14:58:17.710055+02')
ON CONFLICT (id) DO NOTHING;

-- Step 7: Add table comments for documentation
COMMENT ON TABLE public.category_groups IS 'Budget category groups for organizing categories';
COMMENT ON TABLE public.categories IS 'Budget categories for expense and income tracking';
COMMENT ON TABLE public.budgets IS 'Monthly budget allocations and spending tracking';

COMMENT ON COLUMN public.budgets.month IS 'Month as integer (1-12, where 1=January, 12=December)';
COMMENT ON COLUMN public.budgets.year IS 'Year as integer (e.g., 2024)';
COMMENT ON COLUMN public.budgets.currency IS 'ISO 4217 currency code (3 characters, e.g., EUR, USD)';
COMMENT ON COLUMN public.budgets.planned IS 'Planned/budgeted amount for this category and period';
COMMENT ON COLUMN public.budgets.spent IS 'Actual amount spent in this category and period';
COMMENT ON COLUMN public.budgets.carryover IS 'Amount carried over from previous period';
