import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBudgetApi } from '../../services/api';
import { sectionStyles } from './styles';

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
    <View style={sectionStyles.container}>
        <Text style={sectionStyles.title}>Category Budgets</Text>

        <View style={categoryStyles.listContainer}>
            {categories.map((category) => (
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
    const spentAmount = Number(category.spent);
    const plannedAmount = Number(category.planned);
    const remainingAmount = Number(category.remaining);
    const progressPercentage = Number(category.percentage);

    const isOverBudget = remainingAmount < 0;
    const progressBarColor = progressPercentage > 100 ? '#FF6B6B' : category.category_color;

    return (
        <View style={categoryStyles.budgetCard}>
            {/* Category Header with Icon and Info */}
            <View style={categoryStyles.cardHeader}>
                <Ionicons
                    name={iconName}
                    size={24}
                    color={category.category_color}
                />
                <View style={categoryStyles.categoryInfo}>
                    <Text style={categoryStyles.categoryName}>
                        {category.category_name}
                    </Text>
                    <Text style={categoryStyles.amountText}>
                        ${spentAmount.toLocaleString()} / ${plannedAmount.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Progress Bar Section */}
            <View style={progressStyles.container}>
                <View style={progressStyles.barBackground}>
                    <View style={[
                        progressStyles.barFill,
                        {
                            width: `${Math.min(progressPercentage, 100)}%`,
                            backgroundColor: progressBarColor
                        }
                    ]} />
                </View>
                <Text style={progressStyles.percentageText}>
                    {Math.round(progressPercentage)}%
                </Text>
            </View>

            {/* Remaining/Overspend Text */}
            <Text style={[
                categoryStyles.remainingText,
                { color: isOverBudget ? '#FF6B6B' : '#666' }
            ]}>
                {isOverBudget
                    ? `+$${Math.abs(remainingAmount).toLocaleString()} over budget`
                    : `-$${remainingAmount.toLocaleString()} remaining`
                }
            </Text>
        </View>
    );
};

/**
 * Styles for category budget components
 */
const categoryStyles = StyleSheet.create({
    listContainer: {
        gap: 15,
    },
    budgetCard: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryInfo: {
        marginLeft: 15,
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    amountText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    remainingText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});

/**
 * Styles for progress bar indicators
 */
const progressStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    barBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#E9ECEF',
        borderRadius: 4,
        marginRight: 10,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
    },
    percentageText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        minWidth: 35,
        textAlign: 'right',
    },
});
