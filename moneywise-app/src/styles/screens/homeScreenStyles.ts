import { StyleSheet } from 'react-native';
import { colors } from '../index'; // Assuming index.ts exports colors

/**
 * REUSABLE STYLE OBJECTS
 *
 * Extract common patterns into reusable objects
 * This prevents duplication and ensures consistency
 */
const cardShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
};

/**
 * STYLES ORGANIZATION
 *
 * Organized by hierarchy and purpose:
 * 1. Layout styles (container, sections)
 * 2. Component-specific styles (grouped by component)
 * 3. Text styles
 * 4. Interactive element styles
 */
export const homeScreenStyles = StyleSheet.create({
    // === LAYOUT STYLES ===

    /**
     * @description Main container for the HomeScreen.
     * Defines the overall screen layout, taking up full available space.
     * Uses `colors.background.primary` for a light gray background.
     * @usedIn `HomeScreen.tsx` (SafeAreaView)
     */
    container: {
        flex: 1,
        backgroundColor: colors.background.primary, // Light gray background
    },

    /**
     * @description Style for the scrollable content area of the HomeScreen.
     * Allows content to extend beyond the screen height and be scrolled.
     * @usedIn `HomeScreen.tsx` (ScrollView)
     */
    scrollView: {
        flex: 1,
    },

    /**
     * @description Generic section container style.
     * Provides consistent horizontal padding and vertical spacing for major
     * sections on the HomeScreen.
     * @usedIn `HomeScreen.tsx` (CategorySpendingSection,
     * RecentTransactionsSection, UpcomingBillsSection)
     */
    section: {
        paddingHorizontal: 20,      // Consistent horizontal padding
        paddingVertical: 15,        // Vertical spacing between sections
    },


    // === TEXT STYLES ===

    /**
     * @description Style for section headers.
     * Ensures consistent styling for titles of different sections
     * (e.g., "Spending by Category").
     * @usedIn `CategorySpendingSection.tsx`, `RecentTransactionsSection.tsx`,
     * `UpcomingBillsSection.tsx`
     */
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 15,
    },

    // === FLOATING ACTION BUTTON STYLES ===

    /**
     * @description Style for the Floating Action Button (FAB).
     * Positions the button absolutely at the bottom-right of the screen.
     * Provides standard FAB size, circular shape, primary background color,
     * and a shadow for elevation. `zIndex` ensures it stays on top.
     * @usedIn `HomeScreen.tsx` (FloatingActionButton component)
     */
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,                 // Standard FAB size
        height: 56,
        borderRadius: 28,          // Perfect circle
        backgroundColor: colors.primary, // iOS blue for primary action
        justifyContent: 'center',
        alignItems: 'center',
        ...cardShadow,             // Reuse shadow for elevation
        zIndex: 1000,              // Ensure it stays on top
    },

    // === CATEGORY SECTION STYLES ===

    /**
     * @description Container style for the spending by category chart.
     * Applies a card-like appearance with rounded corners, background color,
     * padding, and a shadow. Centers the chart content horizontally.
     * @usedIn `CategorySpendingSection.tsx`
     */
    chartContainer: {
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        padding: 30,
        marginBottom: 15,
        alignItems: 'center', // Center the chart
        ...cardShadow, // Reusable shadow style (defined below)
    },

    /**
     * @description Wrapper for the pie chart to ensure proper centering and
     * overflow handling.
     * @usedIn `CategorySpendingSection.tsx`
     */
    pieChartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
        overflow: 'visible',
    },

    /**
     * @description Placeholder style for when chart data is loading or empty.
     * Centers content and sets a fixed height.
     * @usedIn `CategorySpendingSection.tsx`
     */
    chartPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },

    /**
     * @description Text style for the chart placeholder message.
     * @usedIn `CategorySpendingSection.tsx`
     */
    chartPlaceholderText: {
        marginTop: 10,
        color: colors.text.secondary,
        fontSize: 14,
    },

    /**
     * @description Container for the category legend items, arranged in a grid
     * layout. Uses `flexWrap` to allow items to wrap to the next line and
     * `justifyContent` for spacing.
     * @usedIn `CategorySpendingSection.tsx`
     */
    categoryLegendGrid: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },

    /**
     * @description Style for an individual legend item within the category grid.
     * Arranges content vertically, centers items, and applies background,
     * padding, and rounded corners. `minWidth` and `maxWidth` help with
     * responsive layout.
     * @usedIn `CategoryLegendItem.tsx`
     */
    legendItem: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.background.tertiary,
        borderRadius: 8,
        minWidth: 80,
        maxWidth: 120,
        flex: 1,
    },

    /**
     * @description Style for the color indicator circle in each legend item.
     * @usedIn `CategoryLegendItem.tsx`
     */
    legendColorIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginBottom: 6,
    },

    /**
     * @description Style for the category name text in the legend.
     * @usedIn `CategoryLegendItem.tsx`
     */
    legendName: {
        fontSize: 12,
        color: colors.text.primary,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 2,
    },

    /**
     * @description Style for the amount text in the legend.
     * @usedIn `CategoryLegendItem.tsx`
     */
    legendAmount: {
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },

    /**
     * @description Style for the percentage text in the legend.
     * @usedIn `CategoryLegendItem.tsx`
     */
    legendPercentage: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: '600',
        textAlign: 'center',
    },

    /**
     * @description Container for a list of categories.
     * Provides spacing between individual category items.
     * (Note: Marked as legacy as the primary category display now uses
     * `categoryLegendGrid`).
     * @usedIn `CategoryItem.tsx` (though `CategorySpendingSection` now uses
     * `categoryLegendGrid`)
     */
    categoryList: {
        gap: 10, // Space between category items
    },

    /**
     * @description Style for an individual category item.
     * Arranges icon and text horizontally with spacing.
     * (Note: Marked as legacy as the primary category display now uses
     * `legendItem`).
     * @usedIn `CategoryItem.tsx`
     */
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    /**
     * @description Text style for category names.
     * @usedIn `CategoryItem.tsx`
     */
    categoryText: {
        fontSize: 14,
        color: colors.text.primary,
    },

    // === TRANSACTION SECTION STYLES ===

    /**
     * @description Container for the list of recent transactions.
     * Provides spacing between individual transaction items.
     * @usedIn `RecentTransactionsSection.tsx`
     */
    transactionList: {
        gap: 10,
    },

    /**
     * @description Style for an individual transaction item.
     * Displays icon, details, and amount horizontally with card-like styling
     * and shadow.
     * @usedIn `TransactionItem.tsx`
     */
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: 15,
        borderRadius: 12,
        ...cardShadow,
    },

    /**
     * @description Style for the transaction icon, providing right margin for
     * spacing.
     * @usedIn `TransactionItem.tsx`
     */
    transactionIcon: {
        marginRight: 15,
    },

    /**
     * @description Style for the transaction details (title and time).
     * Takes up remaining horizontal space.
     * @usedIn `TransactionItem.tsx`
     */
    transactionDetails: {
        flex: 1, // Take remaining space
    },

    /**
     * @description Style for the transaction title.
     * @usedIn `TransactionItem.tsx`
     */
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },

    /**
     * @description Style for the transaction time.
     * @usedIn `TransactionItem.tsx`
     */
    transactionTime: {
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: 2,
    },

    /**
     * @description Style for the transaction amount.
     * Note: The color is set dynamically based on the amount (income/expense).
     * @usedIn `TransactionItem.tsx`
     */
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        // Color is set dynamically
    },

    // === BILLS SECTION STYLES ===

    /**
     * @description Container for the list of upcoming bills.
     * Provides spacing between individual bill items.
     * @usedIn `UpcomingBillsSection.tsx`
     */
    billsList: {
        gap: 10,
    },

    /**
     * @description Style for an individual bill item.
     * Displays icon and text horizontally with card-like styling and shadow.
     * @usedIn `BillItem.tsx`
     */
    billItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: 15,
        borderRadius: 12,
        gap: 10,
        ...cardShadow,
    },

    /**
     * @description Text style for bill descriptions.
     * @usedIn `BillItem.tsx`
     */
    billText: {
        fontSize: 14,
        color: colors.text.primary,
    },
});
