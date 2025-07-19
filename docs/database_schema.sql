-- MoneyWise Database Schema
-- Supports English, French, and Vietnamese languages
-- SQLite compatible with PostgreSQL extensions

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Languages table - stores supported languages
-- Description: Supported languages for app localization and internationalization (basic feature)
CREATE TABLE languages (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL, -- ISO 639-1 language code
    name TEXT NOT NULL, -- Language name in English
    native_name TEXT NOT NULL, -- Language name in native script
    is_rtl BOOLEAN DEFAULT FALSE, -- Right-to-left text direction
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Translations table - stores localized text strings
-- Description: Localized UI strings for multi-language support (basic feature)
CREATE TABLE translations (
    id TEXT PRIMARY KEY,
    language_code TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    context TEXT, -- Optional context for disambiguation
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE(language_code, key, context)
);

-- User preferences table
-- Description: Stores user-specific settings such as language, currency, theme, and notification preferences (basic feature)
CREATE TABLE user_preferences (
    id TEXT PRIMARY KEY,
    language_code TEXT NOT NULL DEFAULT 'en',
    primary_currency TEXT NOT NULL DEFAULT 'EUR',
    theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    budget_alerts_enabled BOOLEAN DEFAULT TRUE,
    goal_reminders_enabled BOOLEAN DEFAULT TRUE,
    bill_reminders_enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE RESTRICT
);

-- Category groups table
-- Description: Logical grouping of categories for better organization in UI and reports (basic feature)
CREATE TABLE category_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    color TEXT NOT NULL, -- Hex color code
    icon TEXT, -- Icon identifier
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
-- Description: Expense and income categories for transactions, linked to groups (basic feature)
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    group_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    icon TEXT, -- Icon identifier
    color TEXT NOT NULL, -- Hex color code
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES category_groups(id) ON DELETE CASCADE
);

-- Transactions table
-- Description: Stores all user financial transactions (income/expense) with details (core feature)
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL,
    category_id TEXT NOT NULL,
    account_id TEXT, -- Link to account (optional for backward compatibility)
    note TEXT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT, -- JSON string for recurring transactions
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

-- Budgets table
-- Description: Monthly/yearly budget plans per category, tracks planned and spent amounts (core feature)
CREATE TABLE budgets (
    id TEXT PRIMARY KEY,
    month TEXT NOT NULL, -- Format: YYYY-MM
    year TEXT NOT NULL, -- Format: YYYY
    category_id TEXT NOT NULL,
    planned DECIMAL(10,2) NOT NULL DEFAULT 0,
    spent DECIMAL(10,2) NOT NULL DEFAULT 0, -- Calculated field
    carryover DECIMAL(10,2) DEFAULT 0, -- For sinking funds
    currency TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(month, category_id)
);

-- Savings goals table
-- Description: User-defined savings goals with target, progress, and completion date (core feature)
CREATE TABLE savings_goals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL,
    target_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);



-- =============================================================================
-- INDEXES
-- =============================================================================

-- Languages indexes
CREATE INDEX idx_languages_code ON languages(code);
CREATE INDEX idx_languages_active ON languages(is_active);

-- Translations indexes
CREATE INDEX idx_translations_language_key ON translations(language_code, key);
CREATE INDEX idx_translations_context ON translations(context);

-- User preferences indexes
CREATE INDEX idx_user_preferences_language ON user_preferences(language_code);
CREATE INDEX idx_user_preferences_currency ON user_preferences(primary_currency);

