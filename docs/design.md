# Money Wise Design Document

## 1. Overview

App name: MoneyWise

A cross platform (Android/iOS) money management app built with React Native + Expo that allows users to track spending, plan budgets, set savings goals, and optionally connect to banks. The app is designed to be local-first, offline-capable, clean, and easy to use with multi-currency support and clear summaries via charts and lists.

## 2. Key Features

### Core MVP Features
- Manual expense entry (amount, category, note, date)
- Monthly budget setup and tracking
- Savings goal creation and tracking
- Multi-currency support with real-time exchange rates
- **Multi-language support** (English, French, Vietnamese)
- Graphical summary (pie/bar charts, trend analysis)
- Offline local storage (SQLite/MMKV)
- Light/bright theme with dark mode toggle
- No sign-in required
- Budget overview with tabs: Planned, Spent, Remaining per month and year
- Transaction list view with support for income/expense, editable and deletable
- **Recurring transactions** (monthly bills, subscriptions)
- **Quick transaction entry** (frequent categories, amount presets)
- **Search and filtering** (by date range, category, amount)
- **Export functionality** (CSV, PDF reports)
- **Backup and restore** (local file export/import)
- **Smart notifications** (budget alerts, bill reminders)
- **Net worth tracking** (assets and liabilities)
- **Spending insights** (trends, category analysis)
- **Budget rollover** (month-to-month carryover)
- **Multiple accounts** (cash, bank accounts, credit cards)

### Optional (Post-MVP) Features
- Bank account linking via PSD2 APIs
- Transaction import and auto-categorization
- Real-time exchange rate support
- Cloud sync (Supabase, Firebase, etc.)
- Backup/export to CSV or cloud storage
- Notifications for budget limits or savings reminders
- **AI-powered spending insights** and recommendations
- **Bill scanning** (OCR for receipt processing)
- **Family/shared budgets** (multi-user support)
- **Investment tracking** (stocks, crypto, etc.)
- **Tax preparation** (expense categorization for tax season)
- **Financial goals** (debt payoff, emergency fund, etc.)
- **Credit score monitoring** (if bank integration available)

## 3. UI/UX Design

### Navigation
- Bottom tab navigation
    - Home (dashboard/summary)
    - Budgets (monthly/yearly with planned/spent/remaining tabs)
    - Transactions (log + filter by income/expense, editable)
    - Goals (savings plans)
    - Settings (preferences, export, theme)

### Screens & User Flows

#### Home Dashboard
- **Overview Cards**: Total spent this month, remaining budget, savings progress
- **Quick Actions**: Add transaction, view recent transactions
- **Charts**:
  - Spending by category (pie chart)
  - Budget vs actual (bar chart)
  - Net worth trend (line chart)
  - Monthly spending trend
- **Insights**: "You're 20% over budget on dining out"
- **Upcoming**: Recurring transactions due soon

#### Budget Management
- **Monthly/Yearly Toggle**: Switch between time periods
- **Category Budgets**:
  - Planned amount input
  - Current spent amount
  - Remaining amount with progress bar
  - Rollover amount from previous month
- **Budget Alerts**: Visual indicators for over-budget categories
- **Quick Budget**: "Set 50% of income for needs, 30% for wants, 20% for savings"

#### Transaction Management
- **Transaction List**:
  - Sortable by date, amount, category
  - Filter by type (income/expense), date range, category
  - Search functionality
- **Transaction Entry**:
  - Quick amount input with calculator
  - Category selection with icons
  - Date picker (defaults to today)
  - Note field
  - Recurring transaction toggle
- **Transaction Details**: Full view with edit/delete options

#### Savings Goals
- **Goal Cards**: Visual progress with circular progress indicators
- **Goal Details**:
  - Target amount and date
  - Current progress
  - Monthly contribution needed
  - Completion percentage
- **Goal Types**: Emergency fund, vacation, down payment, etc.

#### Settings & Preferences
- **Language Settings**:
  - Language selection (English, French, Vietnamese)
  - Automatic language detection
  - RTL support for future languages
- **Currency Management**:
  - Primary currency selection
  - Multi-currency support
  - Exchange rate updates
- **Theme Settings**: Light/dark mode, accent colors
- **Data Management**:
  - Export data (CSV, PDF)
  - Backup/restore
  - Data privacy settings
