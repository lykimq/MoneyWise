# MoneyWise App

A React Native personal finance app that helps you track budgets, manage spending, and get insights into your financial habits.

## 🚀 What's Inside

**Core Features:**
- **Budget Tracking**: View planned vs actual spending with visual progress indicators
- **Category Management**: Organize expenses by categories with color-coded progress
- **Time Periods**: Switch between monthly and yearly budget views
- **Smart Insights**: Get AI-generated recommendations based on spending patterns
- **Modern UI**: Clean, intuitive interface with tab navigation

**Technical Stack:**
- **Frontend**: React Native with Expo
- **Navigation**: React Navigation with bottom tabs
- **Data Management**: TanStack Query for caching and state management
- **Backend Integration**: RESTful API with Rust backend
- **Testing**: Jest with comprehensive integration tests

## 📱 App Structure

```
MoneyWise App
├── Home        # Dashboard overview
├── Budgets     # Main budget management (primary feature)
├── Transactions# Transaction history (placeholder)
├── Goals       # Financial goals (placeholder)
└── Settings    # App settings (placeholder)
```

The **Budgets** screen is the main feature, providing:
- Time period selection (Monthly/Yearly)
- Budget overview cards (Planned, Spent, Remaining)
- Category breakdown with progress bars
- AI-generated insights and alerts

## 🛠 Quick Start

### Prerequisites
- Node.js 16+
- Expo CLI
- MoneyWise backend running on `localhost:3000`

### Setup
```bash
cd moneywise-app
npm install
npm start
```

Then use the Expo app on your phone or run in iOS/Android simulator.

## 🧪 Testing

The app includes educational integration tests covering:

```bash
# Run all tests
npm test

# Run specific test types
npm test demo           # Basic Jest learning examples
npm test calculations   # Business logic testing
npm test dateUtils      # Utility function testing

# Coverage report
npm run test:coverage
```

**Test Structure:**
- `src/__tests__/` - Main integration tests
- `src/utils/__tests__/` - Utility function tests

See `TESTING_GUIDE.md` for detailed testing documentation.

## 📁 Code Organization

```
src/
├── components/         # Reusable UI components
│   ├── OverviewCard.tsx
│   └── QuickActionButton.tsx
├── hooks/             # Custom React hooks
│   ├── useBudgetData.ts
│   └── useBudgetOverview.ts
├── screens/           # Screen components
│   ├── budget/        # Budget screen components
│   │   ├── BudgetOverviewSection.tsx
│   │   ├── CategoryBudgetsSection.tsx
│   │   ├── BudgetInsightsSection.tsx
│   │   └── TimePeriodSelector.tsx
│   └── [Other screens - basic placeholders]
├── services/          # API and data services
│   ├── budget/        # Budget-specific API client
│   ├── http.ts        # HTTP client configuration
│   └── queryClient.ts # TanStack Query setup
└── utils/             # Utility functions
    └── dateUtils.ts   # Date formatting and manipulation
```

## 🔌 API Integration

The app connects to a Rust backend via REST API:

- **Endpoint**: `http://localhost:3000/api/budgets`
- **Data Format**: JSON with string-based monetary values (avoiding floating-point precision issues)
- **Caching**: TanStack Query provides intelligent caching and background updates
- **Error Handling**: Comprehensive error states with retry functionality

## 🚧 Current Status

**Implemented:**
- ✅ Budget overview and category tracking
- ✅ Time period selection
- ✅ AI insights display
- ✅ Comprehensive test suite
- ✅ Error handling and loading states

**Placeholder Screens:**
- 🚧 Transactions, Goals, Settings (basic UI only)
- 🚧 No CRUD operations (read-only for now)

## 📚 Documentation

- Inline code comments with educational notes throughout

## 🤝 Development Notes

This codebase emphasizes:
- **Clean Architecture**: Modular, well-organized code structure
- **Educational Value**: Extensive comments explaining concepts and patterns
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test coverage with learning examples
- **Best Practices**: Modern React Native and TanStack Query patterns
