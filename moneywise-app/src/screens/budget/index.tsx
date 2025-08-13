/**
 * BudgetsScreen Component - MoneyWise Budget Management
 *
 * Main screen for comprehensive budget management featuring:
 * - Time period selection (Monthly/Yearly)
 * - Budget overview with spending totals
 * - Category-wise budget breakdown with progress tracking
 * - AI-generated insights and recommendations
 *
 * Architecture:
 * - Uses TanStack Query for efficient data management and caching
 * - Modular component structure for maintainability
 * - Comprehensive error handling and loading states
 * - Responsive design with consistent styling
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBudgetData, BudgetTimePeriod } from '../../hooks/useBudgetData';
import { TimePeriodSelector } from './TimePeriodSelector';
import { BudgetOverviewSection } from './BudgetOverviewSection';
import { CategoryBudgetsSection } from './CategoryBudgetsSection';
import { BudgetInsightsSection } from './BudgetInsightsSection';
import { getCategoryIconName } from './utils';
import { screenStyles, buttonStyles } from './styles';

/**
 * Main Budget Screen Component
 *
 * Manages the complete budget interface with data fetching, error handling,
 * and organized display of budget information across multiple sections.
 */
const BudgetsScreen: React.FC = () => {
    // UI State Management
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<BudgetTimePeriod>('Monthly');
    const availableTimePeriods: BudgetTimePeriod[] = ['Monthly', 'Yearly'];

    // Data Fetching with TanStack Query
    // Provides automatic caching, background updates, error handling, and retry logic
    const {
        budgetData,
        isLoading,
        isFetching, // Background updates
        error,
        refetch,
        hasData,
    } = useBudgetData(selectedTimePeriod);

    /**
     * Handle retry action for failed data fetching.
     * Uses TanStack Query's built-in refetch with user-friendly error messaging.
     */
    const handleRetryDataFetch = async () => {
        try {
            await refetch();
        } catch (err) {
            // TanStack Query handles most errors automatically,
            // but we show user-friendly messages for critical failures
            Alert.alert(
                'Connection Error',
                'Unable to fetch budget data. Please check your internet connection and try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // Loading State Component
    // Shows loading spinner during initial data fetch
    if (isLoading) {
        return (
            <SafeAreaView style={screenStyles.mainContainer}>
                <View style={screenStyles.centeredMessageContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={screenStyles.loadingText}>Loading budget data...</Text>
                    {isFetching && (
                        <Text style={screenStyles.subText}>Fetching latest updates...</Text>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    // Error State Component
    // Handles network errors and empty data states with user-friendly messaging
    if (error || !hasData) {
        const errorMessage = error?.message || 'Failed to load budget data';

        return (
            <SafeAreaView style={screenStyles.mainContainer}>
                <View style={screenStyles.centeredMessageContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
                    <Text style={screenStyles.errorText}>{errorMessage}</Text>
                    <TouchableOpacity
                        style={buttonStyles.retryButton}
                        onPress={handleRetryDataFetch}
                    >
                        <Text style={buttonStyles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Main Screen Content
    // Organized into logical sections: time selector, overview, categories, and insights
    return (
        <SafeAreaView style={screenStyles.mainContainer}>
            <ScrollView style={screenStyles.scrollContainer}>
                {/* Time Period Selector Section */}
                <TimePeriodSelector
                    availablePeriods={availableTimePeriods}
                    selectedPeriod={selectedTimePeriod}
                    onPeriodChange={setSelectedTimePeriod}
                    isUpdating={isFetching}
                />

                {/* Budget Overview Section */}
                <BudgetOverviewSection overview={budgetData!.overview} />

                {/* Category Budgets Section */}
                <CategoryBudgetsSection
                    categories={budgetData!.categories}
                    getCategoryIcon={getCategoryIconName}
                />

                {/* Budget Insights Section */}
                <BudgetInsightsSection insights={budgetData!.insights} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default BudgetsScreen;
