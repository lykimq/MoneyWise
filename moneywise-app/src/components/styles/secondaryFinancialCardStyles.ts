import { StyleSheet } from 'react-native';
import { cardBase, headerRowBase } from './baseStyles';
import { financialDashboardColors } from './colors';
import { genericProgressBarBase, progressFillBase } from './progressBarStyles';

/**
 * Styles for the Secondary Financial Dashboard Cards Component (Remaining and Savings).
 * These styles define the layout and appearance of the smaller cards, including
 * their headers, amounts, and progress bars.
 */
export const secondaryFinancialCardStyles = StyleSheet.create({
    /**
     * Horizontal row containing the two smaller secondary cards, with consistent spacing between them.
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
     * Special styling for the "Remaining" card, with a light green background
     * and a subtle border to visually distinguish it.
     */
    remainingCard: {
        backgroundColor: '#F8FFFE', // Very light green
        borderWidth: 1,
        borderColor: financialDashboardColors.remaining + '30', // Transparent teal border
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
     * Text style for the label (e.g., "Remaining", "Savings") in secondary cards.
     */
    secondaryCardLabel: {
        fontSize: 14,
        color: financialDashboardColors.textSecondary,
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
     * Container for the remaining progress bar, ensuring it spans the full width
     * and centers its content.
     */
    remainingProgressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    /**
     * Style for the remaining progress bar, inheriting from `genericProgressBarBase`
     * and setting its height and a lighter shade of the remaining background color.
     */
    remainingProgressBar: {
        ...genericProgressBarBase,
        backgroundColor: financialDashboardColors.remaining + '20', // Lighter shade of remaining color
    },
    /**
     * Style for the filled portion of the remaining progress bar.
     */
    remainingProgressFill: {
        ...progressFillBase,
    },

    /**
     * Container for the savings progress bar, ensuring it spans the full width.
     */
    savingsProgress: {
        width: '100%',
    },
    /**
     * Style for the savings progress bar, inheriting from `genericProgressBarBase`
     * and setting its height and a lighter shade of the savings background color.
     */
    savingsProgressBar: {
        ...genericProgressBarBase,
        height: 4, // Savings progress bar might be thinner
        backgroundColor: financialDashboardColors.savings + '20', // Lighter shade of savings color
    },
    /**
     * Style for the filled portion of the savings progress bar.
     */
    savingsProgressFill: {
        ...progressFillBase,
        borderRadius: 2, // Smaller border radius for thinner bar
    },
});
