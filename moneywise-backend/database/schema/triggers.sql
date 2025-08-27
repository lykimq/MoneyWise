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
