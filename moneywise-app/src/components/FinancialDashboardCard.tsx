import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, mainCardStyles, secondaryCardStyles, progressBarStyles, cardVariants, shadows, spacing } from '../styles';

// Use design system styles directly - no redundant overrides needed
const styles = {
    // Container with same padding as HomeScreen sections
    dashboardContainer: {
        paddingHorizontal: spacing.sectionPadding,
        paddingVertical: spacing.sectionVertical,
        gap: spacing.cardGap,
    },
    // Row layout for secondary cards
    secondaryCardsRow: {
        flexDirection: 'row' as const,
        gap: spacing.rowGap,
    },
};

/**
 * @interface FinancialDashboardCardProps
 * @description Defines the props for the FinancialDashboardCard component.
 * @property {string | number | undefined} spent - The total amount spent.
 * @property {string | number | undefined} remaining - The remaining budget.
 * @property {string | number | undefined} savings - The total savings.
 * @property {string | number} [totalBudget] - Optional total budget for progress calculations.
 * @property {boolean} [loading=false] - Indicates if the data is currently loading.
 * @property {string} [period="This Month"] - The financial period being displayed.
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
 * @function toNumber
 * @description Converts a value (string, number, or undefined) into a number.
 * Handles currency symbols and commas in strings.
 * @param {string | number | undefined} value - The input value to convert.
 * @returns {number} The converted number, or 0 if conversion fails or value is undefined.
 */
const toNumber = (value: string | number | undefined): number => {
    if (value === undefined) return 0;
    if (typeof value === 'string') {
        const cleaned = value.replace(/[$,]/g, '');
        return parseFloat(cleaned) || 0;
    }
    return value;
};

/**
 * @function formatAmount
 * @description Formats a numerical amount into a currency string (e.g., "$1,234.56").
 * @param {string | number | undefined} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
const formatAmount = (amount: string | number | undefined): string => {
    const numAmount = toNumber(amount);
    return `$${numAmount.toLocaleString()}`;
};

/**
 * @component ProgressBar
 * @description A reusable component to display a progress bar with a percentage fill and optional label.
 * @param {object} props - The component props.
 * @param {number} props.percentage - The percentage to fill the progress bar (0-100).
 * @param {string} props.color - The background color of the filled portion of the progress bar.
 * @param {string} [props.label] - An optional text label to display alongside the progress bar.
 */
const ProgressBar: React.FC<{
    percentage: number;
    color: string;
    label?: string;
}> = ({ percentage, color, label }) => (
    <View style={progressBarStyles.container}>
        <View style={[progressBarStyles.bar, { backgroundColor: color + '20' }]}>
            <View style={[progressBarStyles.fill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }]} />
        </View>
        {label && <Text style={mainCardStyles.progressText}>{label}</Text>}
    </View>
);

/**
 * @constant metrics
 * @description Configuration array for secondary financial metrics displayed on the dashboard.
 * This allows for data-driven rendering of the 'Remaining' and 'Savings' cards.
 * @property {string} key - Unique identifier for the metric.
 * @property {string} icon - Ionicons name for the metric's icon.
 * @property {string} label - Display label for the metric.
 * @property {string} color - Color associated with the metric.
 * @property {string} value - Key in the `data` object to retrieve the formatted amount.
 * @property {string} progress - Key in the `data` object to retrieve the percentage for the progress bar.
 * @property {boolean} showProgress - Whether to display a progress bar for this metric.
 */
const metrics = [
    {
        key: 'remaining',
        icon: 'checkmark-circle-outline',
        label: 'Remaining',
        color: colors.remaining,
        value: 'remaining',
        progress: 'remainingPercentage',
        showProgress: true,
    },
    {
        key: 'savings',
        icon: 'trending-up-outline',
        label: 'Savings',
        color: colors.savings,
        value: 'savings',
        progress: 'savingsPercentage',
        showProgress: false, // Savings progress bar is handled separately or has a different display logic.
    },
];

/**
 * @component FinancialDashboardCard
 * @description A React functional component that displays a financial overview card.
 * It shows total spent, remaining budget, and savings, with progress indicators.
 * The component is designed for readability and maintainability using utility functions,
 * a reusable ProgressBar component, and data-driven metric configuration.
 * @param {FinancialDashboardCardProps} props - The properties passed to the component.
 */
