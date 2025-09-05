import { StyleSheet, ViewStyle } from 'react-native';

/**
 * Color constants for the FinancialDashboardCard, matching the app's theme.
 * These colors are specific to the metrics displayed in this card.
 */
export const financialDashboardColors = {
    primary: '#007AFF',      // iOS blue - General primary color
    spending: '#FF6B6B',     // Red for expenses - Highlights spent amounts
    remaining: '#4ECDC4',    // Teal for remaining budget - Indicates available funds
    savings: '#45B7D1',      // Blue for savings - Represents saved amounts
    text: '#333',            // Primary text color - Dark gray for main text
    textSecondary: '#666',   // Secondary text color - Lighter gray for descriptive text
    background: '#F8F9FA',   // Light gray background - General screen background
    white: '#FFFFFF',        // White background for cards - Used for card backgrounds
} as const;

// Reusable base style for cards, defining common properties like background,
// border radius, padding, and subtle shadow for a lifted effect.
const cardBase: ViewStyle = {
    backgroundColor: financialDashboardColors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
};

// Reusable base style for horizontal header rows, ensuring consistent alignment
// of items within headers.
const headerRowBase: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
};

/**
 * Generic styles for a progress bar component.
 * These are extracted to be reusable across different progress bar instances.
 */
const progressContainerBase: ViewStyle = {
    width: '100%',
    alignItems: 'center',
};

const genericProgressBarBase: ViewStyle = {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    height: 8, // Default height for progress bars
    backgroundColor: financialDashboardColors.textSecondary + '20', // Default light background
    marginBottom: 8,
};

const progressFillBase: ViewStyle = {
    height: '100%',
    borderRadius: 4,
};

/**
 * Styles for the FinancialDashboardCard Component.
 * These styles create a visually appealing dashboard layout for key financial metrics,
 * utilizing clear hierarchy, progress indicators, and modern card design.
 */
export const financialDashboardCardStyles = StyleSheet.create({
    /**
     * Main container for the entire financial dashboard card.
     * Provides overall layout, horizontal margins, vertical spacing, and consistent gap between elements.
     */
    dashboardContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
        gap: 15,
    },

    // === MAIN CARD STYLES (for Total Spent) ===

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

    // === GENERIC PROGRESS BAR STYLES (for the reusable ProgressBar component) ===
    /**
     * Generic container for the ProgressBar component.
     */
    progressContainer: {
        ...progressContainerBase,
    },
    /**
     * Generic style for the ProgressBar component's bar.
     */
    progressBar: {
        ...genericProgressBarBase,
    },
    /**
     * Generic style for the filled portion of the ProgressBar component.
     */
    progressFill: {
        ...progressFillBase,
    },

    // === SECONDARY CARDS STYLES (for Remaining and Savings) ===

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
