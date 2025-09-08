import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { BudgetTimePeriod } from '../../hooks/useBudgetData';
import { colors } from '../../styles/theme';
import { sectionStyles } from '../../styles/components';

/**
 * Props for the TimePeriodSelector component
 */
interface TimePeriodSelectorProps {
    availablePeriods: BudgetTimePeriod[];
    selectedPeriod: BudgetTimePeriod;
    onPeriodChange: (period: BudgetTimePeriod) => void;
    isUpdating?: boolean;
}

/**
 * TimePeriodSelector Component
 *
 * Renders a toggle selector for choosing between different time periods (Monthly/Yearly).
 * Shows loading indicator when data is being updated for the selected period.
 *
 * @param availablePeriods - Array of available time periods to choose from
 * @param selectedPeriod - Currently selected time period
 * @param onPeriodChange - Callback function when period selection changes
 * @param isUpdating - Whether data is currently being fetched for the selected period
 */
export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
    availablePeriods,
    selectedPeriod,
    onPeriodChange,
    isUpdating = false,
}) => (
    // MAIN SECTION CONTAINER - Uses shared section styling for consistency
    <View style={sectionStyles.container}>
        {/* TOGGLE CONTAINER - White card containing period selection buttons */}
        <View style={styles.periodToggleContainer}>
            {availablePeriods.map((period) => (
                // PERIOD BUTTON - Individual selectable time period option
                <TouchableOpacity
                    key={period}
                    style={[
                        styles.periodButton,  // Base button styling
                        selectedPeriod === period && styles.periodButtonActive,  // Active state styling
                    ]}
                    onPress={() => onPeriodChange(period)}
                    disabled={isUpdating}  // Disable interaction during data updates
                >
                    {/* PERIOD TEXT - Time period label (Monthly/Yearly) */}
                    <Text
                        style={[
                            styles.periodButtonText,  // Base text styling
                            selectedPeriod === period && styles.periodButtonTextActive,  // Active text styling
                        ]}
                    >
                        {period}
                    </Text>

                    {/* LOADING INDICATOR - Shows when data is being fetched for selected period */}
                    {isUpdating && selectedPeriod === period && (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                            style={styles.spinnerContainer}
                        />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

/**
 * LOCAL STYLES - TimePeriodSelector Component Styling
 *
 * Creates a toggle-style selector with two buttons in a horizontal layout.
 * Uses iOS-style design with active state highlighting and smooth visual transitions.
 * Includes shadow and rounded corners for elevated card appearance.
 */
const styles = StyleSheet.create({
    // TOGGLE CONTAINER - Main container for period selection buttons
    // Creates elevated white card with internal padding for button spacing
    // Uses horizontal layout to arrange buttons side by side
    periodToggleContainer: {
        flexDirection: 'row',    // Horizontal arrangement of toggle buttons
        backgroundColor: colors.background.secondary,  // Pure white background
        borderRadius: 12,        // Rounded corners for modern look
        padding: 4,              // Internal padding creates button spacing

        // SHADOW PROPERTIES - Creates subtle elevation effect
        shadowColor: '#000',     // Black shadow for depth
        shadowOffset: { width: 0, height: 2 },  // Slight downward shadow
        shadowOpacity: 0.1,      // Light shadow (10% opacity)
        shadowRadius: 3.84,      // Soft shadow blur
        elevation: 5,            // Android shadow elevation
    },

    // PERIOD BUTTON - Individual time period selection button
    // Base styling for both active and inactive states
    // Uses flex: 1 to ensure equal width distribution
    periodButton: {
        flex: 1,                 // Equal width distribution (50% each)
        flexDirection: 'row',    // Horizontal layout for text and loading indicator
        paddingVertical: 12,     // Vertical padding for touch target
        paddingHorizontal: 16,   // Horizontal padding for comfortable spacing
        borderRadius: 8,         // Rounded button corners (smaller than container)
        alignItems: 'center',    // Vertical center alignment
        justifyContent: 'center', // Horizontal center alignment
    },

    // ACTIVE BUTTON STATE - Styling for selected time period
    // Blue background to indicate current selection
    periodButtonActive: {
        backgroundColor: colors.primary,  // iOS blue for active state
    },

    // BUTTON TEXT - Base text styling for period labels
    // Medium gray color for inactive buttons
    periodButtonText: {
        fontSize: 14,            // Standard readable text size
        color: colors.text.secondary,           // Medium gray for inactive state
        fontWeight: '500',       // Medium weight for clarity
    },

    // ACTIVE BUTTON TEXT - Text styling for selected period
    // White color and bold weight for selected state
    periodButtonTextActive: {
        color: colors.text.inverse,        // White text on blue background
        fontWeight: 'bold',      // Bold weight for emphasis
    },

    // SPINNER CONTAINER - Container for loading indicator
    // Provides proper spacing between text and spinner
    spinnerContainer: {
        marginLeft: 8,           // Space between text and spinner
    },
});
