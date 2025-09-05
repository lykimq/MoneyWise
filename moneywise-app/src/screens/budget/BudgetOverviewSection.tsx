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
        <View style={sectionStyles.container}>
            {/* SECTION TITLE - Uses shared title styling across all budget sections */}
            <Text style={sectionStyles.title}>Budget Overview</Text>

            <View style={budgetOverviewSectionStyles.dashboardContainer}>
                {/* Main Card - Planned Budget (Most Important) */}
                <View style={budgetOverviewSectionStyles.mainCard}>
                    <View style={budgetOverviewSectionStyles.mainCardHeader}>
                        <View style={budgetOverviewSectionStyles.mainCardTitleRow}>
                            <Ionicons name="wallet-outline" size={28} color={budgetOverviewColors.planned} />
                            <Text style={budgetOverviewSectionStyles.mainCardTitle}>Planned Budget</Text>
                        </View>
                        <Text style={budgetOverviewSectionStyles.period}>{period}</Text>
                    </View>

                    <View style={budgetOverviewSectionStyles.mainCardContent}>
                        {loading ? (
                            <ActivityIndicator size="large" color={budgetOverviewColors.planned} />
                        ) : (
                            <Text style={[budgetOverviewSectionStyles.mainCardAmount, { color: budgetOverviewColors.planned }]}>
                                {formatAmount(overview.planned)}
                            </Text>
                        )}

                        {/* Progress indicator for spending vs planned */}
                        <View style={budgetOverviewSectionStyles.mainProgressContainer}>
                            <View style={budgetOverviewSectionStyles.mainProgressBar}>
                                <View
                                    style={[
                                        budgetOverviewSectionStyles.mainProgressFill,
                                        {
                                            width: `${Math.min(spentPercentage, 100)}%`,
                                            backgroundColor: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={budgetOverviewSectionStyles.progressText}>
                                {plannedNum > 0 ? `${Math.round(spentPercentage)}% spent` : 'No budget planned'} {/* TODO: Add more detailed budget progress text */}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Secondary Cards Row */}
                <View style={budgetOverviewSectionStyles.secondaryCardsRow}>
                    {/* Spent Card */}
                    <View style={[budgetOverviewSectionStyles.secondaryCard, isOverBudget ? budgetOverviewSectionStyles.overBudgetCard : budgetOverviewSectionStyles.spentCard]}>
                        <View style={budgetOverviewSectionStyles.secondaryCardHeader}>
                            <Ionicons name="trending-down-outline" size={20} color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent} />
                            <Text style={budgetOverviewSectionStyles.secondaryCardLabel}>Spent</Text>
                        </View>
                        {loading ? (
                            <ActivityIndicator size="small" color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent} />
                        ) : (
                            <Text style={[budgetOverviewSectionStyles.secondaryCardAmount, { color: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent }]}>
                                {formatAmount(overview.spent)}
                            </Text>
                        )}
                        <View style={budgetOverviewSectionStyles.budgetIndicator}>
                            <View style={[
                                budgetOverviewSectionStyles.budgetDot,
                                {
                                    backgroundColor: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent
                                }
                            ]} />
                            <Text style={[
                                budgetOverviewSectionStyles.budgetText,
                                { color: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.spent }
                            ]}>
                                {isOverBudget ? 'Over Budget' : 'On Track'} {/* TODO: Add more sophisticated budget health logic (e.g., warning at 80%, danger at 95%) */}
                            </Text>
                        </View>
                    </View>

                    {/* Remaining Card */}
                    <View style={[budgetOverviewSectionStyles.secondaryCard, isOverBudget ? budgetOverviewSectionStyles.overBudgetCard : budgetOverviewSectionStyles.remainingCard]}>
                        <View style={budgetOverviewSectionStyles.secondaryCardHeader}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.remaining} />
                            <Text style={budgetOverviewSectionStyles.secondaryCardLabel}>
                                {isOverBudget ? 'Over Budget' : 'Remaining'}
                            </Text>
                        </View>
                        {loading ? (
                            <ActivityIndicator size="small" color={isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.remaining} />
                        ) : (
                            <Text style={[budgetOverviewSectionStyles.secondaryCardAmount, { color: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.remaining }]}>
                                {formatAmount(Math.abs(remainingNum))}
                            </Text>
                        )}
                        <View style={budgetOverviewSectionStyles.remainingProgress}>
                            <View style={budgetOverviewSectionStyles.remainingProgressBar}>
                                <View
                                    style={[
                                        budgetOverviewSectionStyles.remainingProgressFill,
                                        {
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