- **Notifications**: Budget alerts, bill reminders, goal milestones
- **Account Management**: Multiple accounts setup

### Design Principles
- **Accessibility**: High contrast ratios, large touch targets, screen reader support
- **Responsive**: Adapts to different screen sizes and orientations
- **Intuitive**: Minimal learning curve, familiar patterns
- **Fast**: Optimized for quick data entry and retrieval
- **Secure**: Local-first approach, optional encryption

## 4. Technical Stack

### Frontend
- **Framework**: React Native (with Expo SDK 50+)
- **UI Library**: NativeWind (Tailwind CSS for React Native) with custom theming
- **Navigation**: React Navigation v6 with bottom tabs and stack navigation
- **Charts**: Victory Native for data visualization
- **State Management**: Zustand (lightweight, simple API)
- **Local Storage**: Expo SQLite for structured data, MMKV for key-value storage
- **Icons**: Expo Vector Icons or React Native Vector Icons
- **Date Handling**: date-fns for date manipulation
- **Form Handling**: React Hook Form with validation
- **Animations**: React Native Reanimated for smooth animations

### Development Tools
- **TypeScript**: For type safety and better developer experience
- **ESLint & Prettier**: Code formatting and linting
- **Jest & Testing Library**: Unit and integration testing
- **Flipper**: Debugging and performance monitoring
- **Metro**: Bundler configuration

### Optional Backend
- **Server**: Node.js (Express) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth or Firebase Auth
- **Currency API**: exchangerate.host or Fixer.io
- **Bank API**: Plaid (US), Tink (EU), or Budget Insight (France)
- **File Storage**: Supabase Storage or AWS S3
- **Push Notifications**: Expo Notifications
- **Analytics**: PostHog or Mixpanel (privacy-focused)

### Security Considerations
- **Data Encryption**: SQLCipher for encrypted SQLite
- **Secure Storage**: Expo SecureStore for sensitive data
- **API Security**: JWT tokens, rate limiting
- **Privacy**: GDPR compliance, data minimization

## 5. Data Model/ Schema Design

### Table (SQLite or SQL-based)

`transactions`:
**Description**: Stores all financial transactions (income and expenses) with their details including amount, category, date, and notes.
- `id`: string (UUID)
- `type`: 'income' | 'expense'
- `amount`: decimal(10,2)  // Use decimal for precision
- `currency`: string (3-char ISO code)
- `category_id`: string (UUID, FK to `categories.id`)
- `note`: string
- `date`: datetime (default to current date)
- `created_at`: datetime
- `updated_at`: datetime
- `is_recurring`: boolean (for recurring transactions)
- `recurrence_pattern`: string (JSON, for recurring transactions)
- Indexes: `date`, `category_id`, `type`, `currency`

`budgets`:
**Description**: Stores monthly and yearly budget plans for different categories with planned amounts, actual spending, and carryover amounts.
- `id`: string (UUID)
- `month`: string (e.g., `2025-07`)
- `year`: string (e.g., `2025`)
- `category_id`: string (UUID, FK to `categories.id`)
- `planned`: decimal(10,2)
- `spent`: decimal(10,2) (calculated)
- `carryover`: decimal(10,2) (optional, for sinking funds)
- `currency`: string (3-char ISO code)
- `created_at`: datetime
- `updated_at`: datetime
- Indexes: (`month`, `category_id`), (`year`, `category_id`), `currency`

`savings_goals`:
**Description**: Tracks user-defined savings goals with target amounts, current progress, and completion dates.
- `id`: string (UUID)
- `name`: string
- `target_amount`: decimal(10,2)
- `current_amount`: decimal(10,2)
- `currency`: string (3-char ISO code)
- `target_date`: datetime (optional)
- `is_active`: boolean
- `created_at`: datetime
- `updated_at`: datetime
- Indexes: `currency`, `created_at`, `is_active`

`settings`:
**Description**: Stores user preferences and app configuration settings in key-value format.
- `key`: string (primary key)
- `value`: string (JSON encoded for complex types)
- `updated_at`: datetime

`category_groups`:
**Description**: Groups categories into logical collections (e.g., Housing, Food, Transportation) for better organization.
- `id`: string (UUID)
- `name`: string (e.g., `Housing`)
- `sort_order`: integer
- `color`: string (hex color)
- `icon`: string (icon identifier)
- `created_at`: datetime

