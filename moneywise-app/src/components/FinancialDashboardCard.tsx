import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * FinancialDashboardCard Component
 *
 * Purpose: A single large card that displays three key financial metrics (Spent, Remaining, Savings)
 * in a visually appealing dashboard format. It uses icons, progress indicators, and clear visual
 * hierarchy to provide an immediate financial overview.
 *
 * Used By: `moneywise-app/src/screens/HomeScreen.tsx` to present a summary of the user's financial status.
 *
 * Design Philosophy:
 * - **Prominence:** Designed as a single, impossible-to-miss card to immediately draw user attention.
 * - **Completeness:** All three critical metrics are visible at once, offering a holistic financial picture.
 * - **Engagement:** Incorporates visual elements like icons and progress bars to enhance user engagement and understanding.
 * - **Hierarchy:** Employs clear visual hierarchy to ensure the most important information (Total Spent) is prominent.
 * - **Reusability:** While currently used in `HomeScreen`, its design allows for potential reuse in other dashboard-like contexts.
 */

interface FinancialDashboardCardProps {
    spent: string | number | undefined;
    remaining: string | number | undefined;
    savings: string | number | undefined;
    totalBudget?: string | number; // Optional total budget for progress calculations
    loading?: boolean;
    period?: string;
}

const FinancialDashboardCard: React.FC<FinancialDashboardCardProps> = ({
    spent = 0,
    remaining = 0,
    savings = 0,
    totalBudget,
    loading = false,
    period = "This Month"
}) => {
    // Helper function to convert string/number to number for calculations
    const toNumber = (value: string | number | undefined): number => {
        if (value === undefined) return 0;
        if (typeof value === 'string') {
            // Remove currency symbols and parse as float
            const cleaned = value.replace(/[$,]/g, '');
            return parseFloat(cleaned) || 0;
        }
        return value;
    };

    // Convert all values to numbers for calculations
    const spentNum = toNumber(spent);
    const remainingNum = toNumber(remaining);
    const savingsNum = toNumber(savings);
    const totalBudgetNum = toNumber(totalBudget);

    // Calculate progress percentages for visual indicators
    const totalBudgetAmount = totalBudgetNum || (spentNum + remainingNum);
    const spentPercentage = totalBudgetAmount > 0 ? (spentNum / totalBudgetAmount) * 100 : 0;
    // `remainingPercentage` represents the percentage of the total budget that is still available (or overspent).
    // If `remainingNum` is positive, it shows the percentage of the budget left.
    // If `remainingNum` is negative (over budget), it shows the absolute percentage of overspend relative to the total budget.
    const remainingPercentage = totalBudgetAmount > 0 ? (remainingNum / totalBudgetAmount) * 100 : 0;
    const savingsPercentage = Math.min(100, (savingsNum / 1000) * 100); // TODO: Replace hardcoded $1000 with actual savings goal/target from API. This should come from user settings or API.

    const formatAmount = (amount: string | number | undefined) => {
        if (amount === undefined) return '$0';
        const numAmount = toNumber(amount);
        return `$${numAmount.toLocaleString()}`; // TODO: Implement proper currency formatting based on user locale and currency settings. The '$' symbol is currently hardcoded.
    };


    return (
        // Main container for the entire financial dashboard card.
        // Provides overall layout, margins, and spacing for the cards within.
        <View style={styles.dashboardContainer}>
            {/* Main Card - Displays "Total Spent" as the most important metric. */}
            <View style={styles.mainCard}>
                {/* Main Card Header - Contains the icon, title, and period. */}
                <View style={styles.mainCardHeader}>
                    {/* Title Row - Groups the spending icon and "Total Spent" text. */}
                    <View style={styles.mainCardTitleRow}>
                        <Ionicons name="trending-down-outline" size={28} color={colors.spending} />
                        <Text style={styles.mainCardTitle}>Total Spent</Text>
                    </View>
                    {/* Period Text - Displays the current financial period (e.g., "This Month"). */}
                    <Text style={styles.period}>{period}</Text>
                </View>

                {/* Main Card Content - Displays the total spent amount and its progress. */}
                <View style={styles.mainCardContent}>
                    {/* Spent Amount Display - Shows a loading indicator or the formatted spent amount. */}
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.spending} />
                    ) : (
                        <Text style={[styles.mainCardAmount, { color: colors.spending }]}>
                            {formatAmount(spent)}
                        </Text>
                    )}

                    {/* Progress Indicator - Visual bar showing total spent against the budget. */}
                    <View style={styles.mainProgressContainer}>
                        <View style={styles.mainProgressBar}>
                            <View
                                style={[
                                    styles.mainProgressFill,
                                    {
                                        // Fills the bar based on spent percentage, capped at 100%.
                                        width: `${Math.min(spentPercentage, 100)}%`,
                                        backgroundColor: colors.spending
                                    }
                                ]}
                            />
                        </View>
                        {/* Progress Text - Shows the percentage of budget spent or a "No budget set" message. */}
                        <Text style={styles.progressText}>
                            {totalBudgetAmount > 0 ? `${Math.round(spentPercentage)}% of budget` : 'No budget set'} {/* TODO: Add totalBudget field to BudgetOverviewApi for accurate progress calculations */}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Secondary Cards Row - Contains the "Remaining" and "Savings" cards side-by-side. */}
            <View style={styles.secondaryCardsRow}>
                {/* REMAINING CARD - Displays the amount left to spend. */}
                <View style={[styles.secondaryCard, styles.remainingCard]}>
                    {/* Secondary Card Header - Contains the icon and "Remaining" label. */}
                    <View style={styles.secondaryCardHeader}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.remaining} />
                        <Text style={styles.secondaryCardLabel}>Remaining</Text>
                    </View>
                    {/* Remaining Amount Display - Shows a loading indicator or the formatted remaining amount. */}
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.remaining} />
                    ) : (
                        <Text style={[styles.secondaryCardAmount, { color: colors.remaining }]}>
                            {formatAmount(remaining)}
                        </Text>
                    )}
                    {/* Progress Indicator for Remaining - Visual bar showing the percentage of the total budget that is still available. */}
                    {/* If over budget, the bar will show the absolute percentage of overspend and be colored red. */}
                    <View style={styles.remainingProgressContainer}>
                        <View style={styles.remainingProgressBar}>
                            <View
                                style={[
                                    styles.remainingProgressFill,
                                    {
                                        // Fills the bar based on remaining percentage, capped at 100%.
                                        // Color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                        width: `${Math.min(Math.abs(remainingPercentage), 100)}%`, // Use Math.abs for visual representation of overspend
                                        backgroundColor: remainingNum > 0 ? colors.remaining : colors.spending
                                    }
                                ]}
                            />
                        </View>
                        {/* Progress Text - Shows the percentage of remaining budget or overspend. */}
                        <Text style={styles.progressText}>
                            {totalBudgetAmount > 0
                                ? `${Math.round(Math.abs(remainingPercentage))}% ${remainingNum > 0 ? 'remaining' : 'over budget'}`
                                : 'No budget set'}
                        </Text>
                    </View>
                </View>

                {/* SAVINGS CARD - Displays the total amount saved. */}
                <View style={styles.secondaryCard}>
                    {/* Secondary Card Header - Contains the icon and "Savings" label. */}
                    <View style={styles.secondaryCardHeader}>
                        <Ionicons name="trending-up-outline" size={20} color={colors.savings} />
                        <Text style={styles.secondaryCardLabel}>Savings</Text>
                    </View>
                    {/* Savings Amount Display - Shows a loading indicator or the formatted savings amount. */}
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.savings} />
                    ) : (
                        <Text style={[styles.secondaryCardAmount, { color: colors.savings }]}>
                            {formatAmount(savings)}
                        </Text>
                    )}
                    {/* Savings Progress - Visual bar showing progress towards a savings goal. */}
                    <View style={styles.savingsProgress}>
                        <View style={styles.savingsProgressBar}>
                            <View
                                style={[
                                    styles.savingsProgressFill,
                                    {
                                        // Fills the bar based on savings percentage, capped at 100%.
                                        width: `${Math.min(savingsPercentage, 100)}%`,
                                        backgroundColor: colors.savings
                                    }
                                ]}
                            />
                        </View>
                        {/* TODO: Add savings goal text (e.g., "$400 of $1000 goal") */}
                    </View>
                </View>
            </View>
        </View>
    );
};

