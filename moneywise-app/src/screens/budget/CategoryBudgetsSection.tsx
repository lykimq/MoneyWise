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
    // MAIN SECTION CONTAINER - Uses shared section styling for consistency
    <View style={sectionStyles.container}>
        {/* SECTION TITLE - Uses shared title styling across all budget sections */}
        <Text style={sectionStyles.title}>Category Budgets</Text>

        {/* CATEGORY LIST CONTAINER - Vertical stack of category budget cards */}
        <View style={categoryStyles.listContainer}>
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
    const progressBarColor = progressPercentage > 100 ? '#FF6B6B' : category.category_color;

    return (
        // MAIN CARD CONTAINER - Individual category budget card with shadow
        <View style={categoryStyles.budgetCard}>

            {/* CATEGORY HEADER SECTION - Icon, name, and spending summary */}
            <View style={categoryStyles.cardHeader}>
                {/* CATEGORY ICON - Colored icon representing the budget category */}
                <Ionicons
                    name={iconName}
                    size={24}
                    color={category.category_color}
                />

                {/* CATEGORY INFO SECTION - Name and spending amounts */}
                <View style={categoryStyles.categoryInfo}>
                    {/* CATEGORY NAME - Primary category identifier */}
                    <Text style={categoryStyles.categoryName}>
                        {category.category_name}
                    </Text>

                    {/* AMOUNT COMPARISON - Shows spent vs planned amounts */}
                    <Text style={categoryStyles.amountText}>
                        ${spentAmount.toLocaleString()} / ${plannedAmount.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* PROGRESS BAR SECTION - Visual progress indicator with percentage */}
            <View style={progressStyles.container}>
                {/* PROGRESS BAR BACKGROUND - Gray background for progress bar */}
                <View style={progressStyles.barBackground}>
                    {/* PROGRESS BAR FILL - Dynamic width and color based on spending */}
                    <View style={[
                        progressStyles.barFill,
                        {
                            width: `${Math.min(progressPercentage, 100)}%`,  // Cap at 100% visual width
                            backgroundColor: progressBarColor  // Red if over budget, category color if normal
                        }
                    ]} />
                </View>

                {/* PERCENTAGE TEXT - Numerical percentage display */}
                <Text style={progressStyles.percentageText}>
                    {Math.round(progressPercentage)}%
                </Text>
            </View>

            {/* REMAINING/OVERSPEND STATUS - Shows remaining budget or overspend amount */}
            <Text style={[
                categoryStyles.remainingText,
                { color: isOverBudget ? '#FF6B6B' : '#666' }  // Red for over budget, gray for normal
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
 * CATEGORY STYLES - CategoryBudgetsSection Component Styling
 *
 * These styles create a vertical list of category budget cards with consistent
 * spacing, shadows, and layout. Each card displays comprehensive budget information
 * in an organized, scannable format.
 */
const categoryStyles = StyleSheet.create({
    // LIST CONTAINER - Vertical stack of category cards
    // Uses gap for consistent spacing between cards
    listContainer: {
        gap: 15,                 // 15px vertical spacing between category cards
    },

    // BUDGET CARD - Individual category card container
    // Creates elevated white cards with rounded corners and shadow
    // Contains all category budget information in organized sections
    budgetCard: {
        backgroundColor: '#FFFFFF',  // Pure white background
        padding: 15,             // Internal spacing for all content
        borderRadius: 12,        // Rounded corners for modern look

        // SHADOW PROPERTIES - Creates subtle elevation effect
        shadowColor: '#000',     // Black shadow for depth
        shadowOffset: { width: 0, height: 2 },  // Slight downward shadow
        shadowOpacity: 0.1,      // Light shadow (10% opacity)
        shadowRadius: 3.84,      // Soft shadow blur
        elevation: 5,            // Android shadow elevation
    },

    // CARD HEADER - Top section with icon and category info
    // Horizontal layout for icon and text information
    cardHeader: {
        flexDirection: 'row',    // Horizontal arrangement of icon and info
        alignItems: 'center',    // Vertical center alignment
        marginBottom: 10,        // Space before progress section
    },

    // CATEGORY INFO - Text information section next to icon
    // Contains category name and spending amounts
    categoryInfo: {
        marginLeft: 15,          // Space between icon and text
        flex: 1,                 // Takes remaining horizontal space
    },

    // CATEGORY NAME - Primary category identifier
    // Bold, dark text for easy identification
    categoryName: {
        fontSize: 16,            // Medium-large text for prominence
        fontWeight: '600',       // Semi-bold weight for emphasis
        color: '#333',           // Dark gray for high contrast
    },

    // AMOUNT TEXT - Spending comparison (spent / planned)
    // Secondary information showing budget utilization
    amountText: {
        fontSize: 14,            // Smaller than category name
        color: '#666',           // Medium gray for secondary info
        marginTop: 2,            // Small space below category name
    },

    // REMAINING TEXT - Shows remaining budget or overspend
    // Color changes dynamically based on budget status
    remainingText: {
        fontSize: 12,            // Small text for supplementary info
        color: '#666',           // Default gray (overridden for over-budget)
        marginTop: 5,            // Space above from progress bar
    },
});

/**
 * PROGRESS STYLES - Progress Bar Component Styling
 *
 * Creates visual progress indicators showing spending percentage with
 * dynamic colors and precise alignment. Uses horizontal layout with
 * percentage text aligned to the right.
 */
const progressStyles = StyleSheet.create({
    // PROGRESS CONTAINER - Horizontal layout for bar and percentage
    // Aligns progress bar with percentage text
    container: {
        flexDirection: 'row',    // Horizontal arrangement
        alignItems: 'center',    // Vertical center alignment
        marginBottom: 5,         // Space before remaining text
    },

    // BAR BACKGROUND - Gray background track for progress bar
    // Provides visual context for progress fill
    barBackground: {
        flex: 1,                 // Takes most horizontal space
        height: 8,               // Thin bar height for subtle appearance
        backgroundColor: '#E9ECEF',  // Light gray background
        borderRadius: 4,         // Rounded bar ends
        marginRight: 10,         // Space before percentage text
        overflow: 'hidden',      // Clips progress fill to rounded corners
    },

    // BAR FILL - Dynamic progress indicator
    // Width and color change based on spending percentage
    barFill: {
        height: '100%',          // Fills entire background height
        backgroundColor: '#007AFF',  // Default blue (overridden dynamically)
        borderRadius: 4,         // Rounded fill ends
    },

    // PERCENTAGE TEXT - Numerical progress display
    // Right-aligned text showing exact percentage
    percentageText: {
        fontSize: 12,            // Small text to not overwhelm
        fontWeight: '600',       // Semi-bold for readability
        color: '#333',           // Dark gray for contrast
        minWidth: 35,            // Consistent width for alignment
        textAlign: 'right',      // Right-align for clean appearance
    },
});
