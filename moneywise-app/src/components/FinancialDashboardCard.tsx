import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, mainCardStyles, secondaryCardStyles, progressBarStyles, sectionStyles, cardVariants, standardCardStyles } from '../styles';
import { toNumber, formatAmount } from '../utils/currencyUtils';

/**
 * Props for the FinancialDashboardCard component
 */
interface FinancialDashboardCardProps {
    spent?: string | number;
    remaining?: string | number;
    savings?: string | number;
    totalBudget?: string | number;
    loading?: boolean;
    period?: string;
}


/**
 * FinancialDashboardCard Component
 *
 * Displays a financial overview dashboard with:
 * - Total spent amount (main card with progress indicator)
 * - Remaining budget and savings (secondary cards)
 * - Visual progress bars and status indicators
 * - Loading states and period information
 *
 * Uses consistent styling patterns matching other budget components.
 *
 * @param spent - The total amount spent
 * @param remaining - The remaining budget amount
 * @param savings - The total savings amount
 * @param totalBudget - Optional total budget for progress calculations
 * @param loading - Whether to show loading state
 * @param period - The financial period being displayed
 */
const FinancialDashboardCard: React.FC<FinancialDashboardCardProps> = ({
    spent = 0,
    remaining = 0,
    savings = 0,
    totalBudget,
    loading = false,
    period = 'This Month',
}) => {
    // Convert all incoming props to numbers for consistent calculations
    const spentNum = toNumber(spent);
    const remainingNum = toNumber(remaining);
    const savingsNum = toNumber(savings);
    const totalBudgetNum = toNumber(totalBudget);

    // Determine the total budget amount, falling back to spent + remaining if totalBudget is not provided
    const totalBudgetAmount = totalBudgetNum || (spentNum + remainingNum);

    // Calculate percentages for progress bars
    const spentPercentage = totalBudgetAmount > 0 ? (spentNum / totalBudgetAmount) * 100 : 0;
    const remainingPercentage = totalBudgetAmount > 0 ? (remainingNum / totalBudgetAmount) * 100 : 0;
    // Savings percentage is a placeholder, assuming a goal of 1000 for now
    // TODO: Replace hardcoded $1000 with actual savings goal/target from API
    const savingsPercentage = Math.min(100, (savingsNum / 1000) * 100);

    return (
        // MAIN SECTION CONTAINER - Uses shared section styling for consistency
        <View style={sectionStyles.container}>
            {/* DASHBOARD CONTAINER - Holds the main and secondary financial cards */}
            <View style={standardCardStyles.container}>
                {/* MAIN CARD - Displays the "Total Spent" as the most prominent information */}
                <View style={mainCardStyles.card}>
                    {/* Main Card Header - Contains the icon, title, and period */}
                    <View style={mainCardStyles.header}>
                        {/* Title Row - Groups the trending-down icon and "Total Spent" text */}
                        <View style={mainCardStyles.titleRow}>
                            <Ionicons name="trending-down-outline" size={28} color={colors.spending} />
                            <Text style={mainCardStyles.title}>Total Spent</Text>
                        </View>
                        {/* Period Text - Displays the current financial period (e.g., "This Month") */}
                        <Text style={mainCardStyles.period}>{period}</Text>
                    </View>

                    {/* Main Card Content - Displays the spent amount and spending progress */}
                    <View style={mainCardStyles.content}>
                        {/* Spent Amount Display - Shows a loading indicator or the formatted spent amount */}
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.spending} />
                        ) : (
                            <Text style={[mainCardStyles.amount, { color: colors.spending }]}>
                                {formatAmount(spent)}
                            </Text>
                        )}

                        {/* Progress Indicator - Visual bar showing spending against total budget */}
                        <View style={mainCardStyles.progressContainer}>
                            <View style={[mainCardStyles.progressBar, { backgroundColor: colors.spending + '20' }]}>
                                <View
                                    style={[
                                        mainCardStyles.progressFill,
                                        {
                                            width: `${Math.min(spentPercentage, 100)}%`,
                                            backgroundColor: colors.spending
                                        }
                                    ]}
                                />
                            </View>
                            {/* Progress Text - Shows the percentage of budget spent or a "No budget set" message */}
                            <Text style={mainCardStyles.progressText}>
                                {totalBudgetAmount > 0 ? `${Math.round(spentPercentage)}% of budget` : 'No budget set'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* SECONDARY CARDS ROW - Contains the "Remaining" and "Savings" cards side-by-side */}
                <View style={standardCardStyles.row}>
                    {/* REMAINING CARD - Displays the amount left to spend */}
                    <View style={[secondaryCardStyles.card, cardVariants.remaining]}>
                        {/* Secondary Card Header - Contains the icon and "Remaining" label */}
                        <View style={secondaryCardStyles.header}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={colors.remaining} />
                            <Text style={secondaryCardStyles.label}>Remaining</Text>
                        </View>
                        {/* Remaining Amount Display - Shows a loading indicator or the formatted remaining amount */}
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.remaining} />
                        ) : (
                            <Text style={[secondaryCardStyles.amount, { color: colors.remaining }]}>
                                {formatAmount(remaining)}
                            </Text>
                        )}
                        {/* Budget Indicator - Shows a colored dot and text indicating budget status */}
                        <View style={secondaryCardStyles.indicator}>
                            <View style={[secondaryCardStyles.dot, { backgroundColor: colors.remaining }]} />
                            <Text style={[secondaryCardStyles.text, { color: colors.remaining }]}>
                                {remainingNum > 0 ? 'On Track' : 'Over Budget'}
                            </Text>
                        </View>
                        {/* Remaining Progress - Visual bar showing remaining budget */}
                        <View style={progressBarStyles.container}>
                            <View style={[progressBarStyles.bar, { backgroundColor: colors.remaining + '20' }]}>
                                <View
                                    style={[
                                        progressBarStyles.fill,
                                        {
                                            width: `${Math.min(remainingPercentage, 100)}%`,
                                            backgroundColor: colors.remaining
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={progressBarStyles.percentageText}>
                                {`${Math.round(remainingPercentage)}% ${remainingNum > 0 ? 'remaining' : 'over budget'}`}
                            </Text>
                        </View>
                    </View>

                    {/* SAVINGS CARD - Displays the total savings amount */}
                    <View style={secondaryCardStyles.card}>
                        {/* Secondary Card Header - Contains the icon and "Savings" label */}
                        <View style={secondaryCardStyles.header}>
                            <Ionicons name="trending-up-outline" size={20} color={colors.savings} />
                            <Text style={secondaryCardStyles.label}>Savings</Text>
                        </View>
                        {/* Savings Amount Display - Shows a loading indicator or the formatted savings amount */}
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.savings} />
                        ) : (
                            <Text style={[secondaryCardStyles.amount, { color: colors.savings }]}>
                                {formatAmount(savings)}
                            </Text>
                        )}
                        {/* Budget Indicator - Shows a colored dot and text indicating savings status */}
                        <View style={secondaryCardStyles.indicator}>
                            <View style={[secondaryCardStyles.dot, { backgroundColor: colors.savings }]} />
                            <Text style={[secondaryCardStyles.text, { color: colors.savings }]}>
                                Savings
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default FinancialDashboardCard;
