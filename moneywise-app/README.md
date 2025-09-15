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
- **Security**: Rate limiting, input validation, and secure HTTP client
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

# Coverage report
npm run test:coverage
```

## 📁 Code Organization

```
src/
├── components/         # Reusable UI components
├── config/            # App configuration
├── hooks/             # Custom React hooks
├── screens/           # Screen components
├── services/          # API and data services
├── styles/            # Styling system
└── utils/             # Utility functions
```

## 🔌 API Integration

The app connects to a Rust backend via REST API:

- **Endpoint**: `http://localhost:3000/api/budgets`
- **Data Format**: JSON with string-based monetary values (avoiding floating-point precision issues)
- **Caching**: TanStack Query provides intelligent caching and background updates
- **Error Handling**: Comprehensive error states with retry functionality

## 🔒 Security Features

The app implements multiple layers of security to protect user data and prevent common attacks:

- **Rate Limiting**: Client-side throttling to prevent API abuse and improve performance
- **Input Validation**: URL sanitization and endpoint validation to prevent injection attacks
- **Secure HTTP Client**: Timeout protection, retry logic with exponential backoff, and proper error handling
- **Environment Validation**: Configuration validation ensures secure API connections

## 🚧 Current Status

**Implemented:**
- ✅ Budget overview and category tracking
- ✅ Time period selection
- ✅ AI insights display
- ✅ Comprehensive test suite
- ✅ Error handling and loading states
- ✅ Security features (rate limiting, input validation)

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
