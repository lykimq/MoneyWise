import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { sectionStyles } from './styles';

/**
 * Props for the BudgetOverviewSection component
 */
interface BudgetOverviewSectionProps {
    overview: {
        planned: string;
        spent: string;
        remaining: string;
    };
}

/**
 * BudgetOverviewSection Component
 *
 * Displays high-level budget totals with three main metrics:
 * - Planned: Total budgeted amount for the period
 * - Spent: Total amount already spent
 * - Remaining: Amount left to spend (or overspent amount)
 *
 * Uses color-coded indicators to help users quickly assess budget health.
 * Shows "Over Budget" label and red color when spending exceeds planned amount.
 *
 * @param overview - Object containing planned, spent, and remaining amounts as strings
 */
export const BudgetOverviewSection: React.FC<BudgetOverviewSectionProps> = ({ overview }) => {
    // Budget calculation logic - determines if user is over their planned budget
    const remainingAmount = Number(overview.remaining);
    const isOverBudget = remainingAmount < 0;

    return (
        // MAIN SECTION CONTAINER - Uses shared section styling for consistency
        <View style={sectionStyles.container}>
            {/* SECTION TITLE - Uses shared title styling across all budget sections */}
            <Text style={sectionStyles.title}>Budget Overview</Text>

            {/* CARD CONTAINER - Horizontal layout for three budget summary cards */}
            <View style={styles.cardContainer}>

                {/* PLANNED BUDGET CARD - Shows total budgeted amount for the period */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Planned</Text>
                    <Text style={styles.cardAmount}>
                        ${Number(overview.planned).toLocaleString()}
                    </Text>
                </View>

                {/* SPENT BUDGET CARD - Shows total amount already spent */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Spent</Text>
                    <Text style={styles.cardAmount}>
                        ${Number(overview.spent).toLocaleString()}
                    </Text>
                </View>

                {/* REMAINING/OVER BUDGET CARD - Dynamic label and color based on budget status */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>
                        {isOverBudget ? 'Over Budget' : 'Remaining'}
                    </Text>
                    {/* AMOUNT TEXT - Red for over budget, blue for remaining budget */}
                    <Text style={[
                        styles.cardAmount,
                        { color: isOverBudget ? '#FF6B6B' : '#007AFF' }
                    ]}>
                        ${Math.abs(remainingAmount).toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
};

/**
 * LOCAL STYLES - BudgetOverviewSection Component Styling
 *
 * These styles create a clean, card-based layout for budget overview information.
 * Uses consistent spacing, shadows, and typography for professional appearance.
 */
const styles = StyleSheet.create({
    // CARD CONTAINER - Horizontal layout for three budget cards
    // Uses flexDirection: 'row' to arrange cards side by side
    // Gap provides consistent spacing between cards
    cardContainer: {
        flexDirection: 'row',    // Horizontal arrangement of cards
        gap: 10,                 // 10px spacing between each card
    },

    // SUMMARY CARD - Individual budget metric card styling
    // Creates elevated white cards with rounded corners and shadow
    // Uses flex: 1 to ensure equal width distribution across three cards
    summaryCard: {
        flex: 1,                 // Equal width distribution (33.33% each)
        backgroundColor: '#FFFFFF',  // Pure white background
        padding: 15,             // Internal spacing for content
        borderRadius: 12,        // Rounded corners for modern look
        alignItems: 'center',    // Center-align all content horizontally

        // SHADOW PROPERTIES - Creates subtle elevation effect
        shadowColor: '#000',     // Black shadow for depth
        shadowOffset: { width: 0, height: 2 },  // Slight downward shadow
        shadowOpacity: 0.1,      // Light shadow (10% opacity)
        shadowRadius: 3.84,      // Soft shadow blur
        elevation: 5,            // Android shadow elevation
    },

    // CARD LABEL - Small descriptive text above the amount
    // Uses muted gray color and small font for secondary information
    cardLabel: {
        fontSize: 12,            // Small text for labels
        color: '#666',           // Medium gray for subtle appearance
        marginBottom: 5,         // Space between label and amount
        textAlign: 'center',     // Center-align text within card
    },

    // CARD AMOUNT - Primary budget amount display
    // Large, bold text with blue color (overridden for over-budget state)
    cardAmount: {
        fontSize: 18,            // Large text for emphasis
        fontWeight: 'bold',      // Bold weight for importance
        color: '#007AFF',        // iOS blue (default, overridden dynamically)
        textAlign: 'center',     // Center-align within card
    },
});
