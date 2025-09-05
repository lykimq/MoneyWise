import { StyleSheet } from 'react-native';
import { budgetOverviewColors } from './colors';
import { cardBase, headerRowBase, progressBarBase } from './baseStyles';

/**
 * Styles for the BudgetOverviewSection Component.
 * These styles create the improved dashboard layout for budget overview information,
 * utilizing visual hierarchy, progress indicators, and modern card design.
 */
export const budgetOverviewSectionStyles = StyleSheet.create({
    /**
     * Container for the entire budget dashboard, providing consistent spacing
     * between its child elements.
     */
    dashboardContainer: {
        gap: 15,
    },

    // === MAIN CARD STYLES ===

    /**
     * Main card style for the "Planned Budget" section, inheriting from `cardBase`
     * but with enhanced visual prominence (larger border radius, more padding,
     * and a more pronounced shadow).
     */
    mainCard: {
        ...cardBase,
        borderRadius: 20, // Slightly larger border radius for main card
        padding: 24,      // More padding for main card
        shadowOffset: { width: 0, height: 6 }, // Enhanced shadow for prominence
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
        // TODO: Add tap interaction for detailed budget breakdown
    },
    /**
     * Header style for the main card, arranging elements horizontally with space
     * between them and a bottom margin.
     */
    mainCardHeader: {
        ...headerRowBase,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    /**
     * Row style for the title and icon within the main card header.
     */
    mainCardTitleRow: {
        ...headerRowBase,
        gap: 12,
    },
    /**
     * Text style for the main card's title.
     */
    mainCardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: budgetOverviewColors.text,
    },
    /**
     * Text style for the period (e.g., "This Month") displayed in the main card.
     */
    period: {
        fontSize: 14,
        color: budgetOverviewColors.textSecondary,
        fontWeight: '500',
    },
    /**
     * Content area for the main card, centering its children.
     */
    mainCardContent: {
        alignItems: 'center',
    },
    /**
     * Text style for the large amount displayed in the main card.
     */
    mainCardAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    /**
     * Container for the main progress bar, ensuring it spans the full width
     * and centers its content.
     */
    mainProgressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    /**
     * Style for the main progress bar, inheriting from `progressBarBase`
     * and setting its height and background color.
     */
    mainProgressBar: {
        ...progressBarBase,
        height: 8,
        backgroundColor: budgetOverviewColors.planned + '20', // Lighter shade of planned color
        marginBottom: 8,
    },
    /**
     * Style for the filled portion of the main progress bar.
     */
    mainProgressFill: {
        height: '100%',
        borderRadius: 4,
    },
    /**
     * Text style for the progress percentage or status message.
     */
    progressText: {
        fontSize: 12,
        color: budgetOverviewColors.textSecondary,
        fontWeight: '500',
    },

    // === SECONDARY CARDS STYLES ===

    /**
     * Horizontal row containing the two smaller secondary cards, with spacing between them.
     */
    secondaryCardsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    /**
     * Individual secondary card style, inheriting from `cardBase` and allowing it
     * to take up equal space in the row.
     */
    secondaryCard: {
        ...cardBase,
        flex: 1,
        // TODO: Add tap interaction for detailed view
    },
    /**
     * Special styling for the "Spent" secondary card, with a light blue background
     * and a subtle border.
     */
    spentCard: {
        backgroundColor: '#F0F8FF', // Very light blue
        borderWidth: 1,
        borderColor: budgetOverviewColors.spent + '30', // Transparent blue border
    },
    /**
     * Special styling for the "Remaining" secondary card, with a light green background
     * and a subtle border.
     */
    remainingCard: {
        backgroundColor: '#F8FFFE', // Very light green
        borderWidth: 1,
        borderColor: budgetOverviewColors.remaining + '30', // Transparent teal border
    },
    /**
     * Special styling for secondary cards when the budget is "Over Budget",
     * with a light red background and a subtle border.
     */
    overBudgetCard: {
        backgroundColor: '#FFF5F5', // Very light red
        borderWidth: 1,
        borderColor: budgetOverviewColors.spending + '30', // Transparent red border
    },
    /**
     * Header style for secondary cards, arranging elements horizontally with spacing
     * and a bottom margin.
     */
    secondaryCardHeader: {
        ...headerRowBase,
        gap: 8,
        marginBottom: 12,
    },
    /**
     * Text style for the label (e.g., "Spent", "Remaining") in secondary cards.
     */
    secondaryCardLabel: {
        fontSize: 14,
        color: budgetOverviewColors.textSecondary,
        fontWeight: '600',
    },
    /**
     * Text style for the amount displayed in secondary cards, centered.
     */
    secondaryCardAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    /**
     * Container for the budget indicator (dot and text) in the spent card,
     * centering its content horizontally.
     */
    budgetIndicator: {
        ...headerRowBase,
        justifyContent: 'center',
        gap: 6,
    },
    /**
     * Style for the small colored dot in the budget indicator.
     */
    budgetDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    /**
     * Text style for the budget status (e.g., "On Track", "Over Budget").
     */
    budgetText: {
        fontSize: 12,
        fontWeight: '600',
    },
    /**
     * Container for the remaining progress bar in the remaining card, spanning
     * the full width.
     */
    remainingProgress: {
        width: '100%',
    },
    /**
     * Style for the remaining progress bar, inheriting from `progressBarBase`
     * and setting its height and background color.
     */
    remainingProgressBar: {
        ...progressBarBase,
        height: 4,
        backgroundColor: budgetOverviewColors.remaining + '20', // Lighter shade of remaining color
    },
    /**
     * Style for the filled portion of the remaining progress bar.
     */
    remainingProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
});
