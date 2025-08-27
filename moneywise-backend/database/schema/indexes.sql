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
