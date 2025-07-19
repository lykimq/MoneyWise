# MoneyWise Documentation

## Overview

MoneyWise is a cross-platform money management app built with React Native + Expo that allows users to track spending, plan budgets, set savings goals, and optionally connect to banks. The app is designed to be local-first, offline-capable, clean, and easy to use with multi-currency and multi-language support.

## 📚 Documentation Files

### Core Design Documents

- **[Design Document](design.md)** - Complete app specification, features, and technical architecture
- **[Wireframes](wireframes.md)** - Detailed UI wireframes for all screens and user flows
- **[Database Schema](database_schema.sql)** - Complete SQL database schema with sample data
- **[Language Support](language_support.md)** - Multi-language implementation guide

### Key Features

#### ✅ Core MVP Features
- Manual expense entry (amount, category, note, date)
- Monthly budget setup and tracking
- Savings goal creation and tracking
- **Multi-currency support** with real-time exchange rates
- **Multi-language support** (English, French, Vietnamese)
- Graphical summary (pie/bar charts, trend analysis)
- Offline local storage (SQLite/MMKV)
- Light/bright theme with dark mode toggle
- No sign-in required
- Budget overview with tabs: Planned, Spent, Remaining per month and year
- Transaction list view with support for income/expense, editable and deletable

#### 🔄 Enhanced Features
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

#### 🚀 Optional (Post-MVP) Features
- Bank account linking via PSD2 APIs
- Transaction import and auto-categorization
- Real-time exchange rate support
- Cloud sync (Supabase, Firebase, etc.)
- **AI-powered spending insights** and recommendations
- **Bill scanning** (OCR for receipt processing)
- **Family/shared budgets** (multi-user support)
- **Investment tracking** (stocks, crypto, etc.)
- **Tax preparation** (expense categorization for tax season)
- **Credit score monitoring** (if bank integration available)

## 🔔 Smart Notification System

### Overview
The notification system provides users with timely alerts about their financial activities, budget status, and important reminders. It supports both local notifications (when app is open) and push notifications (when app is closed).

### Notification Types

#### 📊 Budget Alerts
- **Budget Limit Warning**: When spending approaches 80% of budget
- **Budget Exceeded**: When spending exceeds budget limit
- **Budget Reset**: Monthly budget reset reminders
- **Category Overspending**: Specific category budget alerts

#### 📅 Bill & Recurring Transaction Reminders
- **Upcoming Bills**: Reminders for recurring transactions due soon
- **Overdue Bills**: Alerts for missed recurring payments
- **Subscription Renewals**: Reminder for subscription payments

#### 🎯 Savings Goal Notifications
- **Goal Milestones**: When reaching 25%, 50%, 75% of savings goal
- **Goal Deadline**: Reminders as target date approaches
- **Goal Achieved**: Celebration when goal is completed
- **Contribution Reminders**: Regular reminders to contribute to goals

#### 📈 Financial Insights
- **Spending Trends**: Weekly/monthly spending summaries
- **Unusual Spending**: Alerts for spending significantly above average
- **Savings Opportunities**: Suggestions for saving money
- **Net Worth Updates**: Monthly net worth summaries

#### ⚙️ System Notifications
- **App Updates**: New features and improvements
- **Data Backup**: Reminders to backup data
- **Currency Updates**: Exchange rate changes
- **Maintenance**: App maintenance notifications

### User Interface

#### Notification Center
- List of all notifications grouped by date
- Mark as read functionality
- Clear all notifications option
- Filter by notification type
- Quick actions for each notification

#### Notification Settings
- Enable/disable notifications globally
- Granular control over notification types
- Timing preferences for different alerts
- Quiet hours configuration
- Push notification permissions

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

## 🌍 Language Support

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

## 🗄️ Database Architecture

### Core Tables
1. **`languages`** - Supported languages metadata
2. **`translations`** - Localized text strings
3. **`user_preferences`** - User settings including language
4. **`transactions`** - Financial transactions
5. **`budgets`** - Monthly/yearly budget plans
6. **`savings_goals`** - User-defined savings goals
7. **`categories`** - Transaction categories
8. **`category_groups`** - Category organization
9. **`assets`** - Assets and liabilities tracking
10. **`recurring_transactions`** - Recurring transaction templates
11. **`settings`** - App configuration (key-value store)
12. **`notifications`** - User notifications and alerts
13. **`notification_templates`** - Reusable notification templates

### Database Features
- **SQLite compatible** with PostgreSQL extensions
- **Proper indexing** for performance
- **Foreign key constraints** for data integrity
- **Triggers** for automatic timestamp updates
- **Views** for common query patterns
- **Sample data** for all supported languages

## 🎨 UI/UX Design

### Navigation Structure
- Bottom tab navigation with 5 main sections:
  - **Home** (dashboard/summary)
  - **Budgets** (monthly/yearly with planned/spent/remaining tabs)
  - **Transactions** (log + filter by income/expense, editable)
  - **Goals** (savings plans)
  - **Settings** (preferences, export, theme, language)

