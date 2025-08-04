# MoneyWise App

A React Native financial management application with a Rust backend.

## Features

- **Budget Management**: Track and manage your monthly budgets
- **Category-based Spending**: Organize expenses by categories
- **Real-time Insights**: Get AI-powered budget insights and recommendations
- **Cross-platform**: Works on both iOS and Android
- **Modern UI**: Clean and intuitive user interface

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native development environment
- Expo CLI
- PostgreSQL (for backend)

## Setup

### 1. Install Dependencies

```bash
cd moneywise-app
npm install
```

### 2. Backend Setup

The app requires the Rust backend to be running. See the [backend README](../moneywise-backend/README.md) for setup instructions.

### 3. Configure API Endpoint

The app is configured to connect to `http://localhost:3000` by default. If your backend is running on a different address, update the `API_BASE_URL` in `src/services/api.ts`.

### 4. Run the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── BudgetsScreen.tsx    # Budget management screen
│   ├── GoalsScreen.tsx      # Financial goals screen
│   ├── HomeScreen.tsx       # Dashboard screen
│   ├── SettingsScreen.tsx   # App settings screen
│   └── TransactionsScreen.tsx # Transaction history screen
├── services/           # API and external services
│   └── api.ts         # Backend API integration
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## API Integration

The app communicates with the Rust backend through the `api.ts` service:

- **Budget Data**: Fetches budget overview, categories, and insights
- **Real-time Updates**: Automatically refreshes data when needed
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Shows loading indicators during API calls

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add new screens in `src/screens/`
3. Update API service in `src/services/api.ts` if needed
4. Add TypeScript types in `src/types/`

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure the Rust backend is running on `http://localhost:3000`
   - Check if PostgreSQL is running
   - Verify database migrations have been applied

2. **Build Errors**
   - Clear Metro cache: `npx react-native start --reset-cache`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **API Errors**
   - Check browser console for detailed error messages
   - Verify API endpoint configuration
   - Ensure backend is properly configured
