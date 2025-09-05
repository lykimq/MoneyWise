import { StyleSheet } from 'react-native';
import { budgetOverviewColors } from './colors';
import { cardBase, headerRowBase, progressBarBase } from './baseStyles';

/**
 * Styles for the CategoryBudgetsSection Component.
 * These styles create a vertical list of category budget cards with consistent
 * spacing, shadows, and layout. Each card displays comprehensive budget information
 * in an organized, scannable format.
 */
export const categoryBudgetsSectionStyles = StyleSheet.create({
    /**
     * Container for the vertical stack of category cards, providing consistent
     * vertical spacing between each card.
     */
    listContainer: {
        gap: 15, // 15px vertical spacing between category cards
    },
});

/**
 * Styles for the individual CategoryBudgetCard Component.
 * These styles define the appearance and layout of each category budget card,
 * including its header, information, and progress bar.
 */
export const categoryBudgetCardStyles = StyleSheet.create({
    /**
     * Main container for an individual category budget card.
     * Inherits common card properties from `cardBase` and customizes for category display.
     */
    budgetCard: {
        ...cardBase,
        padding: 15,             // Internal spacing for all content
        borderRadius: 12,        // Rounded corners for modern look
        shadowRadius: 3.84,      // Soft shadow blur
        elevation: 5,            // Android shadow elevation
    },
    /**
     * Top section of the card, arranging the icon and category information horizontally.
     */
    cardHeader: {
        ...headerRowBase,        // Horizontal arrangement and vertical center alignment
        marginBottom: 10,        // Space before progress section
    },
    /**
     * Container for the category name and spending amounts, positioned next to the icon.
     */
    categoryInfo: {
        marginLeft: 15,          // Space between icon and text
        flex: 1,                 // Takes remaining horizontal space
    },
    /**
     * Text style for the primary category identifier (category name).
     */
    categoryName: {
        fontSize: 16,            // Medium-large text for prominence
        fontWeight: '600',       // Semi-bold weight for emphasis
        color: budgetOverviewColors.text, // Dark gray for high contrast
    },
    /**
     * Text style for the spending comparison (spent / planned amounts).
     */
    amountText: {
        fontSize: 14,            // Smaller than category name
        color: budgetOverviewColors.textSecondary, // Medium gray for secondary info
        marginTop: 2,            // Small space below category name
    },
    /**
     * Text style for displaying the remaining budget or overspend amount.
     * Its color is dynamically set in the component based on budget status.
     */
    remainingText: {
        fontSize: 12,            // Small text for supplementary info
        color: budgetOverviewColors.textSecondary, // Default gray (overridden for over-budget)
        marginTop: 5,            // Space above from progress bar
    },
});

/**
 * Styles for the progress bar within the CategoryBudgetCard.
 * Creates visual progress indicators showing spending percentage with
 * dynamic colors and precise alignment.
 */
export const categoryProgressBarStyles = StyleSheet.create({
    /**
     * Container for the progress bar and percentage text, arranging them horizontally.
     */
    container: {
        ...headerRowBase,        // Horizontal arrangement and vertical center alignment
        marginBottom: 5,         // Space before remaining text
    },
    /**
     * Background track for the progress bar, providing visual context for the fill.
     */
    barBackground: {
        ...progressBarBase,      // Inherits common progress bar properties
        flex: 1,                 // Takes most horizontal space
        height: 8,               // Thin bar height for subtle appearance
        backgroundColor: budgetOverviewColors.background,  // Light gray background
        marginRight: 10,         // Space before percentage text
    },
    /**
     * Dynamic fill portion of the progress bar, whose width and color change
     * based on spending percentage.
     */
    barFill: {
        height: '100%',          // Fills entire background height
        backgroundColor: budgetOverviewColors.primary, // Default blue (overridden dynamically)
        borderRadius: 4,         // Rounded fill ends
    },
    /**
     * Numerical percentage display, right-aligned for clean appearance.
     */
    percentageText: {
        fontSize: 12,            // Small text to not overwhelm
        fontWeight: '600',       // Semi-bold for readability
        color: budgetOverviewColors.text, // Dark gray for contrast
        minWidth: 35,            // Consistent width for alignment
        textAlign: 'right',      // Right-align for clean appearance
    },
});