/**
 * Color constants matching the existing app theme
 */
const colors = {
    primary: '#007AFF',      // iOS blue
    spending: '#FF6B6B',     // Red for expenses
    remaining: '#4ECDC4',    // Teal for remaining budget
    savings: '#45B7D1',      // Blue for savings
    text: '#333',            // Primary text color
    textSecondary: '#666',   // Secondary text color
    background: '#F8F9FA',   // Light gray background
    white: '#FFFFFF',        // White background for cards
} as const;

const styles = StyleSheet.create({
    // Main container for the entire dashboard
    dashboardContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
        gap: 15,
    },

    // === MAIN CARD STYLES ===

    // Main card - Total Spent (most prominent)
    mainCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 24,

        // Enhanced shadow for prominence
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
        // TODO: Add tap interaction for detailed breakdown
    },

    mainCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    mainCardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    mainCardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },

    period: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },

    mainCardContent: {
        alignItems: 'center',
    },

    mainCardAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    mainProgressContainer: {
        width: '100%',
        alignItems: 'center',
    },

    mainProgressBar: {
        width: '100%',
        height: 8,
        backgroundColor: colors.spending + '20',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },

    mainProgressFill: {
        height: '100%',
        borderRadius: 4,
    },

    progressText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },

    // === SECONDARY CARDS STYLES ===

    // Row containing the two smaller cards
    secondaryCardsRow: {
        flexDirection: 'row',
        gap: 12,
    },

    // Individual secondary card
    secondaryCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,

        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        // TODO: Add tap interaction for detailed view
    },

    // Special styling for remaining card
    remainingCard: {
        backgroundColor: '#F8FFFE',
        borderWidth: 1,
        borderColor: colors.remaining + '30',
    },

    secondaryCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },

    secondaryCardLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600',
    },

    secondaryCardAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },

    // Health indicator for remaining card
    // Remaining progress container for remaining card
    remainingProgressContainer: {
        width: '100%',
        alignItems: 'center',
    },

    remainingProgressBar: {
        width: '100%',
        height: 8,
        backgroundColor: colors.remaining + '20',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },

    remainingProgressFill: {
        height: '100%',
        borderRadius: 4,
    },

    // Savings progress for savings card
    savingsProgress: {
        width: '100%',
    },

    savingsProgressBar: {
        width: '100%',
        height: 4,
        backgroundColor: colors.savings + '20',
        borderRadius: 2,
        overflow: 'hidden',
    },

    savingsProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
});

export default FinancialDashboardCard;