const FinancialDashboardCard: React.FC<FinancialDashboardCardProps> = (props) => {
    const {
        spent = 0,
        remaining = 0,
        savings = 0,
        totalBudget,
        loading = false,
        period = 'This Month',
    } = props;

    // Convert all incoming props to numbers for consistent calculations.
    const spentNum = toNumber(spent);
    const remainingNum = toNumber(remaining);
    const savingsNum = toNumber(savings);
    const totalBudgetNum = toNumber(totalBudget);

    // Determine the total budget amount, falling back to spent + remaining if totalBudget is not provided.
    const totalBudgetAmount = totalBudgetNum || (spentNum + remainingNum);

    // Calculate percentages for progress bars.
    // Percentages are 0 if totalBudgetAmount is 0 to prevent division by zero.
    const spentPercentage = totalBudgetAmount > 0 ? (spentNum / totalBudgetAmount) * 100 : 0;
    const remainingPercentage = totalBudgetAmount > 0 ? (remainingNum / totalBudgetAmount) * 100 : 0;
    // Savings percentage is a placeholder, assuming a goal of 1000 for now.
    // TODO: Replace hardcoded $1000 with actual savings goal/target from API.
    const savingsPercentage = Math.min(100, (savingsNum / 1000) * 100);

    // Aggregate formatted values and percentages into a single data object for easier access in JSX.
    const data = {
        spent: formatAmount(spent),
        remaining: formatAmount(remaining),
        savings: formatAmount(savings),
        spentPercentage,
        remainingPercentage,
        savingsPercentage,
    };

    return (
        <View style={styles.dashboardContainer}>
            {/* Main Card: Displays the primary metric (Total Spent) prominently. */}
            <View style={mainCardStyles.card}>
                {/* Header for the main card, including icon, title, and period. */}
                <View style={mainCardStyles.header}>
                    <View style={mainCardStyles.titleRow}>
                        <Ionicons name="trending-down-outline" size={28} color={colors.spending} />
                        <Text style={mainCardStyles.title}>Total Spent</Text>
                    </View>
                    <Text style={mainCardStyles.period}>{period}</Text>
                </View>

                {/* Content for the main card: displays the amount and its progress bar. */}
                <View style={mainCardStyles.content}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.spending} />
                    ) : (
                        <Text style={[mainCardStyles.amount, { color: colors.spending }]}>{data.spent}</Text>
                    )}
                    {totalBudgetAmount > 0 ? (
                        <ProgressBar
                            percentage={spentPercentage}
                            color={colors.spending}
                            label={`${Math.round(spentPercentage)}% of budget`}
                        />
                    ) : (
                        <Text style={mainCardStyles.progressText}>No budget set</Text>
                    )}
                </View>
            </View>

            {/* Secondary Metrics: Displays 'Remaining' and 'Savings' side-by-side. */}
            <View style={styles.secondaryCardsRow}>
                {metrics.map((metric) => {
                    // Dynamically retrieve the value and percentage for each metric from the `data` object.
                    // Ensure percentage is treated as a number for ProgressBar component.
                    const value = data[metric.value as keyof typeof data];
                    const percentage = data[metric.progress as keyof typeof data] as number;
                    const isRemaining = metric.key === 'remaining';

                    // Determine the progress bar color for 'Remaining' based on whether the user is over budget.
                    const progressColor = isRemaining
                        ? remainingNum > 0
                            ? colors.remaining
                            : colors.spending
                        : metric.color;

                    return (
                        <View key={metric.key} style={[secondaryCardStyles.card, isRemaining && cardVariants.remaining]}>
                            {/* Header for secondary card, including icon and label. */}
                            <View style={secondaryCardStyles.header}>
                                {/* Cast metric.icon to any to satisfy Ionicons name prop type, as the string values are known to be valid. */}
                                <Ionicons name={metric.icon as any} size={20} color={metric.color} />
                                <Text style={secondaryCardStyles.label}>{metric.label}</Text>
                            </View>
                            {/* Amount display for secondary card, with loading indicator. */}
                            {loading ? (
                                <ActivityIndicator size="small" color={metric.color} />
                            ) : (
                                <Text style={[secondaryCardStyles.amount, { color: metric.color }]}>{value}</Text>
                            )}
                            {/* Budget indicator for secondary cards - shows dot and status text */}
                            <View style={secondaryCardStyles.indicator}>
                                <View style={[secondaryCardStyles.dot, { backgroundColor: progressColor }]} />
                                <Text style={[secondaryCardStyles.text, { color: progressColor }]}>
                                    {metric.key === 'remaining'
                                        ? (remainingNum > 0 ? 'On Track' : 'Over Budget')
                                        : 'Savings'
                                    }
                                </Text>
                            </View>
                            {/* Progress bar for secondary metrics, if `showProgress` is true. */}
                            {metric.showProgress && (
                                <ProgressBar
                                    percentage={percentage}
                                    color={progressColor}
                                    label={
                                        // Custom label for 'Remaining' metric, indicating if over budget.
                                        metric.key === 'remaining'
                                            ? `${Math.round(percentage)}% ${remainingNum > 0 ? 'remaining' : 'over budget'}`
                                            : undefined // No label for other secondary metrics by default.
                                    }
                                />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default FinancialDashboardCard;
