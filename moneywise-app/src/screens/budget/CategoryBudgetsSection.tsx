import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBudgetApi } from '../../services/api';
import {
    colors,
    spacing,
    sectionStyles,
    categoryCardStyles,
    progressBarStyles,
    standardCardStyles
} from '../../styles';
import { sanitizeString } from '../../utils/sanitization';
import { toNumber } from '../../utils/currencyUtils';

/**
 * Props for the CategoryBudgetsSection component.
 */
interface CategoryBudgetsSectionProps {
    categories: CategoryBudgetApi[];
    getCategoryIcon: (categoryName: string) => keyof typeof Ionicons.glyphMap;
}

/**
 * Props for the CategoryBudgetCard component.
 */
interface CategoryBudgetCardProps {
    category: CategoryBudgetApi;
    iconName: keyof typeof Ionicons.glyphMap;
}

/**
 * Props for the CategoryBudgetCardHeader component.
 */
interface CategoryBudgetCardHeaderProps {
    category: CategoryBudgetApi;
    iconName: keyof typeof Ionicons.glyphMap;
    spentAmount: number;
    plannedAmount: number;
}

/**
 * Props for the CategoryProgressBar component.
 */
interface CategoryProgressBarProps {
    progressPercentage: number;
    progressBarColor: string;
}

/**
 * Props for the CategoryStatusText component.
 */
interface CategoryStatusTextProps {
    remainingAmount: number;
    isOverBudget: boolean;
}

/**
 * CategoryBudgetCardHeader Component
 *
 * Displays the category icon, name, and spending amounts.
 */
const CategoryBudgetCardHeader: React.FC<CategoryBudgetCardHeaderProps> = ({
    category,
    iconName,
    spentAmount,
    plannedAmount
}) => (
    <View style={categoryCardStyles.header}>
        {/* CATEGORY ICON - Colored icon representing the budget category. */}
        <Ionicons
            name={iconName}
            size={24}
            color={category.category_color}
        />

        {/* CATEGORY INFO SECTION - Displays the category name and spending amounts. */}
        <View style={categoryCardStyles.categoryInfo}>
            {/* CATEGORY NAME - Primary identifier for the budget category. */}
            <Text style={categoryCardStyles.categoryName}>
                {sanitizeString(category.category_name)}
            </Text>

            {/* AMOUNT COMPARISON - Shows spent versus planned amounts. */}
            <Text style={categoryCardStyles.amountText}>
                ${spentAmount.toLocaleString()} / ${plannedAmount.toLocaleString()}
            </Text>
        </View>
    </View>
);

/**
 * CategoryProgressBar Component
 *
 * Displays the visual progress bar with a percentage indicator.
 */
const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
    progressPercentage,
    progressBarColor
}) => (
    <View style={progressBarStyles.container}>
        {/* PROGRESS BAR BACKGROUND - Gray background for the progress bar. */}
        <View style={progressBarStyles.categoryBar}>
            {/* PROGRESS BAR FILL - Dynamic width and color based on spending. */}
            <View style={[
                progressBarStyles.categoryFill,
                {
                    width: `${Math.min(progressPercentage, 100)}%`,  // Caps at 100% visual width.
                    backgroundColor: progressBarColor  // Red if over budget, category color if normal.
                }
            ]} />
        </View>

        {/* PERCENTAGE TEXT - Numerical percentage display. */}
        <Text style={progressBarStyles.percentageText}>
            {Math.round(progressPercentage)}%
        </Text>
    </View>
);

/**
 * CategoryStatusText Component
 *
 * Displays the remaining budget or overspend amount with appropriate styling.
 */
const CategoryStatusText: React.FC<CategoryStatusTextProps> = ({
    remainingAmount,
    isOverBudget
}) => (
    <Text style={[
        categoryCardStyles.remainingText,
        // Red for over budget, gray for normal.
        { color: isOverBudget ? colors.spending : colors.text.secondary }
    ]}>
        {isOverBudget
            ? `+$${Math.abs(remainingAmount).toLocaleString()} over budget`
            : `-$${remainingAmount.toLocaleString()} remaining`
        }
    </Text>
);

/**
 * CategoryBudgetsSection Component
 *
 * Displays a detailed breakdown of budget categories with progress indicators.
 * Each category shows spending progress, remaining budget, and visual status
 * indicators.
 *
 * @param categories - An array of category budget data from the API.
 * @param getCategoryIcon - A function to retrieve the appropriate icon for
 *                          each category.
 */
export const CategoryBudgetsSection: React.FC<CategoryBudgetsSectionProps> = ({
    categories,
    getCategoryIcon
}) => (
    // MAIN SECTION CONTAINER - Uses shared section styling for consistency.
    <View style={sectionStyles.container}>
        {/* SECTION TITLE - Uses shared title styling across all budget sections. */}
        <Text style={sectionStyles.title}>Category Budgets</Text>

        {/* CATEGORY LIST CONTAINER - Vertical stack of category budget cards. */}
        <View style={standardCardStyles.container}>
            {categories.map((category) => (
                // INDIVIDUAL CATEGORY CARD - Renders detailed budget info for each category.
                <CategoryBudgetCard
                    key={category.id}
                    category={category}
                    iconName={getCategoryIcon(category.category_name)}
                />
            ))}
        </View>
    </View>
);

/**
 * CategoryBudgetCard Component
 *
 * Individual category card displaying:
 * - Category icon and name.
 * - Spending progress with a visual progress bar.
 * - Amount spent versus planned budget.
 * - Remaining budget or overspend amount.
 *
 * Uses color coding to indicate budget status:
 * - Normal color when on track.
 * - Red color when over budget.
 *
 * @param category - Category budget data from the API.
 * @param iconName - The icon name to display for this category.
 */
const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({ category, iconName }) => {
    // BUDGET CALCULATIONS - Converts string amounts to numbers for calculations
    // with sanitization.
    const spentAmount = toNumber(category.spent);
    const plannedAmount = toNumber(category.planned);
    const remainingAmount = toNumber(category.remaining);
    const progressPercentage = toNumber(category.percentage);

    // BUDGET STATUS LOGIC - Determines if the category is over budget and
    // selects appropriate colors.
    const isOverBudget = remainingAmount < 0;
    const progressBarColor = progressPercentage > 100 ? colors.spending : category.category_color;

    return (
        // MAIN CARD CONTAINER - Individual category budget card with shadow.
        <View style={categoryCardStyles.card}>
            {/* CATEGORY HEADER SECTION - Icon, name, and spending summary. */}
            <CategoryBudgetCardHeader
                category={category}
                iconName={iconName}
                spentAmount={spentAmount}
                plannedAmount={plannedAmount}
            />

            {/* PROGRESS BAR SECTION - Visual progress indicator with percentage. */}
            <CategoryProgressBar
                progressPercentage={progressPercentage}
                progressBarColor={progressBarColor}
            />

            {/* REMAINING/OVERSPEND STATUS - Shows remaining budget or overspend amount. */}
            <CategoryStatusText
                remainingAmount={remainingAmount}
                isOverBudget={isOverBudget}
            />
        </View>
    );
};
