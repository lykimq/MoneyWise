import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    loading?: boolean;
    period?: string;
}

/**
 * BudgetOverviewSection Component
 *
 * Displays high-level budget totals with improved dashboard design:
 * - Planned: Total budgeted amount for the period (main card)
 * - Spent: Total amount already spent (secondary card)
 * - Remaining: Amount left to spend (secondary card)
 *
 * Uses visual hierarchy, progress indicators, and better UX for budget management.
 *
 * @param overview - Object containing planned, spent, and remaining amounts as strings
 * @param loading - Whether to show loading state
 * @param period - Time period description
 */
export const BudgetOverviewSection: React.FC<BudgetOverviewSectionProps> = ({
    overview,
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
    const plannedNum = toNumber(overview.planned);
    const spentNum = toNumber(overview.spent);
    const remainingNum = toNumber(overview.remaining);

    // Calculate progress percentages for visual indicators
    const spentPercentage = plannedNum > 0 ? (spentNum / plannedNum) * 100 : 0;
    const remainingPercentage = plannedNum > 0 ? (remainingNum / plannedNum) * 100 : 0;
    const isOverBudget = remainingNum < 0;

    const formatAmount = (amount: string | number | undefined) => {
        if (amount === undefined) return '$0';
        const numAmount = toNumber(amount);
        return `$${numAmount.toLocaleString()}`; // TODO: Implement proper currency formatting based on user locale and currency settings
    };

    return (
        <View style={sectionStyles.container}>
            {/* SECTION TITLE - Uses shared title styling across all budget sections */}
            <Text style={sectionStyles.title}>Budget Overview</Text>

            <View style={styles.dashboardContainer}>
                {/* Main Card - Planned Budget (Most Important) */}
                <View style={styles.mainCard}>
                    <View style={styles.mainCardHeader}>
                        <View style={styles.mainCardTitleRow}>
                            <Ionicons name="wallet-outline" size={28} color={colors.planned} />
                            <Text style={styles.mainCardTitle}>Planned Budget</Text>
                        </View>
                        <Text style={styles.period}>{period}</Text>
                    </View>

                    <View style={styles.mainCardContent}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.planned} />
                        ) : (
                            <Text style={[styles.mainCardAmount, { color: colors.planned }]}>
                                {formatAmount(overview.planned)}
                            </Text>
                        )}

                        {/* Progress indicator for spending vs planned */}
                        <View style={styles.mainProgressContainer}>
                            <View style={styles.mainProgressBar}>
                                <View
                                    style={[
                                        styles.mainProgressFill,
                                        {
                                            width: `${Math.min(spentPercentage, 100)}%`,
                                            backgroundColor: isOverBudget ? colors.spending : colors.spent
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {plannedNum > 0 ? `${Math.round(spentPercentage)}% spent` : 'No budget planned'} {/* TODO: Add more detailed budget progress text */}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Secondary Cards Row */}
                <View style={styles.secondaryCardsRow}>
                    {/* Spent Card */}
                    <View style={[styles.secondaryCard, isOverBudget ? styles.overBudgetCard : styles.spentCard]}>
                        <View style={styles.secondaryCardHeader}>
                            <Ionicons name="trending-down-outline" size={20} color={isOverBudget ? colors.spending : colors.spent} />
                            <Text style={styles.secondaryCardLabel}>Spent</Text>
                        </View>
                        {loading ? (
                            <ActivityIndicator size="small" color={isOverBudget ? colors.spending : colors.spent} />
                        ) : (
                            <Text style={[styles.secondaryCardAmount, { color: isOverBudget ? colors.spending : colors.spent }]}>
                                {formatAmount(overview.spent)}
                            </Text>
                        )}
                        <View style={styles.budgetIndicator}>
                            <View style={[
                                styles.budgetDot,
                                {
                                    backgroundColor: isOverBudget ? colors.spending : colors.spent
                                }
                            ]} />
                            <Text style={[
                                styles.budgetText,
                                { color: isOverBudget ? colors.spending : colors.spent }
                            ]}>
                                {isOverBudget ? 'Over Budget' : 'On Track'} {/* TODO: Add more sophisticated budget health logic (e.g., warning at 80%, danger at 95%) */}
                            </Text>
                        </View>
                    </View>

                    {/* Remaining Card */}
                    <View style={[styles.secondaryCard, isOverBudget ? styles.overBudgetCard : styles.remainingCard]}>
                        <View style={styles.secondaryCardHeader}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={isOverBudget ? colors.spending : colors.remaining} />
                            <Text style={styles.secondaryCardLabel}>
                                {isOverBudget ? 'Over Budget' : 'Remaining'}
                            </Text>
                        </View>
                        {loading ? (
                            <ActivityIndicator size="small" color={isOverBudget ? colors.spending : colors.remaining} />
                        ) : (
                            <Text style={[styles.secondaryCardAmount, { color: isOverBudget ? colors.spending : colors.remaining }]}>
                                {formatAmount(Math.abs(remainingNum))}
                            </Text>
                        )}
                        <View style={styles.remainingProgress}>
                            <View style={styles.remainingProgressBar}>
                                <View
                                    style={[
                                        styles.remainingProgressFill,
                                        {
                                            width: `${Math.min(Math.abs(remainingPercentage), 100)}%`,
                                            backgroundColor: isOverBudget ? colors.spending : colors.remaining
                                        }
                                    ]}
                                />
                            </View>
                            {/* TODO: Add remaining budget percentage text (e.g., "20% left") */}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

/**
 * Color constants matching the existing app theme with budget-specific colors
 */
const colors = {
    primary: '#007AFF',      // iOS blue
    planned: '#4ECDC4',      // Teal for planned budget
    spent: '#45B7D1',        // Blue for spent amount
    remaining: '#4ECDC4',    // Teal for remaining budget
    spending: '#FF6B6B',     // Red for over budget
    text: '#333',            // Primary text color
    textSecondary: '#666',   // Secondary text color
    background: '#F8F9FA',   // Light gray background
    white: '#FFFFFF',        // White background for cards
} as const;

/**
 * LOCAL STYLES - BudgetOverviewSection Component Styling
 *
 * These styles create the improved dashboard layout for budget overview information.
 * Uses visual hierarchy, progress indicators, and modern card design.
 */
const styles = StyleSheet.create({
    // Main container for the entire dashboard
    dashboardContainer: {
        gap: 15,
    },

    // === MAIN CARD STYLES ===

    // Main card - Planned Budget (most prominent)
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
        // TODO: Add tap interaction for detailed budget breakdown
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
        backgroundColor: colors.planned + '20',
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

    // Special styling for spent card
    spentCard: {
        backgroundColor: '#F0F8FF',
        borderWidth: 1,
        borderColor: colors.spent + '30',
    },

    // Special styling for remaining card
    remainingCard: {
        backgroundColor: '#F8FFFE',
        borderWidth: 1,
        borderColor: colors.remaining + '30',
    },

    // Special styling for over budget state
    overBudgetCard: {
        backgroundColor: '#FFF5F5',
        borderWidth: 1,
        borderColor: colors.spending + '30',
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

    // Budget indicator for spent card
    budgetIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },

    budgetDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    budgetText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Remaining progress for remaining card
    remainingProgress: {
        width: '100%',
    },

    remainingProgressBar: {
        width: '100%',
        height: 4,
        backgroundColor: colors.remaining + '20',
        borderRadius: 2,
        overflow: 'hidden',
    },

    remainingProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
});

