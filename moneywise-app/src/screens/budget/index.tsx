/**
 * BudgetsScreen Component - MoneyWise Budget Management
 *
 * This is the main screen for comprehensive budget management, featuring:
 * - Time period selection (Monthly/Yearly).
 * - A budget overview with spending totals.
 * - A category-wise budget breakdown with progress tracking.
 * - AI-generated insights and recommendations.
 *
 * Architecture:
 * - Uses TanStack Query for efficient data management and caching.
 * - Employs a modular component structure for maintainability.
 * - Includes comprehensive error handling and loading states.
 * - Designed for responsiveness with consistent styling.
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
import { getCategoryIconName } from '../../utils/categoryUtils';
import { colors, sectionStyles, buttonStyles } from '../../styles';
import { budgetScreenStyles } from '../../styles/screens/budgetScreenStyles';

/**
 * Main Budget Screen Component
 *
 * Manages the complete budget interface, including data fetching, error
 * handling, and the organized display of budget information across multiple
 * sections.
 */
const BudgetsScreen: React.FC = () => {
    // UI State Management for the selected time period.
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<BudgetTimePeriod>('Monthly');
    const availableTimePeriods: BudgetTimePeriod[] = ['Monthly', 'Yearly'];

    // Data Fetching with TanStack Query.
    // Provides automatic caching, background updates, error handling, and retry logic.
    const {
        budgetData,
        loading,
        isFetching, // Indicates background data updates.
        error,
        refetch,
        hasData,
    } = useBudgetData(selectedTimePeriod);

    /**
     * Handles the retry action for failed data fetching.
     * Uses TanStack Query's built-in refetch mechanism with user-friendly
     * error messaging.
     */
    const handleRetryDataFetch = async () => {
        try {
            await refetch();
        } catch (err) {
            // TanStack Query handles most errors automatically, but we display
            // user-friendly messages for critical failures.
            Alert.alert(
                'Connection Error',
                'Unable to fetch budget data. Please check your internet ' +
                'connection and try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // Loading State Component
    // Displays a loading spinner during the initial data fetch.
    if (loading) {
        return (
            <SafeAreaView style={budgetScreenStyles.container}>
                <View style={budgetScreenStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={budgetScreenStyles.loadingText}>
                        Loading budget data...
                    </Text>
                    {isFetching && (
                        <Text style={budgetScreenStyles.loadingSubtext}>
                            Fetching latest updates...
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    // Error State Component
    // Handles network errors and empty data states with user-friendly messaging.
    if (error || !hasData) {
        const errorMessage = error?.message || 'Failed to load budget data.';

        return (
            <SafeAreaView style={budgetScreenStyles.container}>
                <View style={budgetScreenStyles.errorContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={48}
                        color={colors.spending}
                        style={budgetScreenStyles.errorIcon}
                    />
                    <Text style={budgetScreenStyles.errorTitle}>
                        {errorMessage}
                    </Text>
                    <TouchableOpacity
                        style={buttonStyles.primary}
                        onPress={handleRetryDataFetch}
                    >
                        <Text style={buttonStyles.primaryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // MAIN SCREEN CONTENT - Complete budget interface with organized sections.
    // Uses SafeAreaView for proper spacing on devices with notches/home indicators.
    // ScrollView enables vertical scrolling through all budget sections.
    return (
        // SAFE AREA CONTAINER - Ensures content respects device safe areas.
        <SafeAreaView style={budgetScreenStyles.container}>
            {/* SCROLL CONTAINER - Provides vertical scrolling for all budget content. */}
            <ScrollView style={budgetScreenStyles.scrollView}>

                {/* TIME PERIOD SELECTOR SECTION - Monthly/Yearly toggle at the top. */}
                {/* Allows users to switch between different time periods for budget data. */}
                {/* Shows a loading indicator when fetching new data. */}
                <TimePeriodSelector
                    availablePeriods={availableTimePeriods}
                    selectedPeriod={selectedTimePeriod}
                    onPeriodChange={setSelectedTimePeriod}
                    isUpdating={isFetching}  // Displays spinner during data updates.
                />

                {/* BUDGET OVERVIEW SECTION - High-level budget summary cards. */}
                {/* Displays planned, spent, and remaining amounts in a card format. */}
                {/* Uses color coding to indicate over-budget status. */}
                <BudgetOverviewSection overview={budgetData!.overview} />

                {/* CATEGORY BUDGETS SECTION - Detailed category-wise breakdown. */}
                {/* Shows individual category cards with icons, progress bars, and
                    spending details. */}
                {/* Each card displays spending progress, remaining budget, and
                    visual indicators. */}
                <CategoryBudgetsSection
                    categories={budgetData!.categories}
                    getCategoryIcon={getCategoryIconName}  // Dynamic icon selection.
                />

                {/* BUDGET INSIGHTS SECTION - AI-generated recommendations. */}
                {/* Displays smart insights and suggestions based on spending patterns. */}
                {/* Only renders if insights are available from the API. */}
                <BudgetInsightsSection insights={budgetData!.insights} />

            </ScrollView>
        </SafeAreaView>
    );
};

export default BudgetsScreen;
