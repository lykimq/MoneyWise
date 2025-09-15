import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/services/queryClient';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import BudgetsScreen from './src/screens/BudgetsScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
const Tab = createBottomTabNavigator();

/**
 * Main application component that sets up the core providers and navigation structure.
 *
 * Provider hierarchy is critical for proper functionality:
 * - SafeAreaProvider: Handles device-specific safe areas (notches, status bars)
 * - QueryClientProvider: Enables data fetching and caching across all screens
 * - NavigationContainer: Provides React Navigation context
 * - Tab.Navigator: Defines the bottom tab navigation structure
 *
 * This order ensures all screens have access to both navigation and data fetching
 * capabilities while maintaining proper device compatibility.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              // Dynamic icon mapping based on route name and focus state
              // Uses filled icons when focused, outline icons when inactive
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                // Map each route to appropriate Ionicons with focus state variants
                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Budgets') {
                  iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                } else if (route.name === 'Transactions') {
                  iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Goals') {
                  iconName = focused ? 'flag' : 'flag-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else {
                  // Fallback icon for unknown routes
                  iconName = 'help-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              // Tab bar styling: iOS blue for active tabs, gray for inactive
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              // Header styling: iOS blue background with white text
              headerStyle: {
                backgroundColor: '#007AFF',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            {/* Define the five main app screens with their navigation options */}
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'MoneyWise' }}
            />
            <Tab.Screen
              name="Budgets"
              component={BudgetsScreen}
              options={{ title: 'Budgets' }}
            />
            <Tab.Screen
              name="Transactions"
              component={TransactionsScreen}
              options={{ title: 'Transactions' }}
            />
            <Tab.Screen
              name="Goals"
              component={GoalsScreen}
              options={{ title: 'Goals' }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Tab.Navigator>
          {/* Status bar with light content to contrast with blue header */}
          <StatusBar style="light" />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
