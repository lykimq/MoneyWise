-- Table: public.languages

-- DROP TABLE IF EXISTS public.languages;

CREATE TABLE IF NOT EXISTS public.languages
(
    id text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    native_name text COLLATE pg_catalog."default" NOT NULL,
    is_rtl boolean DEFAULT false,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT languages_pkey PRIMARY KEY (id),
    CONSTRAINT languages_code_key UNIQUE (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.languages
    OWNER to postgres;

-- Index: idx_languages_active

-- DROP INDEX IF EXISTS public.idx_languages_active;

CREATE INDEX IF NOT EXISTS idx_languages_active
    ON public.languages USING btree
    (is_active ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_languages_code

-- DROP INDEX IF EXISTS public.idx_languages_code;

CREATE INDEX IF NOT EXISTS idx_languages_code
    ON public.languages USING btree
    (code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.translations

-- DROP TABLE IF EXISTS public.translations;

CREATE TABLE IF NOT EXISTS public.translations
(
    id text COLLATE pg_catalog."default" NOT NULL,
    language_code text COLLATE pg_catalog."default" NOT NULL,
    key text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    context text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT translations_pkey PRIMARY KEY (id),
    CONSTRAINT translations_language_code_fkey FOREIGN KEY (language_code)
        REFERENCES public.languages (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT translations_language_key_unique UNIQUE (language_code, key)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.translations
    OWNER to postgres;

-- Index: idx_translations_context

-- DROP INDEX IF EXISTS public.idx_translations_context;

CREATE INDEX IF NOT EXISTS idx_translations_context
    ON public.translations USING btree
    (context COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_translations_language_key

-- DROP INDEX IF EXISTS public.idx_translations_language_key;

CREATE INDEX IF NOT EXISTS idx_translations_language_key
    ON public.translations USING btree
    (language_code COLLATE pg_catalog."default" ASC NULLS LAST, key COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: update_translations_timestamp

-- DROP TRIGGER IF EXISTS update_translations_timestamp ON public.translations;

CREATE OR REPLACE TRIGGER update_translations_timestamp
    BEFORE UPDATE
    ON public.translations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Table: public.user_preferences

-- DROP TABLE IF EXISTS public.user_preferences;

CREATE TABLE IF NOT EXISTS public.user_preferences
(
    id text COLLATE pg_catalog."default" NOT NULL,
    language_code text COLLATE pg_catalog."default" NOT NULL DEFAULT 'en'::text,
    primary_currency text COLLATE pg_catalog."default" NOT NULL DEFAULT 'EUR'::text,
    theme text COLLATE pg_catalog."default" DEFAULT 'auto'::text,
    notifications_enabled boolean DEFAULT true,
    budget_alerts_enabled boolean DEFAULT true,
    goal_reminders_enabled boolean DEFAULT true,
    bill_reminders_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_preferences_pkey PRIMARY KEY (id),
    CONSTRAINT user_preferences_language_code_fkey FOREIGN KEY (language_code)
        REFERENCES public.languages (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT user_preferences_theme_check CHECK (theme = ANY (ARRAY['light'::text, 'dark'::text, 'auto'::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_preferences
    OWNER to postgres;

-- Index: idx_user_preferences_currency

-- DROP INDEX IF EXISTS public.idx_user_preferences_currency;

CREATE INDEX IF NOT EXISTS idx_user_preferences_currency
    ON public.user_preferences USING btree
    (primary_currency COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_user_preferences_language

-- DROP INDEX IF EXISTS public.idx_user_preferences_language;

CREATE INDEX IF NOT EXISTS idx_user_preferences_language
    ON public.user_preferences USING btree
    (language_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: update_user_preferences_timestamp

-- DROP TRIGGER IF EXISTS update_user_preferences_timestamp ON public.user_preferences;

CREATE OR REPLACE TRIGGER update_user_preferences_timestamp
    BEFORE UPDATE
    ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Table: public.category_groups

-- DROP TABLE IF EXISTS public.category_groups;

CREATE TABLE IF NOT EXISTS public.category_groups
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    sort_order integer DEFAULT 0,
    color text COLLATE pg_catalog."default" NOT NULL,
    icon text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT category_groups_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.category_groups
    OWNER to postgres;

-- Table: public.categories

-- DROP TABLE IF EXISTS public.categories;

CREATE TABLE IF NOT EXISTS public.categories
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    group_id text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    icon text COLLATE pg_catalog."default",
    color text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT categories_group_id_fkey FOREIGN KEY (group_id)
        REFERENCES public.category_groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT categories_type_check CHECK (type = ANY (ARRAY['expense'::text, 'income'::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.categories
    OWNER to postgres;

-- Index: idx_categories_default

-- DROP INDEX IF EXISTS public.idx_categories_default;

CREATE INDEX IF NOT EXISTS idx_categories_default
    ON public.categories USING btree
    (is_default ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_categories_group

-- DROP INDEX IF EXISTS public.idx_categories_group;

CREATE INDEX IF NOT EXISTS idx_categories_group
    ON public.categories USING btree
    (group_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_categories_type

-- DROP INDEX IF EXISTS public.idx_categories_type;

CREATE INDEX IF NOT EXISTS idx_categories_type
    ON public.categories USING btree
    (type COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.transactions

-- DROP TABLE IF EXISTS public.transactions;

CREATE TABLE IF NOT EXISTS public.transactions
(
    id text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text COLLATE pg_catalog."default" NOT NULL,
    category_id text COLLATE pg_catalog."default" NOT NULL,
    note text COLLATE pg_catalog."default",
    date timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_recurring boolean DEFAULT false,
    recurrence_pattern text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT transactions_type_check CHECK (type = ANY (ARRAY['income'::text, 'expense'::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transactions
    OWNER to postgres;

-- Index: idx_transactions_category

-- DROP INDEX IF EXISTS public.idx_transactions_category;

CREATE INDEX IF NOT EXISTS idx_transactions_category
    ON public.transactions USING btree
    (category_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_transactions_currency

-- DROP INDEX IF EXISTS public.idx_transactions_currency;

CREATE INDEX IF NOT EXISTS idx_transactions_currency
    ON public.transactions USING btree
    (currency COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_transactions_date

-- DROP INDEX IF EXISTS public.idx_transactions_date;

CREATE INDEX IF NOT EXISTS idx_transactions_date
    ON public.transactions USING btree
    (date ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_transactions_type

-- DROP INDEX IF EXISTS public.idx_transactions_type;

CREATE INDEX IF NOT EXISTS idx_transactions_type
    ON public.transactions USING btree
    (type COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: update_transactions_timestamp

-- DROP TRIGGER IF EXISTS update_transactions_timestamp ON public.transactions;

CREATE OR REPLACE TRIGGER update_transactions_timestamp
    BEFORE UPDATE
    ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Table: public.budgets

-- DROP TABLE IF EXISTS public.budgets;

CREATE TABLE IF NOT EXISTS public.budgets
(
    id text COLLATE pg_catalog."default" NOT NULL,
    month text COLLATE pg_catalog."default" NOT NULL,
    year text COLLATE pg_catalog."default" NOT NULL,
    category_id text COLLATE pg_catalog."default" NOT NULL,
    planned numeric(10,2) NOT NULL DEFAULT 0,
    spent numeric(10,2) NOT NULL DEFAULT 0,
    carryover numeric(10,2) DEFAULT 0,
    currency text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT budgets_pkey PRIMARY KEY (id),
    CONSTRAINT budgets_month_category_id_key UNIQUE (month, category_id),
    CONSTRAINT budgets_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.budgets
    OWNER to postgres;

-- Index: idx_budgets_currency

-- DROP INDEX IF EXISTS public.idx_budgets_currency;

CREATE INDEX IF NOT EXISTS idx_budgets_currency
    ON public.budgets USING btree
    (currency COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_budgets_month_category

-- DROP INDEX IF EXISTS public.idx_budgets_month_category;

CREATE INDEX IF NOT EXISTS idx_budgets_month_category
    ON public.budgets USING btree
    (month COLLATE pg_catalog."default" ASC NULLS LAST, category_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_budgets_year_category

-- DROP INDEX IF EXISTS public.idx_budgets_year_category;

CREATE INDEX IF NOT EXISTS idx_budgets_year_category
    ON public.budgets USING btree
    (year COLLATE pg_catalog."default" ASC NULLS LAST, category_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: update_budgets_timestamp

-- DROP TRIGGER IF EXISTS update_budgets_timestamp ON public.budgets;

CREATE OR REPLACE TRIGGER update_budgets_timestamp
    BEFORE UPDATE
    ON public.budgets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Table: public.savings_goals

-- DROP TABLE IF EXISTS public.savings_goals;

CREATE TABLE IF NOT EXISTS public.savings_goals
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    target_amount numeric(10,2) NOT NULL,
    current_amount numeric(10,2) NOT NULL DEFAULT 0,
    currency text COLLATE pg_catalog."default" NOT NULL,
    target_date timestamp without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT savings_goals_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.savings_goals
    OWNER to postgres;

-- Index: idx_savings_goals_active

-- DROP INDEX IF EXISTS public.idx_savings_goals_active;

CREATE INDEX IF NOT EXISTS idx_savings_goals_active
    ON public.savings_goals USING btree
    (is_active ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_savings_goals_created

-- DROP INDEX IF EXISTS public.idx_savings_goals_created;

CREATE INDEX IF NOT EXISTS idx_savings_goals_created
    ON public.savings_goals USING btree
    (created_at ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_savings_goals_currency

-- DROP INDEX IF EXISTS public.idx_savings_goals_currency;

CREATE INDEX IF NOT EXISTS idx_savings_goals_currency
    ON public.savings_goals USING btree
    (currency COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: update_savings_goals_timestamp

-- DROP TRIGGER IF EXISTS update_savings_goals_timestamp ON public.savings_goals;

CREATE OR REPLACE TRIGGER update_savings_goals_timestamp
    BEFORE UPDATE
    ON public.savings_goals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Views remain the same as in your original schema
-- View: public.budget_summary

-- DROP VIEW public.budget_summary;

CREATE OR REPLACE VIEW public.budget_summary
 AS
 SELECT b.id,
    b.month,
    b.year,
    b.planned,
    b.spent,
    b.planned - b.spent AS remaining,
    b.carryover,
    b.currency,
    c.name AS category_name,
    cg.name AS group_name,
    c.color AS category_color,
    cg.color AS group_color
   FROM budgets b
     JOIN categories c ON b.category_id = c.id
     JOIN category_groups cg ON c.group_id = cg.id;

ALTER TABLE public.budget_summary
    OWNER TO postgres;

-- View: public.monthly_spending_by_category

-- DROP VIEW public.monthly_spending_by_category;

CREATE OR REPLACE VIEW public.monthly_spending_by_category
 AS
 SELECT to_char(t.date, 'YYYY-MM'::text) AS month,
    c.name AS category_name,
    cg.name AS group_name,
    t.currency,
    sum(
        CASE
            WHEN t.type = 'expense'::text THEN t.amount
            ELSE 0::numeric
        END) AS total_expenses,
    sum(
        CASE
            WHEN t.type = 'income'::text THEN t.amount
            ELSE 0::numeric
        END) AS total_income,
    count(*) AS transaction_count
   FROM transactions t
     JOIN categories c ON t.category_id = c.id
     JOIN category_groups cg ON c.group_id = cg.id
  GROUP BY (to_char(t.date, 'YYYY-MM'::text)), c.id, t.currency, c.name, cg.name;

ALTER TABLE public.monthly_spending_by_category
    OWNER TO postgres;

-- View: public.transaction_summary

-- DROP VIEW public.transaction_summary;

CREATE OR REPLACE VIEW public.transaction_summary
 AS
 SELECT t.id,
    t.type,
    t.amount,
    t.currency,
    t.note,
    t.date,
    t.is_recurring,
    c.name AS category_name,
    cg.name AS group_name,
    c.color AS category_color,
    cg.color AS group_color
   FROM transactions t
     JOIN categories c ON t.category_id = c.id
     JOIN category_groups cg ON c.group_id = cg.id;

ALTER TABLE public.transaction_summary
    OWNER TO postgres;