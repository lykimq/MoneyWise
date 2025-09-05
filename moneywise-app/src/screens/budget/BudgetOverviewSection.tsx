import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, mainCardStyles, secondaryCardStyles, progressBarStyles, sectionStyles, cardVariants } from '../../styles';

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
        // Main container for the entire Budget Overview section.
        <View style={sectionStyles.container}>
            {/* SECTION TITLE - Displays the title for the budget overview. */}
            <Text style={sectionStyles.title}>Budget Overview</Text>

            {/* DASHBOARD CONTAINER - Holds the main and secondary budget cards. */}
            <View style={{ gap: 15 }}>
                {/* MAIN CARD - Displays the "Planned Budget" as the most prominent information. */}
                <View style={mainCardStyles.card}>
                    {/* Main Card Header - Contains the icon, title, and period. */}
                    <View style={mainCardStyles.header}>
                        {/* Title Row - Groups the wallet icon and "Planned Budget" text. */}
                        <View style={mainCardStyles.titleRow}>
                            <Ionicons name="wallet-outline" size={28} color={colors.remaining} />
                            <Text style={mainCardStyles.title}>Planned Budget</Text>
                        </View>
                        {/* Period Text - Displays the current budget period (e.g., "This Month"). */}
                        <Text style={mainCardStyles.period}>{period}</Text>
                    </View>

                    {/* Main Card Content - Displays the planned amount and spending progress. */}
                    <View style={mainCardStyles.content}>
                        {/* Planned Amount Display - Shows a loading indicator or the formatted planned amount. */}
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.remaining} />
                        ) : (
                            <Text style={[mainCardStyles.amount, { color: colors.remaining }]}>
                                {formatAmount(overview.planned)}
                            </Text>
                        )}

                        {/* Progress Indicator - Visual bar showing spending against the planned budget. */}
                        <View style={mainCardStyles.progressContainer}>
                            <View style={[mainCardStyles.progressBar, { backgroundColor: colors.remaining + '20' }]}>
                                <View
                                    style={[
                                        mainCardStyles.progressFill,
                                        {
                                            // Fills the bar based on spent percentage, capped at 100%.
                                            // Color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                            width: `${Math.min(spentPercentage, 100)}%`,
                                            backgroundColor: isOverBudget ? colors.spending : colors.savings
                                        }
                                    ]}
                                />
                            </View>
                            {/* Progress Text - Shows the percentage of budget spent or a "No budget planned" message. */}
                            <Text style={mainCardStyles.progressText}>
                                {plannedNum > 0 ? `${Math.round(spentPercentage)}% spent` : 'No budget planned'} {/* TODO: Add more detailed budget progress text */}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* SECONDARY CARDS ROW - Contains the "Spent" and "Remaining" budget cards side-by-side. */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    {/* SPENT CARD - Displays the total amount spent. */}
                    <View style={[
                        secondaryCardStyles.card,
                        // Applies 'overBudgetCard' style (red border) if over budget, otherwise 'spentCard' (light blue border).
                        isOverBudget ? cardVariants.overBudget : cardVariants.spent
                    ]}>
                        {/* Secondary Card Header - Contains the icon and "Spent" label. */}
                        <View style={secondaryCardStyles.header}>
                            <Ionicons
                                name="trending-down-outline"
                                size={20}
                                // Icon color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                color={isOverBudget ? colors.spending : colors.savings}
                            />
                            <Text style={secondaryCardStyles.label}>Spent</Text>
                        </View>
                        {/* Spent Amount Display - Shows a loading indicator or the formatted spent amount. */}
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                // Indicator color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                color={isOverBudget ? colors.spending : colors.savings}
                            />
                        ) : (
                            <Text style={[
                                secondaryCardStyles.amount,
                                // Amount text color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                { color: isOverBudget ? colors.spending : colors.savings }
                            ]}>
                                {formatAmount(overview.spent)}
                            </Text>
                        )}
                        {/* Budget Indicator - Shows a colored dot and text indicating budget status. */}
                        <View style={secondaryCardStyles.indicator}>
                            <View style={[
                                secondaryCardStyles.dot,
                                // Dot color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                {
                                    backgroundColor: isOverBudget ? colors.spending : colors.savings
                                }
                            ]} />
                            <Text style={[
                                secondaryCardStyles.text,
                                // Text color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                { color: isOverBudget ? colors.spending : colors.savings }
                            ]}>
                                {isOverBudget ? 'Over Budget' : 'On Track'} {/* TODO: Add more sophisticated budget health logic (e.g., warning at 80%, danger at 95%) */}
                            </Text>
                        </View>
                    </View>

                    {/* REMAINING CARD - Displays the amount left to spend or the overspend amount. */}
                    <View style={[
                        secondaryCardStyles.card,
                        // Applies 'overBudgetCard' style (red border) if over budget, otherwise 'remainingCard' (light green border).
                        isOverBudget ? cardVariants.overBudget : cardVariants.remaining
                    ]}>
                        {/* Secondary Card Header - Contains the icon and "Remaining" or "Over Budget" label. */}
                        <View style={secondaryCardStyles.header}>
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                // Icon color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                color={isOverBudget ? colors.spending : colors.remaining}
                            />
                            <Text style={secondaryCardStyles.label}>
                                {isOverBudget ? 'Over Budget' : 'Remaining'}
                            </Text>
                        </View>
                        {/* Remaining Amount Display - Shows a loading indicator or the formatted remaining amount. */}
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                // Indicator color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                color={isOverBudget ? colors.spending : colors.remaining}
                            />
                        ) : (
                            <Text style={[
                                secondaryCardStyles.amount,
                                // Amount text color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                { color: isOverBudget ? colors.spending : colors.remaining }
                            ]}>
                                {formatAmount(Math.abs(remainingNum))}
                            </Text>
                        )}
                        {/* Remaining Progress - Visual bar showing remaining budget. */}
                        <View style={{ width: '100%' }}>
                            <View style={[progressBarStyles.bar, { backgroundColor: colors.remaining + '20' }]}>
                                <View
                                    style={[
                                        progressBarStyles.fill,
                                        {
                                            // Fills the bar based on remaining percentage, capped at 100%.
                                            // Color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
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
