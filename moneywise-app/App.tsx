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
 * 🚀 MAIN APP COMPONENT WITH TANSTACK QUERY PROVIDER
 *
 * 📚 EDUCATIONAL NOTE:
 * QueryClientProvider must wrap your entire app to provide TanStack Query
 * functionality to all components. Think of it like a "context provider"
 * that gives every component access to the query client.
 *
 * 🎯 PROVIDER HIERARCHY (Order matters!):
 * 1. SafeAreaProvider - Handles safe areas (notches, etc.)
 * 2. QueryClientProvider - Provides TanStack Query functionality
 * 3. NavigationContainer - Provides React Navigation
 * 4. Tab.Navigator - Your app's navigation structure
 *
 * WHY THIS ORDER?
 * - SafeAreaProvider should be outermost for device compatibility
 * - QueryClientProvider should wrap navigation so all screens can use queries
 * - NavigationContainer provides navigation context to all screens
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* 🔥 TANSTACK QUERY PROVIDER - ENABLES ENTERPRISE-GRADE DATA FETCHING */}
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

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
                  iconName = 'help-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: '#007AFF',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
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
          <StatusBar style="light" />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
