# MoneyWise App

A comprehensive personal finance management app built with React Native and Expo.

## Features

### 🏠 Home Dashboard
- Spending overview with total spent, remaining, and savings
- Quick actions for common tasks
- Spending by category visualization
- Recent transactions list
- Upcoming bills reminders

### 📊 Budget Management
- Time period toggles (Monthly, Yearly, Custom)
- Budget overview with planned, spent, and remaining amounts
- Category budgets with progress bars
- Budget insights and recommendations

### 📝 Transactions
- Searchable and filterable transaction list
- Add, edit, and delete transactions
- Transaction categorization
- Income vs expense tracking
- Summary with total income, expenses, and net

### 🎯 Savings Goals
- Goals overview with total, saved, and remaining amounts
- Active goals with progress tracking
- Goal insights and recommendations
- Add new savings goals

### ⚙️ Settings
- General settings (language, currency, dark mode, notifications)
- Budget settings (period, rollover, alerts)
- Data management (backup, restore, export)
- About & support
- Danger zone for data clearing

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **React Navigation** - Navigation between screens
- **Expo Vector Icons** - Icon library
- **TypeScript** - Type safety and better development experience

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moneywise-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web
npm run web
```

## Project Structure

```
moneywise-app/
├── src/
│   ├── screens/          # Main screen components
│   │   ├── HomeScreen.tsx
│   │   ├── BudgetsScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── GoalsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/       # Reusable components
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── assets/              # Images and static assets
├── App.tsx              # Main app component
└── package.json         # Dependencies and scripts
```

## Navigation Structure

The app uses bottom tab navigation with 5 main screens:

1. **Home** - Dashboard with overview and quick actions
2. **Budgets** - Budget management and tracking
3. **Transactions** - Transaction list and management
4. **Goals** - Savings goals and progress
5. **Settings** - App configuration and preferences

## Development

### Adding New Features

1. Create new screen components in `src/screens/`
2. Add navigation routes in `App.tsx`
3. Create reusable components in `src/components/`
4. Add TypeScript types in `src/types/`

### Styling

The app uses a consistent design system with:
- Primary color: `#007AFF` (iOS blue)
- Background: `#F8F9FA` (light gray)
- Cards: `#FFFFFF` with shadows
- Text colors: `#333` (dark), `#666` (medium), `#999` (light)

### Icons

The app uses Expo Vector Icons (Ionicons) for consistent iconography across all screens.
