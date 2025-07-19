# Money Wise Design Document

## 1. Overview

App name: MoneyWise

A cross platform (Android/iOS) money management app built with React Native + Expo that allows users to track spending, plan budgets, set savings goals, and optionally connect to banks. The app is designed to be local-first, offline-capable, clean, and easy to use with multi-currency support and clear summaries via charts and lists.

## 2. Key Features

### Core (Basic) Features
- Manual expense entry (amount, category, note, date)
- Monthly budget setup and tracking
- Savings goal creation and tracking
- Multi-currency support with real-time exchange rates
- Multi-language support (English, French, Vietnamese)
- Graphical summary (pie/bar charts, trend analysis)
- Offline local storage (SQLite/MMKV)
- Light/dark mode toggle
- No sign-in required
- Budget overview with tabs: Planned, Spent, Remaining per month and year
- Transaction list view with support for income/expense, editable and deletable



## 3. UI/UX Design

### Navigation
- Bottom tab navigation: Home, Budgets, Transactions, Goals, Settings

### Screens & User Flows
- Home Dashboard: Overview, quick actions, charts, insights, upcoming
- Budget Management: Monthly/yearly toggle, category budgets, alerts
- Transaction Management: List, entry, details, search/filter
- Savings Goals: Goal cards, details, types
- Settings & Preferences: Language, currency, theme, data management, notifications
- Category Management: Organize and edit categories/groups
- Reports & Analytics: Visual analytics, trends, insights

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

Each table below is listed in order from basic/core features. Each has a short, practical description for implementation reference.

`languages`:
**Description**: Supported languages for app localization and internationalization (basic feature)
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
**Description**: Localized UI strings for multi-language support (basic feature)
- `id`: string (UUID)
- `language_code`: string (FK to `languages.code`)
- `key`: string (Translation key identifier)
- `value`: string (Localized text)
- `context`: string (Optional context for disambiguation)
- `created_at`: datetime
- `updated_at`: datetime
- Indexes: (`language_code`, `key`), `context`

`user_preferences`:
**Description**: Stores user-specific settings such as language, currency, theme, and notification preferences (basic feature)
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

`category_groups`:
**Description**: Logical grouping of categories for better organization in UI and reports (basic feature)
- `id`: string (UUID)
- `name`: string (e.g., `Housing`)
- `sort_order`: integer
- `color`: string (hex color)
- `icon`: string (icon identifier)
- `created_at`: datetime

`categories`:
**Description**: Expense and income categories for transactions, linked to groups (basic feature)
- `id`: string (UUID)
- `name`: string (e.g., "Rent")
- `group_id`: string (UUID, FK to `category_groups.id`)
- `type`: 'expense' | 'income'
- `icon`: string (optional, icon identifier)
- `color`: string (hex color)
- `is_default`: boolean (for system categories)
- `created_at`: datetime
- Indexes: `group_id`, `type`, `is_default`

`transactions`:
**Description**: Stores all user financial transactions (income/expense) with details (core feature)
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
**Description**: Monthly/yearly budget plans per category, tracks planned and spent amounts (core feature)
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
**Description**: User-defined savings goals with target, progress, and completion date (core feature)
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



### Database Architecture Overview

#### Core Tables
1. **`languages`** - Supported languages metadata
2. **`translations`** - Localized text strings
3. **`user_preferences`** - User settings including language
4. **`transactions`** - Financial transactions
5. **`budgets`** - Monthly/yearly budget plans
6. **`savings_goals`** - User-defined savings goals
7. **`categories`** - Transaction categories
8. **`category_groups`** - Category organization

#### Database Features
- **SQLite compatible** with PostgreSQL extensions
- **Proper indexing** for performance
- **Foreign key constraints** for data integrity
- **Triggers** for automatic timestamp updates
- **Views** for common query patterns
- **Sample data** for all supported languages

### Table Relationships
- Each `transaction.category_id` references `categories.id`
- `budget.category_id` references `categories.id`
- Each `category.group_id` references `category_groups.id`
- `translation.language_code` references `languages.code`
- `user_preferences.language_code` references `languages.code`



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

#### Phase 2: Polish & Optimization (2-3 weeks)
1. **Performance**: Optimize queries, lazy loading
2. **UX Improvements**: Animations, micro-interactions
3. **Accessibility**: Screen reader support, high contrast
4. **Testing**: Integration and E2E tests

### Performance Considerations
- **Database Optimization**: Proper indexing, query optimization
- **Memory Management**: Efficient list rendering, image optimization
- **Offline Support**: Robust sync mechanisms
- **Bundle Size**: Tree shaking, code splitting
- **Startup Time**: Lazy loading, initialization optimization
- **Translation Caching**: In-memory translation storage

### Migration & Deployment

#### Adding New Languages
1. Add language record to database
2. Translate all UI strings
3. Test with native speakers
4. Update app store metadata
5. Deploy with app update

#### Database Migrations
- Version-controlled schema changes
- Backward compatibility
- Data migration scripts
- Rollback procedures

### Security & Privacy
- **Local-First**: All data stored locally by default
- **Encryption**: Optional database encryption
- **No Tracking**: Minimal analytics, user privacy focus
- **Data Export**: Full control over user data
- **GDPR Compliance**: Right to be forgotten, data portability

## 7. Language Support

### Supported Languages
- **English** (en) - Primary language
- **French** (fr) - Français
- **Vietnamese** (vi) - Tiếng Việt

### Language Features
- Dynamic language switching in settings
- Automatic language detection
- RTL support for future languages
- Context-aware translations
- Fallback to English for missing translations

## 8. Testing Strategy

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

### Translation Testing
- **Completeness**: Ensure all UI text has translations
- **Accuracy**: Review by native speakers
- **Context**: Verify correct context usage
- **Length**: Test UI with longest translations

### Testing Tools
- **Jest**: Unit and integration tests
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing for React Native
- **Flipper**: Debugging and performance monitoring

