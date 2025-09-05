import { StyleSheet, ViewStyle } from 'react-native';

/**
 * Screen-level styles for the main BudgetsScreen container and layout.
 * These styles are used for the overall structure and common elements of the BudgetsScreen.
 */
export const screenStyles = StyleSheet.create({
    /**
     * Main container for the entire screen, ensuring it takes full available space
     * and sets a light gray background.
     */
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Light gray background
    },
    /**
     * Style for scrollable content areas, allowing content to expand vertically.
     */
    scrollContainer: {
        flex: 1,
    },
    /**
     * Container for messages that need to be centered on the screen,
     * such as loading indicators or error messages.
     */
    centeredMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    /**
     * Text style for loading messages.
     */
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    /**
     * Text style for secondary or descriptive text.
     */
    subText: {
        marginTop: 8,
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    /**
     * Text style specifically for displaying error messages.
     */
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
});

/**
 * Color constants matching the existing app theme with budget-specific colors.
 * These colors are used consistently across the budget overview section for visual coherence.
 */
export const budgetOverviewColors = {
    primary: '#007AFF',      // iOS blue - A general primary color
    planned: '#4ECDC4',      // Teal for planned budget - Represents the target budget
    spent: '#45B7D1',        // Blue for spent amount - Indicates money already used
    remaining: '#4ECDC4',    // Teal for remaining budget - Shows available funds (same as planned for consistency)
    spending: '#FF6B6B',     // Red for over budget - Alerts when spending exceeds planned
    text: '#333',            // Primary text color - Dark gray for main text
    textSecondary: '#666',   // Secondary text color - Lighter gray for less prominent text
    background: '#F8F9FA',   // Light gray background - General screen background
    white: '#FFFFFF',        // White background for cards - Used for card backgrounds
} as const;

/**
 * Reusable base style for cards, defining common properties like background,
 * border radius, padding, and subtle shadow for a lifted effect.
 */
const cardBase: ViewStyle = {
    backgroundColor: budgetOverviewColors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
};

/**
 * Reusable base style for horizontal header rows, ensuring consistent alignment
 * of items within headers.
 */
const headerRowBase: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
};

/**
 * Reusable base style for progress bars, defining common properties like width,
 * border radius, and overflow behavior.
 */
const progressBarBase: ViewStyle = {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
};

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

/**
 * Section container styles used across different budget components.
 * These provide consistent padding and title styling for various sections on the budget screen.
 */
export const sectionStyles = StyleSheet.create({
    /**
     * General container for a section, providing horizontal and vertical padding.
     */
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    /**
     * Style for section titles, ensuring consistent font size, weight, and color.
     */
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
});

/**
 * Interactive button styles for actions like retry.
 * These styles define the appearance of actionable buttons within the budget screen.
 */
export const buttonStyles = StyleSheet.create({
    /**
     * Style for a primary action button, with a blue background, padding, and rounded corners.
     */
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    /**
     * Text style for the button label, ensuring white color and bold font.
     */
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
