import { StyleSheet } from 'react-native';
import { cardBase, headerRowBase } from './baseStyles';
import { financialDashboardColors } from './colors';
import { genericProgressBarBase, progressFillBase } from './progressBarStyles';

/**
 * Styles for the Main Financial Dashboard Card Component (Total Spent).
 * These styles create a visually appealing dashboard layout for key financial metrics,
 * utilizing clear hierarchy, progress indicators, and modern card design.
 */
export const mainFinancialCardStyles = StyleSheet.create({
    /**
     * Main card style for the "Total Spent" section.
     * Inherits common card properties from `cardBase` but with enhanced visual prominence
     * (larger border radius, more padding, and a more pronounced shadow) to highlight its importance.
     */
    mainCard: {
        ...cardBase,
        borderRadius: 20, // Slightly larger border radius for main card
        padding: 24,      // More padding for main card
        shadowOffset: { width: 0, height: 6 }, // Enhanced shadow for prominence
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
        // TODO: Add tap interaction for detailed breakdown
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
     * Row style for the title and icon within the main card header, with consistent spacing.
     */
    mainCardTitleRow: {
        ...headerRowBase,
        gap: 12,
    },
    /**
     * Text style for the main card's title (e.g., "Total Spent").
     */
    mainCardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: financialDashboardColors.text,
    },
    /**
     * Text style for the period (e.g., "This Month") displayed in the main card.
     */
    period: {
        fontSize: 14,
        color: financialDashboardColors.textSecondary,
        fontWeight: '500',
    },
    /**
     * Content area for the main card, centering its children horizontally.
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
     * Style for the main progress bar, inheriting from `genericProgressBarBase`
     * and setting its height and a lighter shade of the spending background color.
     */
    mainProgressBar: {
        ...genericProgressBarBase,
        backgroundColor: financialDashboardColors.spending + '20', // Lighter shade of spending color
    },
    /**
     * Style for the filled portion of the main progress bar.
     */
    mainProgressFill: {
        ...progressFillBase,
    },
    /**
     * Text style for the progress percentage or status message in the main card.
     */
    progressText: {
        fontSize: 12,
        color: financialDashboardColors.textSecondary,
        fontWeight: '500',
    },
});