`categories`:
**Description**: Individual expense and income categories that users can assign to transactions.
- `id`: string (UUID)
- `name`: string (e.g., "Rent")
- `group_id`: string (UUID, FK to `category_groups.id`)
- `type`: 'expense' | 'income'
- `icon`: string (optional, icon identifier)
- `color`: string (hex color)
- `is_default`: boolean (for system categories)
- `created_at`: datetime
- Indexes: `group_id`, `type`, `is_default`

`assets`:
**Description**: Tracks user's assets and liabilities for net worth calculation and financial overview.
- `id`: string (UUID)
- `name`: string
- `value`: decimal(10,2)
- `currency`: string (3-char ISO code)
- `type`: 'asset' | 'liability'
- `category`: string (e.g., 'savings', 'investment', 'debt')
- `is_active`: boolean
- `created_at`: datetime
- `updated_at`: datetime
- Indexes: `type`, `category`, `currency`, `is_active`

`recurring_transactions`:
**Description**: Stores templates for recurring transactions like monthly bills, subscriptions, and regular income.
- `id`: string (UUID)
- `name`: string
- `amount`: decimal(10,2)
- `currency`: string (3-char ISO code)
- `category_id`: string (UUID, FK to `categories.id`)
- `type`: 'income' | 'expense'
- `frequency`: 'daily' | 'weekly' | 'monthly' | 'yearly'
- `start_date`: datetime
- `end_date`: datetime (optional)
- `is_active`: boolean
- `created_at`: datetime
- Indexes: `category_id`, `type`, `is_active`

`languages`:
**Description**: Stores supported languages and their metadata for the app's internationalization.
- `id`: string (UUID)
- `code`: string (ISO 639-1 language code, e.g., 'en', 'fr', 'vi')
- `name`: string (Language name in native script)
- `native_name`: string (Language name in the language itself)
- `is_rtl`: boolean (Right-to-left text direction)
- `is_active`: boolean
- `sort_order`: integer
- `created_at`: datetime
- Indexes: `code`, `is_active`

`translations`:
**Description**: Stores localized text strings for UI elements, categories, and system messages.
- `id`: string (UUID)
- `language_code`: string (FK to `languages.code`)
- `key`: string (Translation key identifier)
- `value`: string (Localized text)
- `context`: string (Optional context for disambiguation)
- `created_at`: datetime
- `updated_at`: datetime
- Indexes: (`language_code`, `key`), `context`

`user_preferences`:
**Description**: Stores user-specific preferences including language, currency, theme, and notification settings.
- `id`: string (UUID)
- `language_code`: string (FK to `languages.code`)
- `primary_currency`: string (3-char ISO code)
- `theme`: 'light' | 'dark' | 'auto'
- `notifications_enabled`: boolean
- `budget_alerts_enabled`: boolean
- `goal_reminders_enabled`: boolean
- `bill_reminders_enabled`: boolean
- `created_at`: datetime
- `updated_at`: datetime
- Indexes: `language_code`, `primary_currency`

### Table Relationships
- Each `transaction.category_id` references `categories.id`
- `budget.category_id` references `categories.id`
- Each `category.group_id` references `category_groups.id`
- `translation.language_code` references `languages.code`
- `user_preferences.language_code` references `languages.code`

## 6. Notification System

### Overview
The notification system provides users with timely alerts about their financial activities, budget status, and important reminders. It supports both local notifications (when app is open) and push notifications (when app is closed).

### Notification Types

#### 1. Budget Alerts
- **Budget Limit Warning**: When spending approaches 80% of budget
- **Budget Exceeded**: When spending exceeds budget limit
- **Budget Reset**: Monthly budget reset reminders
- **Category Overspending**: Specific category budget alerts

#### 2. Bill & Recurring Transaction Reminders
- **Upcoming Bills**: Reminders for recurring transactions due soon
- **Overdue Bills**: Alerts for missed recurring payments
- **Subscription Renewals**: Reminder for subscription payments

#### 3. Savings Goal Notifications
- **Goal Milestones**: When reaching 25%, 50%, 75% of savings goal
- **Goal Deadline**: Reminders as target date approaches
- **Goal Achieved**: Celebration when goal is completed
- **Contribution Reminders**: Regular reminders to contribute to goals

