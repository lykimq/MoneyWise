# New database schema

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.category_groups (
  id          uuid      NOT NULL DEFAULT uuid_generate_v4(),
  name        text      NOT NULL,
  sort_order  integer   DEFAULT 0,
  color       text      NOT NULL,
  icon        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT category_groups_pkey PRIMARY KEY (id)
);

CREATE TRIGGER trg_category_groups_updated
  BEFORE UPDATE ON public.category_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid      NOT NULL DEFAULT uuid_generate_v4(),
  name        text      NOT NULL,
  group_id    uuid      NULL,              -- changed to uuid
  type        text      NOT NULL
                 CHECK (type IN ('expense','income')),
  icon        text,
  color       text      NOT NULL,
  is_default  boolean   DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT fk_categories_group FOREIGN KEY (group_id)
    REFERENCES public.category_groups (id)
    ON DELETE SET NULL
);

CREATE INDEX idx_categories_default ON public.categories(is_default);
CREATE INDEX idx_categories_group   ON public.categories(group_id);
CREATE INDEX idx_categories_type    ON public.categories(type);

CREATE TRIGGER trg_categories_updated
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE IF NOT EXISTS public.budgets (
  id          uuid       NOT NULL DEFAULT uuid_generate_v4(),
  month       smallint   NOT NULL
                 CHECK (month BETWEEN 1 AND 12)
                 DEFAULT EXTRACT(month FROM CURRENT_DATE)::smallint,
  year        integer    NOT NULL
                 CHECK (year >= 2000)
                 DEFAULT EXTRACT(year FROM CURRENT_DATE)::integer,
  category_id uuid       NOT NULL,
  planned     numeric(12,2) NOT NULL DEFAULT 0,
  spent       numeric(12,2) NOT NULL DEFAULT 0,
  carryover   numeric(12,2) NOT NULL DEFAULT 0,
  currency    char(3)    NOT NULL CHECK (length(currency)=3),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT budgets_pkey PRIMARY KEY (id),
  CONSTRAINT budgets_month_year_cat_uniq UNIQUE (year, month, category_id),
  CONSTRAINT fk_budgets_category FOREIGN KEY (category_id)
    REFERENCES public.categories (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_budgets_currency       ON public.budgets(currency);
CREATE INDEX idx_budgets_month_category ON public.budgets(month, category_id);
CREATE INDEX idx_budgets_year_category  ON public.budgets(year, category_id);
CREATE INDEX idx_budgets_year_month     ON public.budgets(year, month);

CREATE TRIGGER trg_budgets_updated
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();