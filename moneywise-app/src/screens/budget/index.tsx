/**
 * Main budget management screen with time period selection and category breakdown.
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
 * Main budget screen component managing data fetching and UI display.
 */
const BudgetsScreen: React.FC = () => {
  // Time period selection state
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<BudgetTimePeriod>('Monthly');
  const availableTimePeriods: BudgetTimePeriod[] = ['Monthly', 'Yearly'];

  // Fetch budget data with caching and error handling
  const {
    budgetData,
    loading,
    isFetching,
    error,
    refetch,
    hasData,
  } = useBudgetData(selectedTimePeriod);

  /**
   * Handles functionality.
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
  // Displays content.
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
  // Handles functionality.
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
          <Text style={budgetScreenStyles.errorTitle}>{errorMessage}</Text>
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

  
  // Uses theme values.
  // ScrollView enables vertical scrolling through all budget sections.
  return (
    
    <SafeAreaView style={budgetScreenStyles.container}>
      {}
      <ScrollView style={budgetScreenStyles.scrollView}>
        {}
        {/* Allows users to switch between different time periods for budget data. */}
        {/* Shows content. */}
        <TimePeriodSelector
          availablePeriods={availableTimePeriods}
          selectedPeriod={selectedTimePeriod}
          onPeriodChange={setSelectedTimePeriod}
          isUpdating={isFetching} // Displays content.
        />

        {}
        {/* Displays content. */}
        {/* Uses theme values. */}
        <BudgetOverviewSection overview={budgetData!.overview} />

        {}
        {/* Shows individual category cards with icons, progress bars, and
                    spending details. */}
        {/* Each card displays spending progress, remaining budget, and
                    visual indicators. */}
        <CategoryBudgetsSection
          categories={budgetData!.categories}
          getCategoryIcon={getCategoryIconName} // Dynamic icon selection.
        />

        {}
        {/* Displays content. */}
        {/* Only renders if insights are available from the API. */}
        <BudgetInsightsSection insights={budgetData!.insights} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BudgetsScreen;