#### 4. Financial Insights
- **Spending Trends**: Weekly/monthly spending summaries
- **Unusual Spending**: Alerts for spending significantly above average
- **Savings Opportunities**: Suggestions for saving money
- **Net Worth Updates**: Monthly net worth summaries

#### 5. System Notifications
- **App Updates**: New features and improvements
- **Data Backup**: Reminders to backup data
- **Currency Updates**: Exchange rate changes
- **Maintenance**: App maintenance notifications

### Database Schema

The notification system uses two main tables:

#### Notifications Table
Stores all user notifications with types, messages, scheduling, and read status.

#### Notification Templates Table
Stores reusable notification templates for different scenarios.

### User Interface

The notification system includes:

#### Notification Center Screen
- List of all notifications grouped by date
- Mark as read functionality
- Clear all notifications option
- Filter by notification type

#### Notification Settings Screen
- Enable/disable notifications globally
- Granular control over notification types
- Timing preferences for different alerts
- Quiet hours configuration

### User Experience Flow

1. **First Launch**: User is prompted to enable notifications
2. **Settings**: User can customize notification preferences
3. **Real-time**: Notifications appear as events occur
4. **History**: All notifications are stored and viewable
5. **Actions**: Users can mark as read, delete, or take action

### Privacy & Performance

- **Local Storage**: All notification data stored locally
- **No Tracking**: No analytics on notification interactions
- **Battery Optimization**: Efficient scheduling and batching
- **User Control**: Complete control over notification preferences
- **Data Export**: Notifications included in data export

## 6. Architecture & Implementation Strategy

### App Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │  Business Logic │    │   Data Layer    │
│                 │    │                 │    │                 │
│ - Components    │◄──►│ - Services      │◄──►│ - Database      │
│ - Screens       │    │ - Hooks         │    │ - APIs          │
│ - Navigation    │    │ - State Mgmt    │    │ - Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Development Phases

#### Phase 1: Core MVP (4-6 weeks)
1. **Basic Setup**: Project structure, navigation, theme
2. **Data Layer**: SQLite setup, basic CRUD operations
3. **Core Features**:
   - Transaction entry and management
   - Basic budget setup
   - Simple charts and summaries
4. **Testing**: Unit tests for core functionality

#### Phase 2: Enhanced Features (3-4 weeks)
1. **Advanced Budgeting**: Rollover, alerts, insights
2. **Savings Goals**: Goal tracking and progress
3. **Recurring Transactions**: Bill reminders and automation
4. **Export/Backup**: Data export and import functionality

#### Phase 3: Polish & Optimization (2-3 weeks)
1. **Performance**: Optimize queries, lazy loading
2. **UX Improvements**: Animations, micro-interactions
3. **Accessibility**: Screen reader support, high contrast
4. **Testing**: Integration and E2E tests

#### Phase 4: Optional Features (Post-MVP)
1. **Bank Integration**: PSD2 APIs, transaction import
2. **Cloud Sync**: Multi-device support
3. **Advanced Analytics**: AI insights, predictions
4. **Multi-user**: Family/shared budgets

### Performance Considerations
- **Database Optimization**: Proper indexing, query optimization
- **Memory Management**: Efficient list rendering, image optimization
- **Offline Support**: Robust sync mechanisms
- **Bundle Size**: Tree shaking, code splitting
- **Startup Time**: Lazy loading, initialization optimization

### Security & Privacy
- **Local-First**: All data stored locally by default
- **Encryption**: Optional database encryption
- **No Tracking**: Minimal analytics, user privacy focus
- **Data Export**: Full control over user data
- **GDPR Compliance**: Right to be forgotten, data portability

## 7. Testing Strategy

### Unit Testing
- **Business Logic**: Services, utilities, calculations
- **Components**: Individual component behavior
- **Hooks**: Custom React hooks
- **Database**: CRUD operations, migrations

### Integration Testing
- **User Flows**: Complete transaction workflows
- **Data Persistence**: Database operations
- **Navigation**: Screen transitions and state

### E2E Testing
- **Critical Paths**: Transaction entry, budget setup
- **Cross-Platform**: iOS and Android compatibility
- **Performance**: Load times, memory usage

### Testing Tools
- **Jest**: Unit and integration tests
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing for React Native
- **Flipper**: Debugging and performance monitoring