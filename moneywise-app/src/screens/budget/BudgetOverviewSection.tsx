import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sectionStyles, budgetOverviewColors, budgetOverviewSectionStyles } from './styles/index';

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
            <View style={budgetOverviewSectionStyles.dashboardContainer}>
                {/* MAIN CARD - Displays the "Planned Budget" as the most prominent information. */}
                <View style={budgetOverviewSectionStyles.mainCard}>
                    {/* Main Card Header - Contains the icon, title, and period. */}
                    <View style={budgetOverviewSectionStyles.mainCardHeader}>
                        {/* Title Row - Groups the wallet icon and "Planned Budget" text. */}
                        <View style={budgetOverviewSectionStyles.mainCardTitleRow}>
                            <Ionicons name="wallet-outline" size={28} color={budgetOverviewColors.planned} />
                            <Text style={budgetOverviewSectionStyles.mainCardTitle}>Planned Budget</Text>
                        </View>
                        {/* Period Text - Displays the current budget period (e.g., "This Month"). */}
                        <Text style={budgetOverviewSectionStyles.period}>{period}</Text>
                    </View>

                    {/* Main Card Content - Displays the planned amount and spending progress. */}
                    <View style={budgetOverviewSectionStyles.mainCardContent}>
                        {/* Planned Amount Display - Shows a loading indicator or the formatted planned amount. */}
                        {loading ? (
                            <ActivityIndicator size="large" color={budgetOverviewColors.planned} />
                        ) : (
                            <Text style={[budgetOverviewSectionStyles.mainCardAmount, { color: budgetOverviewColors.planned }]}>
                                {formatAmount(overview.planned)}
                            </Text>
                        )}

                        {/* Progress Indicator - Visual bar showing spending against the planned budget. */}
                        <View style={budgetOverviewSectionStyles.mainProgressContainer}>
                            <View style={budgetOverviewSectionStyles.mainProgressBar}>
                                <View
                                    style={[
                                        budgetOverviewSectionStyles.mainProgressFill,
                                        {
                                            // Fills the bar based on spent percentage, capped at 100%.
                                            // Color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                            width: `${Math.min(spentPercentage, 100)}%`,
                                            backgroundColor: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent
                                        }
                                    ]}
                                />
                            </View>
                            {/* Progress Text - Shows the percentage of budget spent or a "No budget planned" message. */}
                            <Text style={budgetOverviewSectionStyles.progressText}>
                                {plannedNum > 0 ? `${Math.round(spentPercentage)}% spent` : 'No budget planned'} {/* TODO: Add more detailed budget progress text */}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* SECONDARY CARDS ROW - Contains the "Spent" and "Remaining" budget cards side-by-side. */}
                <View style={budgetOverviewSectionStyles.secondaryCardsRow}>
                    {/* SPENT CARD - Displays the total amount spent. */}
                    <View style={[
                        budgetOverviewSectionStyles.secondaryCard,
                        // Applies 'overBudgetCard' style (red border) if over budget, otherwise 'spentCard' (light blue border).
                        isOverBudget ? budgetOverviewSectionStyles.overBudgetCard : budgetOverviewSectionStyles.spentCard
                    ]}>
                        {/* Secondary Card Header - Contains the icon and "Spent" label. */}
                        <View style={budgetOverviewSectionStyles.secondaryCardHeader}>
                            <Ionicons
                                name="trending-down-outline"
                                size={20}
                                // Icon color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent}
                            />
                            <Text style={budgetOverviewSectionStyles.secondaryCardLabel}>Spent</Text>
                        </View>
                        {/* Spent Amount Display - Shows a loading indicator or the formatted spent amount. */}
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                // Indicator color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent}
                            />
                        ) : (
                            <Text style={[
                                budgetOverviewSectionStyles.secondaryCardAmount,
                                // Amount text color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                { color: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent }
                            ]}>
                                {formatAmount(overview.spent)}
                            </Text>
                        )}
                        {/* Budget Indicator - Shows a colored dot and text indicating budget status. */}
                        <View style={budgetOverviewSectionStyles.budgetIndicator}>
                            <View style={[
                                budgetOverviewSectionStyles.budgetDot,
                                // Dot color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                {
                                    backgroundColor: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent
                                }
                            ]} />
                            <Text style={[
                                budgetOverviewSectionStyles.budgetText,
                                // Text color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                                { color: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent }
                            ]}>
                                {isOverBudget ? 'Over Budget' : 'On Track'} {/* TODO: Add more sophisticated budget health logic (e.g., warning at 80%, danger at 95%) */}
                            </Text>
                        </View>
                    </View>

                    {/* REMAINING CARD - Displays the amount left to spend or the overspend amount. */}
                    <View style={[
                        budgetOverviewSectionStyles.secondaryCard,
                        // Applies 'overBudgetCard' style (red border) if over budget, otherwise 'remainingCard' (light green border).
                        isOverBudget ? budgetOverviewSectionStyles.overBudgetCard : budgetOverviewSectionStyles.remainingCard
                    ]}>
                        {/* Secondary Card Header - Contains the icon and "Remaining" or "Over Budget" label. */}
                        <View style={budgetOverviewSectionStyles.secondaryCardHeader}>
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                // Icon color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.remaining}
                            />
                            <Text style={budgetOverviewSectionStyles.secondaryCardLabel}>
                                {isOverBudget ? 'Over Budget' : 'Remaining'}
                            </Text>
                        </View>
                        {/* Remaining Amount Display - Shows a loading indicator or the formatted remaining amount. */}
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                // Indicator color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.remaining}
                            />
                        ) : (
                            <Text style={[
                                budgetOverviewSectionStyles.secondaryCardAmount,
                                // Amount text color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                { color: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.remaining }
                            ]}>
                                {formatAmount(Math.abs(remainingNum))}
                            </Text>
                        )}
                        {/* Remaining Progress - Visual bar showing remaining budget. */}
                        <View style={budgetOverviewSectionStyles.remainingProgress}>
                            <View style={budgetOverviewSectionStyles.remainingProgressBar}>
                                <View
                                    style={[
                                        budgetOverviewSectionStyles.remainingProgressFill,
                                        {
                                            // Fills the bar based on remaining percentage, capped at 100%.
                                            // Color changes to 'spending' (red) if over budget, otherwise 'remaining' (teal).
                                            width: `${Math.min(Math.abs(remainingPercentage), 100)}%`,
                                            backgroundColor: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.remaining
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