-- Categories indexes
CREATE INDEX idx_categories_group ON categories(group_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_default ON categories(is_default);

-- Transactions indexes
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_currency ON transactions(currency);
CREATE INDEX idx_transactions_account ON transactions(account_id);

-- Budgets indexes
CREATE INDEX idx_budgets_month_category ON budgets(month, category_id);
CREATE INDEX idx_budgets_year_category ON budgets(year, category_id);
CREATE INDEX idx_budgets_currency ON budgets(currency);

-- Savings goals indexes
CREATE INDEX idx_savings_goals_currency ON savings_goals(currency);
CREATE INDEX idx_savings_goals_active ON savings_goals(is_active);
CREATE INDEX idx_savings_goals_created ON savings_goals(created_at);



-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_transactions_timestamp
    AFTER UPDATE ON transactions
    FOR EACH ROW
BEGIN
    UPDATE transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_budgets_timestamp
    AFTER UPDATE ON budgets
    FOR EACH ROW
BEGIN
    UPDATE budgets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_savings_goals_timestamp
    AFTER UPDATE ON savings_goals
    FOR EACH ROW
BEGIN
    UPDATE savings_goals SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;



-- =============================================================================
-- VIEWS
-- =============================================================================

-- View for budget summary with category names
CREATE VIEW budget_summary AS
SELECT
    b.id,
    b.month,
    b.year,
    b.planned,
    b.spent,
    b.remaining,
    b.carryover,
    b.currency,
    c.name as category_name,
    cg.name as group_name,
    c.color as category_color,
    cg.color as group_color
FROM budgets b
JOIN categories c ON b.category_id = c.id
JOIN category_groups cg ON c.group_id = cg.id;

-- View for transaction summary with category information
CREATE VIEW transaction_summary AS
SELECT
    t.id,
    t.type,
    t.amount,
    t.currency,
    t.note,
    t.date,
    t.is_recurring,
    c.name as category_name,
    cg.name as group_name,
    c.color as category_color,
    cg.color as group_color
FROM transactions t
JOIN categories c ON t.category_id = c.id
JOIN category_groups cg ON c.group_id = cg.id;

-- View for monthly spending by category
CREATE VIEW monthly_spending_by_category AS
SELECT
    strftime('%Y-%m', t.date) as month,
    c.name as category_name,
    cg.name as group_name,
    t.currency,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    COUNT(*) as transaction_count
FROM transactions t
JOIN categories c ON t.category_id = c.id
JOIN category_groups cg ON c.group_id = cg.id
GROUP BY strftime('%Y-%m', t.date), c.id, t.currency;

-- =============================================================================
-- COMMENTS
-- =============================================================================

/*
MoneyWise Database Schema

This schema supports:
- Multi-language support (English, French, Vietnamese)
- Multi-currency transactions with real-time exchange rates
- Budget tracking with rollover
- Savings goals
- Recurring transactions
- Asset/liability tracking
- Multiple account support
- Investment portfolio tracking
- Receipt photo storage and OCR processing
- Family/shared budget management
- User preferences and settings

Key Features:
1. Internationalization: All UI text is stored in translations table
2. Flexibility: Categories and groups can be customized
3. Performance: Proper indexing for common queries
4. Data Integrity: Foreign key constraints and triggers
5. Extensibility: Easy to add new languages or currencies
6. Multi-account: Support for multiple financial accounts
7. Investment tracking: Portfolio management with gain/loss calculations
8. Receipt management: Photo storage with OCR text extraction
9. Family features: Shared budget and expense tracking
10. Currency conversion: Real-time exchange rate support

New Features Added:
1. Accounts: Multiple account support (cash, checking, savings, credit cards, etc.)
2. Receipt Photos: Photo storage with OCR processing and manual correction
3. Investment Holdings: Portfolio tracking with purchase and current prices
4. Family Members: Multi-user support for shared budgets
5. Exchange Rates: Currency conversion with historical rate tracking

Usage:
1. Set up user preferences with language and currency
2. Create accounts for different financial institutions
3. Create categories and category groups as needed
4. Add transactions with proper categorization and account assignment
5. Set up budgets for tracking
6. Create savings goals for financial planning
7. Track investments with purchase and current prices
8. Store receipt photos with OCR processing
9. Set up family groups for shared budget management
10. Configure exchange rates for multi-currency support

The schema is designed to be SQLite compatible but can be easily
adapted for PostgreSQL or MySQL with minimal changes.
*/

