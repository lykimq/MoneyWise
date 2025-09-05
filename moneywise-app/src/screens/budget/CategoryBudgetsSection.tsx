import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBudgetApi } from '../../services/api';
import { sectionStyles, budgetOverviewColors, categoryBudgetsSectionStyles, categoryBudgetCardStyles, categoryProgressBarStyles } from './styles';

/**
 * Props for the CategoryBudgetsSection component
 */
interface CategoryBudgetsSectionProps {
    categories: CategoryBudgetApi[];
    getCategoryIcon: (categoryName: string) => keyof typeof Ionicons.glyphMap;
}

/**
 * Props for the CategoryBudgetCard component
 */
interface CategoryBudgetCardProps {
    category: CategoryBudgetApi;
    iconName: keyof typeof Ionicons.glyphMap;
}

/**
 * CategoryBudgetsSection Component
 *
 * Displays a detailed breakdown of budget categories with progress indicators.
 * Each category shows spending progress, remaining budget, and visual status indicators.
 *
 * @param categories - Array of category budget data from the API
 * @param getCategoryIcon - Function to get appropriate icon for each category
 */
export const CategoryBudgetsSection: React.FC<CategoryBudgetsSectionProps> = ({
    categories,
    getCategoryIcon
}) => (
    // MAIN SECTION CONTAINER - Uses shared section styling for consistency
    <View style={sectionStyles.container}>
        {/* SECTION TITLE - Uses shared title styling across all budget sections */}
        <Text style={sectionStyles.title}>Category Budgets</Text>

        {/* CATEGORY LIST CONTAINER - Vertical stack of category budget cards */}
        <View style={categoryBudgetsSectionStyles.listContainer}>
            {categories.map((category) => (
                // INDIVIDUAL CATEGORY CARD - Renders detailed budget info for each category
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
 * - Category icon and name
 * - Spending progress with visual progress bar
 * - Amount spent vs planned budget
 * - Remaining budget or overspend amount
 *
 * Uses color coding to indicate budget status:
 * - Normal color when on track
 * - Red color when over budget
 *
 * @param category - Category budget data from API
 * @param iconName - Icon name to display for this category
 */
const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({ category, iconName }) => {
    // BUDGET CALCULATIONS - Convert string amounts to numbers for calculations
    const spentAmount = Number(category.spent);
    const plannedAmount = Number(category.planned);
    const remainingAmount = Number(category.remaining);
    const progressPercentage = Number(category.percentage);

    // BUDGET STATUS LOGIC - Determines if category is over budget and appropriate colors
    const isOverBudget = remainingAmount < 0;
    const progressBarColor = progressPercentage > 100 ? budgetOverviewColors.spending : category.category_color;

    return (
        // MAIN CARD CONTAINER - Individual category budget card with shadow
        <View style={categoryBudgetCardStyles.budgetCard}>

            {/* CATEGORY HEADER SECTION - Icon, name, and spending summary */}
            <View style={categoryBudgetCardStyles.cardHeader}>
                {/* CATEGORY ICON - Colored icon representing the budget category */}
                <Ionicons
                    name={iconName}
                    size={24}
                    color={category.category_color}
                />

                {/* CATEGORY INFO SECTION - Name and spending amounts */}
                <View style={categoryBudgetCardStyles.categoryInfo}>
                    {/* CATEGORY NAME - Primary category identifier */}
                    <Text style={categoryBudgetCardStyles.categoryName}>
                        {category.category_name}
                    </Text>

                    {/* AMOUNT COMPARISON - Shows spent vs planned amounts */}
                    <Text style={categoryBudgetCardStyles.amountText}>
                        ${spentAmount.toLocaleString()} / ${plannedAmount.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* PROGRESS BAR SECTION - Visual progress indicator with percentage */}
            <View style={categoryProgressBarStyles.container}>
                {/* PROGRESS BAR BACKGROUND - Gray background for progress bar */}
                <View style={categoryProgressBarStyles.barBackground}>
                    {/* PROGRESS BAR FILL - Dynamic width and color based on spending */}
                    <View style={[
                        categoryProgressBarStyles.barFill,
                        {
                            width: `${Math.min(progressPercentage, 100)}%`,  // Cap at 100% visual width
                            backgroundColor: progressBarColor  // Red if over budget, category color if normal
                        }
                    ]} />
                </View>

                {/* PERCENTAGE TEXT - Numerical percentage display */}
                <Text style={categoryProgressBarStyles.percentageText}>
                    {Math.round(progressPercentage)}%
                </Text>
            </View>

            {/* REMAINING/OVERSPEND STATUS - Shows remaining budget or overspend amount */}
            <Text style={[
                categoryBudgetCardStyles.remainingText,
                { color: isOverBudget ? budgetOverviewColors.spending : budgetOverviewColors.textSecondary }  // Red for over budget, gray for normal
            ]}>
                {isOverBudget
                    ? `+$${Math.abs(remainingAmount).toLocaleString()} over budget`
                    : `-$${remainingAmount.toLocaleString()} remaining`
                }
            </Text>
        </View>
    );
};