### Design Principles
- **Accessibility**: High contrast ratios, large touch targets, screen reader support
- **Responsive**: Adapts to different screen sizes and orientations
- **Intuitive**: Minimal learning curve, familiar patterns
- **Fast**: Optimized for quick data entry and retrieval
- **Secure**: Local-first approach, optional encryption

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Neutral**: Gray (#6B7280)

## 🛠️ Technical Stack

### Frontend
- **Framework**: React Native (with Expo SDK 50+)
- **UI Library**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation v6
- **Charts**: Victory Native for data visualization
- **State Management**: Zustand (lightweight, simple API)
- **Local Storage**: Expo SQLite for structured data, MMKV for key-value storage
- **Icons**: Expo Vector Icons or React Native Vector Icons
- **Date Handling**: date-fns for date manipulation
- **Form Handling**: React Hook Form with validation
- **Animations**: React Native Reanimated

### Development Tools
- **TypeScript**: For type safety and better developer experience
- **ESLint & Prettier**: Code formatting and linting
- **Jest & Testing Library**: Unit and integration testing
- **Flipper**: Debugging and performance monitoring

### Optional Backend
- **Server**: Node.js (Express) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth or Firebase Auth
- **Currency API**: exchangerate.host or Fixer.io
- **Bank API**: Plaid (US), Tink (EU), or Budget Insight (France)
- **File Storage**: Supabase Storage or AWS S3
- **Push Notifications**: Expo Notifications
- **Analytics**: PostHog or Mixpanel (privacy-focused)

## 🔒 Security & Privacy

### Security Features
- **Local-First**: All data stored locally by default
- **Data Encryption**: SQLCipher for encrypted SQLite
- **Secure Storage**: Expo SecureStore for sensitive data
- **API Security**: JWT tokens, rate limiting
- **Privacy**: GDPR compliance, data minimization

### Privacy Features
- **No Tracking**: Minimal analytics, user privacy focus
- **Data Export**: Full control over user data
- **GDPR Compliance**: Right to be forgotten, data portability
- **Local Processing**: All calculations done on device

## 📱 Screens & Features

### Home Dashboard
- Overview cards (Total spent, Remaining, Savings)
- Quick actions (Add transaction, View budget, Goals progress)
- Spending by category (pie chart)
- Recent transactions list
- Upcoming bills reminders

### Budget Management
- Monthly/Yearly toggle
- Budget overview (Planned, Spent, Remaining)
- Category budgets with progress bars
- Budget insights and alerts
- Quick budget setup

### Transaction Management
- Transaction list with search and filtering
- Add transaction with calculator interface
- Category selection with icons
- Date picker and note fields
- Recurring transaction setup

### Savings Goals
- Goal cards with circular progress indicators
- Goal details (target amount, current progress, completion date)
- Monthly contribution calculations
- Goal insights and recommendations

### Settings & Preferences
- **Language selection** (English, French, Vietnamese)
- Currency management
- Theme settings (light/dark/auto)
- Data management (export/import/backup)
- Notification preferences
- Account management

### Notification System
- **Notification Center**: View all notifications with filtering and search
- **Notification Settings**: Granular control over notification types and timing
- **Budget Alerts**: Real-time warnings when approaching budget limits
- **Bill Reminders**: Upcoming bill notifications with action buttons
- **Goal Milestones**: Celebration notifications for savings achievements
- **Financial Insights**: Weekly summaries and spending pattern alerts
- **Quick Actions**: Direct actions from notifications (pay bills, view budgets, etc.)

## 🧪 Testing Strategy

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

## 🚀 Development Phases

### Phase 1: Core MVP (4-6 weeks)
1. **Basic Setup**: Project structure, navigation, theme
2. **Data Layer**: SQLite setup, basic CRUD operations
3. **Core Features**: Transaction entry, basic budget setup, simple charts
4. **Language Support**: Multi-language implementation
5. **Testing**: Unit tests for core functionality

### Phase 2: Enhanced Features (3-4 weeks)
1. **Advanced Budgeting**: Rollover, alerts, insights
2. **Savings Goals**: Goal tracking and progress
3. **Recurring Transactions**: Bill reminders and automation
4. **Export/Backup**: Data export and import functionality

### Phase 3: Polish & Optimization (2-3 weeks)
1. **Performance**: Optimize queries, lazy loading
2. **UX Improvements**: Animations, micro-interactions
3. **Accessibility**: Screen reader support, high contrast
4. **Testing**: Integration and E2E tests

### Phase 4: Optional Features (Post-MVP)
1. **Bank Integration**: PSD2 APIs, transaction import
2. **Cloud Sync**: Multi-device support
3. **Advanced Analytics**: AI insights, predictions
4. **Multi-user**: Family/shared budgets

## 📊 Performance Considerations

- **Database Optimization**: Proper indexing, query optimization
- **Memory Management**: Efficient list rendering, image optimization
- **Offline Support**: Robust sync mechanisms
- **Bundle Size**: Tree shaking, code splitting
- **Startup Time**: Lazy loading, initialization optimization
- **Translation Caching**: In-memory translation storage

## 🔄 Migration & Deployment

### Adding New Languages
1. Add language record to database
2. Translate all UI strings
3. Test with native speakers
4. Update app store metadata
5. Deploy with app update

### Database Migrations
- Version-controlled schema changes
- Backward compatibility
- Data migration scripts
- Rollback procedures

## 📈 Future Roadmap

### Short Term (3-6 months)
- Complete MVP features
- Polish UI/UX
- Performance optimization
- Comprehensive testing

### Medium Term (6-12 months)
- Bank integration
- Cloud sync
- Advanced analytics
- Additional languages

### Long Term (12+ months)
- AI-powered insights
- Family/shared budgets
- Investment tracking
- Tax preparation features

**MoneyWise** - Smart money management for everyone, everywhere.