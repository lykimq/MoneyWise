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

-- Assets table
-- Description: Tracks user assets and liabilities for net worth calculation (enhanced feature)
CREATE TABLE assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('asset', 'liability')),
    category TEXT NOT NULL, -- e.g., 'savings', 'investment', 'debt'
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recurring transactions table
-- Description: Templates for recurring transactions (bills, subscriptions, regular income) (enhanced feature)
CREATE TABLE recurring_transactions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL,
    category_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATETIME NOT NULL,
    end_date DATETIME, -- Optional end date
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Settings table (key-value store)
-- Description: App-wide configuration and feature flags (enhanced/advanced feature)
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL, -- JSON encoded for complex types
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
-- Description: Stores all user notifications, alerts, and reminders (enhanced feature)
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default', -- For future multi-user support
    type TEXT NOT NULL CHECK (type IN (
        'budget_warning', 'budget_exceeded', 'budget_reset',
        'bill_reminder', 'bill_overdue', 'subscription_renewal',
        'goal_milestone', 'goal_deadline', 'goal_achieved', 'goal_reminder',
        'spending_trend', 'unusual_spending', 'savings_opportunity', 'net_worth_update',
        'app_update', 'backup_reminder', 'currency_update', 'maintenance'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT, -- JSON string for additional data
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    scheduled_for DATETIME NOT NULL,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notification templates table
-- Description: Reusable templates for notifications (enhanced/advanced feature)
CREATE TABLE notification_templates (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL UNIQUE,
    title_template TEXT NOT NULL,
    message_template TEXT NOT NULL,
    default_schedule TEXT, -- JSON string for default scheduling
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- NEW FEATURE TABLES
-- =============================================================================
-- Accounts table - for multiple account support
-- Description: Tracks user accounts (cash, bank, credit, etc.) for multi-account and net worth features (advanced/future feature)
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cash', 'checking', 'savings', 'credit_card', 'investment', 'other')),
    balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL,
    account_number TEXT, -- Optional account number
    institution TEXT, -- Bank or financial institution name
    color TEXT NOT NULL, -- Hex color for UI identification
    icon TEXT, -- Icon identifier
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Receipt photos table - for receipt storage and OCR
-- Description: Stores receipt images and OCR data for bill scanning and receipt library (advanced/future feature)
CREATE TABLE receipt_photos (
    id TEXT PRIMARY KEY,
    transaction_id TEXT, -- Optional link to transaction
    file_path TEXT NOT NULL, -- Local file path
    file_name TEXT NOT NULL,
    file_size INTEGER, -- File size in bytes
    mime_type TEXT NOT NULL, -- e.g., 'image/jpeg', 'image/png'
    ocr_text TEXT, -- Extracted text from OCR
    ocr_confidence DECIMAL(3,2), -- OCR confidence score (0.00-1.00)
    ocr_processed BOOLEAN DEFAULT FALSE,
    ocr_processed_at DATETIME,
    manual_corrected BOOLEAN DEFAULT FALSE,
    notes TEXT, -- User notes about the receipt
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);

-- Investment holdings table - for investment tracking
-- Description: Tracks user investment holdings (stocks, crypto, etc.) for advanced analytics (future feature)
CREATE TABLE investment_holdings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT, -- Stock/crypto symbol
    type TEXT NOT NULL CHECK (type IN ('stock', 'crypto', 'bond', 'etf', 'mutual_fund', 'real_estate', 'other')),
    quantity DECIMAL(10,6) NOT NULL, -- Number of units
    purchase_price DECIMAL(10,2) NOT NULL, -- Price per unit at purchase
    current_price DECIMAL(10,2), -- Current market price
    currency TEXT NOT NULL,
    purchase_date DATETIME NOT NULL,
    last_updated DATETIME,
    account_id TEXT, -- Link to account if applicable
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

-- Family members table - for shared/family budgets
-- Description: Links users to family/shared budget groups (future feature)
CREATE TABLE family_members (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL, -- Family group identifier
    user_id TEXT NOT NULL, -- User identifier
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    email TEXT, -- Optional email for notifications
    avatar TEXT, -- Avatar image path
    is_active BOOLEAN DEFAULT TRUE,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exchange rates table - for multi-currency support
-- Description: Stores currency exchange rates for multi-currency transactions (future feature)
CREATE TABLE exchange_rates (
    id TEXT PRIMARY KEY,
    from_currency TEXT NOT NULL, -- Source currency (3-char ISO code)
    to_currency TEXT NOT NULL, -- Target currency (3-char ISO code)
    rate DECIMAL(10,6) NOT NULL, -- Exchange rate
    rate_date DATETIME NOT NULL, -- Date when rate was valid
    source TEXT, -- Source of exchange rate (e.g., 'api', 'manual')
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency, rate_date)
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

-- Assets indexes
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_currency ON assets(currency);
CREATE INDEX idx_assets_active ON assets(is_active);

-- Recurring transactions indexes
CREATE INDEX idx_recurring_transactions_category ON recurring_transactions(category_id);
CREATE INDEX idx_recurring_transactions_type ON recurring_transactions(type);
CREATE INDEX idx_recurring_transactions_active ON recurring_transactions(is_active);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_sent ON notifications(is_sent);

-- Notification templates indexes
CREATE INDEX idx_notification_templates_type ON notification_templates(type);
CREATE INDEX idx_notification_templates_active ON notification_templates(is_active);

-- =============================================================================
-- NEW FEATURE INDEXES
-- =============================================================================

-- Accounts indexes
CREATE INDEX idx_accounts_type ON accounts(type);
CREATE INDEX idx_accounts_currency ON accounts(currency);
CREATE INDEX idx_accounts_active ON accounts(is_active);
CREATE INDEX idx_accounts_default ON accounts(is_default);

-- Receipt photos indexes
CREATE INDEX idx_receipt_photos_transaction ON receipt_photos(transaction_id);
CREATE INDEX idx_receipt_photos_ocr_processed ON receipt_photos(ocr_processed);
CREATE INDEX idx_receipt_photos_created ON receipt_photos(created_at);

-- Investment holdings indexes
CREATE INDEX idx_investment_holdings_type ON investment_holdings(type);
CREATE INDEX idx_investment_holdings_symbol ON investment_holdings(symbol);
CREATE INDEX idx_investment_holdings_account ON investment_holdings(account_id);
CREATE INDEX idx_investment_holdings_currency ON investment_holdings(currency);
CREATE INDEX idx_investment_holdings_active ON investment_holdings(is_active);
CREATE INDEX idx_investment_holdings_purchase_date ON investment_holdings(purchase_date);

-- Family members indexes
CREATE INDEX idx_family_members_family ON family_members(family_id);
CREATE INDEX idx_family_members_user ON family_members(user_id);
CREATE INDEX idx_family_members_role ON family_members(role);
CREATE INDEX idx_family_members_active ON family_members(is_active);

-- Exchange rates indexes
CREATE INDEX idx_exchange_rates_from_currency ON exchange_rates(from_currency);
CREATE INDEX idx_exchange_rates_to_currency ON exchange_rates(to_currency);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(rate_date);
CREATE INDEX idx_exchange_rates_active ON exchange_rates(is_active);
CREATE INDEX idx_exchange_rates_from_to_date ON exchange_rates(from_currency, to_currency, rate_date);

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

CREATE TRIGGER update_assets_timestamp
    AFTER UPDATE ON assets
    FOR EACH ROW
BEGIN
    UPDATE assets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_translations_timestamp
    AFTER UPDATE ON translations
    FOR EACH ROW
BEGIN
    UPDATE translations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_user_preferences_timestamp
    AFTER UPDATE ON user_preferences
    FOR EACH ROW
BEGIN
    UPDATE user_preferences SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- New feature triggers
CREATE TRIGGER update_accounts_timestamp
    AFTER UPDATE ON accounts
    FOR EACH ROW
BEGIN
    UPDATE accounts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_receipt_photos_timestamp
    AFTER UPDATE ON receipt_photos
    FOR EACH ROW
BEGIN
    UPDATE receipt_photos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_investment_holdings_timestamp
    AFTER UPDATE ON investment_holdings
    FOR EACH ROW
BEGIN
    UPDATE investment_holdings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_family_members_timestamp
    AFTER UPDATE ON family_members
    FOR EACH ROW
BEGIN
    UPDATE family_members SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_exchange_rates_timestamp
    AFTER UPDATE ON exchange_rates
    FOR EACH ROW
BEGIN
    UPDATE exchange_rates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
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
    t.account_id,
    c.name as category_name,
    cg.name as group_name,
    c.color as category_color,
    cg.color as group_color,
    a.name as account_name,
    a.type as account_type,
    a.institution as account_institution
FROM transactions t
JOIN categories c ON t.category_id = c.id
JOIN category_groups cg ON c.group_id = cg.id
LEFT JOIN accounts a ON t.account_id = a.id;

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
-- NEW FEATURE VIEWS
-- =============================================================================

-- View for account summary with balances
CREATE VIEW account_summary AS
SELECT
    a.id,
    a.name,
    a.type,
    a.balance,
    a.currency,
    a.institution,
    a.color,
    a.icon,
    a.is_active,
    a.is_default,
    COUNT(t.id) as transaction_count,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses
FROM accounts a
LEFT JOIN transactions t ON t.account_id = a.id
WHERE a.is_active = TRUE
GROUP BY a.id;

-- View for investment portfolio summary
CREATE VIEW investment_portfolio_summary AS
SELECT
    ih.id,
    ih.name,
    ih.symbol,
    ih.type,
    ih.quantity,
    ih.purchase_price,
    ih.current_price,
    ih.currency,
    ih.purchase_date,
    (ih.quantity * ih.purchase_price) as total_invested,
    (ih.quantity * COALESCE(ih.current_price, ih.purchase_price)) as current_value,
    ((ih.quantity * COALESCE(ih.current_price, ih.purchase_price)) - (ih.quantity * ih.purchase_price)) as gain_loss,
    CASE
        WHEN ih.purchase_price > 0
        THEN ((COALESCE(ih.current_price, ih.purchase_price) - ih.purchase_price) / ih.purchase_price) * 100
        ELSE 0
    END as gain_loss_percentage,
    a.name as account_name,
    a.institution as account_institution
FROM investment_holdings ih
LEFT JOIN accounts a ON ih.account_id = a.id
WHERE ih.is_active = TRUE;

-- View for receipt photos with transaction details
CREATE VIEW receipt_photos_summary AS
SELECT
    rp.id,
    rp.file_name,
    rp.file_size,
    rp.mime_type,
    rp.ocr_text,
    rp.ocr_confidence,
    rp.ocr_processed,
    rp.manual_corrected,
    rp.notes,
    rp.created_at,
    t.id as transaction_id,
    t.amount as transaction_amount,
    t.currency as transaction_currency,
    t.type as transaction_type,
    c.name as category_name
FROM receipt_photos rp
LEFT JOIN transactions t ON rp.transaction_id = t.id
LEFT JOIN categories c ON t.category_id = c.id;

-- View for family members with roles
CREATE VIEW family_members_summary AS
SELECT
    fm.id,
    fm.family_id,
    fm.user_id,
    fm.name,
    fm.role,
    fm.email,
    fm.avatar,
    fm.is_active,
    fm.joined_at,
    COUNT(DISTINCT t.id) as transaction_count,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses
FROM family_members fm
LEFT JOIN transactions t ON t.user_id = fm.user_id
WHERE fm.is_active = TRUE
GROUP BY fm.id;

-- View for latest exchange rates
CREATE VIEW latest_exchange_rates AS
SELECT
    from_currency,
    to_currency,
    rate,
    rate_date,
    source,
    created_at
FROM exchange_rates er1
WHERE rate_date = (
    SELECT MAX(rate_date)
    FROM exchange_rates er2
    WHERE er2.from_currency = er1.from_currency
    AND er2.to_currency = er1.to_currency
    AND er2.is_active = TRUE
)
AND is_active = TRUE;

-- =============================================================================
-- SAMPLE DATA FOR NEW FEATURES
-- =============================================================================

-- Sample accounts
INSERT INTO accounts (id, name, type, balance, currency, institution, color, icon, is_default) VALUES
('acc-001', 'Main Checking', 'checking', 2500.00, 'EUR', 'Bank of Europe', '#3B82F6', 'account', TRUE),
('acc-002', 'Savings Account', 'savings', 15000.00, 'EUR', 'Bank of Europe', '#10B981', 'piggy-bank', FALSE),
('acc-003', 'Credit Card', 'credit_card', -500.00, 'EUR', 'Visa Bank', '#EF4444', 'credit-card', FALSE),
('acc-004', 'Cash Wallet', 'cash', 200.00, 'EUR', NULL, '#F59E0B', 'wallet', FALSE),
('acc-005', 'Investment Account', 'investment', 5000.00, 'EUR', 'Investment Bank', '#8B5CF6', 'trending-up', FALSE);

-- Sample investment holdings
INSERT INTO investment_holdings (id, name, symbol, type, quantity, purchase_price, current_price, currency, purchase_date, account_id) VALUES
('inv-001', 'Apple Inc.', 'AAPL', 'stock', 10.000000, 150.00, 175.50, 'EUR', '2024-01-15', 'acc-005'),
('inv-002', 'Bitcoin', 'BTC', 'crypto', 0.500000, 45000.00, 52000.00, 'EUR', '2024-02-01', 'acc-005'),
('inv-003', 'Vanguard S&P 500 ETF', 'VOO', 'etf', 25.000000, 350.00, 380.00, 'EUR', '2024-01-10', 'acc-005'),
('inv-004', 'Tesla Inc.', 'TSLA', 'stock', 5.000000, 200.00, 180.00, 'EUR', '2024-03-01', 'acc-005');

-- Sample family members
INSERT INTO family_members (id, family_id, user_id, name, role, email) VALUES
('fm-001', 'family-001', 'user-001', 'John Doe', 'owner', 'john@example.com'),
('fm-002', 'family-001', 'user-002', 'Jane Doe', 'admin', 'jane@example.com'),
('fm-003', 'family-001', 'user-003', 'Junior Doe', 'member', 'junior@example.com');

-- Sample exchange rates
INSERT INTO exchange_rates (id, from_currency, to_currency, rate, rate_date, source) VALUES
('er-001', 'EUR', 'USD', 1.0850, '2024-01-01', 'api'),
('er-002', 'EUR', 'GBP', 0.8600, '2024-01-01', 'api'),
('er-003', 'USD', 'EUR', 0.9217, '2024-01-01', 'api'),
('er-004', 'GBP', 'EUR', 1.1628, '2024-01-01', 'api'),
('er-005', 'EUR', 'USD', 1.0900, '2024-01-15', 'api'),
('er-006', 'EUR', 'GBP', 0.8650, '2024-01-15', 'api');

-- Sample receipt photos
INSERT INTO receipt_photos (id, transaction_id, file_path, file_name, file_size, mime_type, ocr_text, ocr_confidence, ocr_processed) VALUES
('rp-001', NULL, '/receipts/grocery_store_20240115.jpg', 'grocery_store_20240115.jpg', 2048576, 'image/jpeg', 'GROCERY STORE\nTotal: €45.67\nDate: 2024-01-15', 0.85, TRUE),
('rp-002', NULL, '/receipts/gas_station_20240116.jpg', 'gas_station_20240116.jpg', 1536000, 'image/jpeg', 'GAS STATION\nFuel: €65.00\nDate: 2024-01-16', 0.92, TRUE);

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

-- Advanced User Experience Features Tables

-- Achievements and Gamification System
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    requirement_type TEXT NOT NULL, -- 'count', 'amount', 'streak', 'percentage'
    requirement_value REAL NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    progress REAL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE achievement_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    current_value REAL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);

-- Voice Input and Speech Recognition
CREATE TABLE voice_commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command TEXT NOT NULL,
    action TEXT NOT NULL,
    parameters TEXT, -- JSON string for command parameters
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voice_recognition_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    spoken_text TEXT NOT NULL,
    recognized_text TEXT NOT NULL,
    confidence REAL NOT NULL,
    action_taken TEXT,
    language TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Smart Search and Discovery
CREATE TABLE search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    search_query TEXT NOT NULL,
    search_type TEXT NOT NULL, -- 'transaction', 'category', 'account', 'general'
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE search_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    category TEXT NOT NULL,
    frequency INTEGER DEFAULT 1,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE search_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    search_query TEXT NOT NULL,
    result_count INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    filters_applied TEXT, -- JSON string of applied filters
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Data Management and Recovery
CREATE TABLE data_validation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    validation_type TEXT NOT NULL, -- 'integrity', 'format', 'constraints', 'backup'
    status TEXT NOT NULL, -- 'passed', 'failed', 'warning'
    details TEXT,
    records_checked INTEGER DEFAULT 0,
    issues_found INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version_from TEXT NOT NULL,
    version_to TEXT NOT NULL,
    migration_script TEXT NOT NULL,
    status TEXT NOT NULL, -- 'pending', 'running', 'completed', 'failed'
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    records_migrated INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE backup_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    backup_file TEXT NOT NULL,
    backup_type TEXT NOT NULL, -- 'manual', 'automatic', 'scheduled'
    size_bytes INTEGER NOT NULL,
    record_count INTEGER NOT NULL,
    checksum TEXT NOT NULL,
    encryption_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE data_recovery_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recovery_type TEXT NOT NULL, -- 'backup', 'import', 'reset'
    source TEXT NOT NULL, -- 'local', 'cloud', 'file'
    status TEXT NOT NULL, -- 'started', 'in_progress', 'completed', 'failed'
    records_restored INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Haptic Feedback Settings
CREATE TABLE haptic_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    feature TEXT NOT NULL, -- 'transaction', 'budget', 'goal', 'navigation'
    enabled BOOLEAN DEFAULT TRUE,
    intensity TEXT DEFAULT 'medium', -- 'light', 'medium', 'strong'
    pattern TEXT DEFAULT 'default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, feature)
);

-- Sample data for achievements
INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, points) VALUES
('First Goal', 'Create your first savings goal', '🎯', 'goals', 'count', 1, 50),
('Budget Master', 'Stay under budget for 30 consecutive days', '🏆', 'budget', 'streak', 30, 200),
('Savings Champion', 'Save $1,000 in one month', '💰', 'savings', 'amount', 1000, 300),
('Goal Crusher', 'Complete 3 savings goals', '📊', 'goals', 'count', 3, 150),
('Consistent Saver', 'Save money for 7 consecutive days', '📈', 'savings', 'streak', 7, 100),
('Net Worth Builder', 'Increase net worth by 10%', '🏠', 'net_worth', 'percentage', 10, 250),
('Transaction Tracker', 'Log 100 transactions', '📝', 'transactions', 'count', 100, 75),
('Category Expert', 'Use all predefined categories', '🏷️', 'categories', 'count', 15, 100),
('Receipt Scanner', 'Scan 50 receipts', '📷', 'receipts', 'count', 50, 125),
('Family Manager', 'Add 3 family members', '👥', 'family', 'count', 3, 150);

-- Sample data for voice commands
INSERT INTO voice_commands (command, action, parameters, description) VALUES
('add transaction', 'create_transaction', '{"amount": "required", "category": "optional", "description": "optional"}', 'Add a new transaction'),
('show budget', 'view_budget', '{}', 'Display budget overview'),
('search transactions', 'search_transactions', '{"query": "required"}', 'Search for transactions'),
('set goal', 'create_goal', '{"name": "required", "amount": "required"}', 'Create a new savings goal'),
('show reports', 'view_reports', '{}', 'Display analytics and reports'),
('scan receipt', 'scan_receipt', '{}', 'Open receipt scanner'),
('view net worth', 'view_net_worth', '{}', 'Show net worth overview'),
('backup data', 'backup_data', '{}', 'Create data backup'),
('export data', 'export_data', '{"format": "optional"}', 'Export data to file'),
('show settings', 'view_settings', '{}', 'Open app settings');

-- Sample data for search suggestions
INSERT INTO search_suggestions (query, suggestion, category, frequency) VALUES
('groceries', 'groceries', 'category', 15),
('rent', 'rent payment', 'transaction', 8),
('dining', 'dining out', 'category', 12),
('gas', 'gas station', 'merchant', 6),
('coffee', 'coffee shop', 'merchant', 10),
('salary', 'salary', 'income', 4),
('utilities', 'utilities', 'category', 7),
('shopping', 'shopping', 'category', 9),
('transport', 'transportation', 'category', 5),
('entertainment', 'entertainment', 'category', 3);

-- Create indexes for performance
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_achievement_progress_user_id ON achievement_progress(user_id);
CREATE INDEX idx_voice_recognition_logs_user_id ON voice_recognition_logs(user_id);
CREATE INDEX idx_voice_recognition_logs_created_at ON voice_recognition_logs(created_at);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);
CREATE INDEX idx_search_suggestions_query ON search_suggestions(query);
CREATE INDEX idx_data_validation_logs_created_at ON data_validation_logs(created_at);
CREATE INDEX idx_data_migrations_status ON data_migrations(status);
CREATE INDEX idx_backup_metadata_created_at ON backup_metadata(created_at);
CREATE INDEX idx_data_recovery_sessions_user_id ON data_recovery_sessions(user_id);
CREATE INDEX idx_haptic_settings_user_id ON haptic_settings(user_id);