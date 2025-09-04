import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * FinancialDashboardCard Component
 *
 * Purpose: A single large card that displays all three key financial metrics
 * in a visually appealing dashboard format with icons, progress indicators,
 * and clear visual hierarchy.
 *
 * Design Philosophy:
 * - Single prominent card that's impossible to miss
 * - All three metrics visible at once for complete picture
 * - Visual elements (icons, progress bars) for better engagement
 * - Clear visual hierarchy with most important info prominent
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
    const remainingPercentage = totalBudgetAmount > 0 ? (remainingNum / totalBudgetAmount) * 100 : 0;
    const savingsPercentage = Math.min(100, (savingsNum / 1000) * 100); // TODO: Replace hardcoded $1000 with actual savings goal/target from API

    const formatAmount = (amount: string | number | undefined) => {
        if (amount === undefined) return '$0';
        const numAmount = toNumber(amount);
        return `$${numAmount.toLocaleString()}`; // TODO: Implement proper currency formatting based on user locale and currency settings
    };


    return (
        <View style={styles.dashboardContainer}>
            {/* Main Card - Total Spent (Most Important) */}
            <View style={styles.mainCard}>
                <View style={styles.mainCardHeader}>
                    <View style={styles.mainCardTitleRow}>
                        <Ionicons name="trending-down-outline" size={28} color={colors.spending} />
                        <Text style={styles.mainCardTitle}>Total Spent</Text>
                    </View>
                    <Text style={styles.period}>{period}</Text>
                </View>

                <View style={styles.mainCardContent}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.spending} />
                    ) : (
                        <Text style={[styles.mainCardAmount, { color: colors.spending }]}>
                            {formatAmount(spent)}
                        </Text>
                    )}

                    {/* Progress indicator for total spent */}
                    <View style={styles.mainProgressContainer}>
                        <View style={styles.mainProgressBar}>
                            <View
                                style={[
                                    styles.mainProgressFill,
                                    {
                                        width: `${Math.min(spentPercentage, 100)}%`,
                                        backgroundColor: colors.spending
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {totalBudgetAmount > 0 ? `${Math.round(spentPercentage)}% of budget` : 'No budget set'} {/* TODO: Add totalBudget field to BudgetOverviewApi for accurate progress calculations */}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Secondary Cards Row */}
            <View style={styles.secondaryCardsRow}>
                {/* Remaining Card */}
                <View style={[styles.secondaryCard, styles.remainingCard]}>
                    <View style={styles.secondaryCardHeader}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.remaining} />
                        <Text style={styles.secondaryCardLabel}>Remaining</Text>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.remaining} />
                    ) : (
                        <Text style={[styles.secondaryCardAmount, { color: colors.remaining }]}>
                            {formatAmount(remaining)}
                        </Text>
                    )}
                    <View style={styles.healthIndicator}>
                        <View style={[
                            styles.healthDot,
                            {
                                backgroundColor: remainingNum > 0 ? colors.remaining : colors.spending
                            }
                        ]} />
                        <Text style={[
                            styles.healthText,
                            { color: remainingNum > 0 ? colors.remaining : colors.spending }
                        ]}>
                            {remainingNum > 0 ? 'On Track' : 'Over Budget'} {/* TODO: Add more sophisticated budget health logic (e.g., warning at 80%, danger at 95%) */}
                        </Text>
                    </View>
                </View>

                {/* Savings Card */}
                <View style={styles.secondaryCard}>
                    <View style={styles.secondaryCardHeader}>
                        <Ionicons name="trending-up-outline" size={20} color={colors.savings} />
                        <Text style={styles.secondaryCardLabel}>Savings</Text>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.savings} />
                    ) : (
                        <Text style={[styles.secondaryCardAmount, { color: colors.savings }]}>
                            {formatAmount(savings)}
                        </Text>
                    )}
                    <View style={styles.savingsProgress}>
                        <View style={styles.savingsProgressBar}>
                            <View
                                style={[
                                    styles.savingsProgressFill,
                                    {
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
    healthIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },

    healthDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    healthText: {
        fontSize: 12,
        fontWeight: '600',
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
