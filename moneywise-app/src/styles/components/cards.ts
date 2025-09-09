/**
 * Card Component Styles
 *
 * Pre-built styles for all card components in the MoneyWise app.
 * Includes main dashboard cards, secondary cards, category cards,
 * and content cards with consistent theming and layout.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { progressBarBase } from '../base';
import { createCardStyle, createTextStyle, createRowStyle } from './utils';

// ============================================================================
// 🎴 CARD COMPONENT STYLES - Pre-built UI Components
// ============================================================================

/**
 * Main Dashboard Card Styles
 *
 * Used for the primary budget overview card that displays:
 * - Planned budget amount (large, prominent)
 * - Spending progress with visual bar
 * - Period information and status
 *
 * Features: Extra elevation (xl shadow), large padding (2xl), centered content
 * Usage: <View style={mainCardStyles.card}> for the main budget card
 */
export const mainCardStyles = StyleSheet.create({
    /**
     * @description Primary card container style with maximum visual prominence.
     * Applies a large card style with extra elevation and generous padding.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    card: createCardStyle('xl', '2xl'),

    /**
     * @description Header section style for the main dashboard card.
     * Arranges items horizontally with space between them and provides bottom
     * margin.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    header: {
        ...createRowStyle('md'),
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },

    /**
     * @description Row style for the icon and title text within the card
     * header.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    titleRow: createRowStyle('md'),

    /**
     * @description Text style for the main title of the dashboard card.
     * Uses a large, bold typography.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    title: createTextStyle('3xl', 'bold'),
    /**
     * @description Text style for the period label (e.g., "This Month") on the
     * dashboard card. Uses a small, semibold, secondary-colored typography.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    period: createTextStyle('sm', 'semibold', colors.text.secondary),

    /**
     * @description Content area style for the main dashboard card.
     * Centers its content horizontally.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    content: {
        alignItems: 'center',
    },

    /**
     * @description Style for the large amount display (e.g., "$1,234.56") on
     * the dashboard card. Uses a very large, bold typography with bottom
     * margin.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    amount: {
        ...createTextStyle('4xl', 'bold'),
        marginBottom: spacing.lg,
    },

    /**
     * @description Container for the progress bar and percentage text.
     * Ensures the progress elements take full width and are centered.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },

    /**
     * @description Base style for the progress bar itself.
     * Extends `progressBarBase` and sets a specific height and bottom margin.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    progressBar: {
        ...progressBarBase,
        height: 8,
        marginBottom: spacing.sm,
    },
    /**
     * @description Style for the filled portion of the progress bar.
     * Ensures it takes full height and maintains rounded corners.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    progressFill: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
    /**
     * @description Text style for the progress percentage or status.
     * Uses a small, semibold, secondary-colored typography.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    progressText: createTextStyle('sm', 'semibold', colors.text.secondary),
});

/**
 * Secondary Dashboard Card Styles
 *
 * Used for smaller budget cards displayed in rows (e.g., "Spent", "Remaining"):
 * - Compact layout with flex: 1 for equal width distribution
 * - Icon, label, amount, and status indicator
 * - Status dot with color-coded budget health
 *
 * Features: Standard elevation, flexible width, centered content
 * Usage: <View style={secondaryCardStyles.card}> for spent/remaining cards
 */
export const secondaryCardStyles = StyleSheet.create({
    /**
     * @description Card container style for secondary dashboard cards.
     * Applies a medium card style with standard elevation and allows the card
     * to expand to fill available space in a row.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx` (for
     * "Spent" and "Remaining" cards)
     */
    card: {
        ...createCardStyle('md', 'lg'),
        flex: 1,
    },

    /**
     * @description Header style for secondary cards, containing an icon and
     * label. Arranges items horizontally with small spacing and bottom margin.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    header: {
        ...createRowStyle('sm'),
        marginBottom: spacing.md,
    },

    /**
     * @description Text style for the label of secondary cards (e.g., "Spent",
     * "Remaining"). Uses a small, semibold, secondary-colored typography.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    label: createTextStyle('sm', 'semibold', colors.text.secondary),
    /**
     * @description Text style for the amount displayed on secondary cards.
     * Uses a large, bold typography, centered, with bottom margin.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    amount: {
        ...createTextStyle('2xl', 'bold'),
        marginBottom: spacing.md,
        textAlign: 'center',
    },

    /**
     * @description Style for the status indicator row (dot + text).
     * Arranges items horizontally with extra-small spacing and centers them.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    indicator: {
        ...createRowStyle('xs'),
        justifyContent: 'center',
    },

    /**
     * @description Style for the small circular status dot.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    /**
     * @description Text style for the status message (e.g., "On Track", "Over
     * Budget"). Uses a small, semibold typography.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     */
    text: createTextStyle('sm', 'semibold'),
});

/**
 * Category Budget Card Styles
 *
 * Used for individual category budget items in lists (e.g., "Groceries",
 * "Transportation"):
 * - Category icon, name, and spending amounts
 * - Progress bar showing spending vs budget
 * - Remaining budget or overspend amount
 *
 * Features: Subtle elevation, horizontal layout, progress indication
 * Usage: <View style={categoryCardStyles.card}> for category budget items
 */
export const categoryCardStyles = StyleSheet.create({
    /**
     * @description Card container style for individual category budget items.
     * Applies a small card style with subtle shadow and standard padding.
     * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx` (example
     * usage, actual usage may vary)
     */
    card: createCardStyle('sm', 'lg'),

    /**
     * @description Header row style for category cards, containing the category
     * icon and information. Arranges items horizontally with small spacing and
     * bottom margin.
     * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx`
     */
    header: {
        ...createRowStyle('sm'),
        marginBottom: spacing.sm,
    },

    /**
     * @description Style for the category information section (name + amounts).
     * Provides left margin and takes up remaining horizontal space.
     * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx`
     */
    categoryInfo: {
        marginLeft: spacing.lg,
        flex: 1,
    },

    /**
     * @description Text style for the category name (e.g., "Groceries").
     * Uses a large, semibold typography.
     * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx`
     */
    categoryName: createTextStyle('lg', 'semibold'),
    /**
     * @description Text style for the amount comparison (e.g., "$100 / $200").
     * Uses a small, semibold, secondary-colored typography with tight top
     * margin.
     * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx`
     */
    amountText: {
        ...createTextStyle('sm', 'semibold', colors.text.secondary),
        marginTop: 2,  // Tight spacing for amount comparison
    },
    /**
     * @description Text style for the remaining budget or overspend amount.
     * Uses a small, semibold, secondary-colored typography with top margin.
     * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx`
     */
    remainingText: {
        ...createTextStyle('sm', 'semibold', colors.text.secondary),
        marginTop: spacing.xs,  // Spacing for remaining/overspend text
    },
});

/**
 * Content Card Styles
 *
 * Used for cards that display text content, insights, or information:
 * - Budget insights section
 * - Information cards with lists
 * - Text-heavy content with consistent spacing
 *
 * Features: Standard elevation, list item layout, flexible text
 * Usage: <View style={contentCardStyles.card}> for content cards
 */
export const contentCardStyles = StyleSheet.create({
    /**
     * @description Card container style for content cards.
     * Applies a medium card style with standard elevation and padding.
     * @usedIn `moneywise-app/src/components/BudgetInsightsCard.tsx` (example
     * usage, actual usage may vary)
     */
    card: createCardStyle('md', 'lg'),

    /**
     * @description Style for a generic list item within a content card.
     * Arranges items horizontally with medium spacing and bottom margin.
     * @usedIn `moneywise-app/src/components/BudgetInsightsCard.tsx`
     */
    item: {
        ...createRowStyle('md'),
        marginBottom: spacing.md,
    },
    /**
     * @description Style for the last list item within a content card.
     * Similar to `item` but without bottom margin to prevent extra spacing at
     * the end of a list.
     * @usedIn `moneywise-app/src/components/BudgetInsightsCard.tsx`
     */
    itemLast: {
        ...createRowStyle('md'),
        marginBottom: 0,
    },

    /**
     * @description Text style for content card list items.
     * Uses a small, semibold typography, with left margin and takes up
     * remaining horizontal space.
     * @usedIn `moneywise-app/src/components/BudgetInsightsCard.tsx`
     */
    itemText: {
        ...createTextStyle('sm', 'semibold'),
        marginLeft: spacing.md,
        flex: 1,  // Takes remaining space
    },
});

/**
 * Standard Card Styles
 *
 * Used for common layout patterns throughout the app:
 * - Card containers with consistent spacing
 * - Row and column layouts with proper gaps
 * - Reusable layout components
 *
 * Features: Consistent spacing, flexible layouts, theme integration
 * Usage: <View style={standardCardStyles.container}> for layout containers
 */
export const standardCardStyles = StyleSheet.create({
    /**
     * @description Standard card appearance.
     * Applies a medium card style with standard elevation and padding.
     * @usedIn `moneywise-app/src/components/SomeStandardCard.tsx` (example
     * usage, actual usage may vary)
     */
    card: createCardStyle('md', 'lg'),

    /**
     * @description Layout container style with vertical gap between cards.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (for arranging
     * multiple cards)
     */
    container: {
        gap: spacing.cardGap,  // Vertical gap between cards
    },
    /**
     * @description Row layout style with horizontal gap between items.
     * @usedIn Various components for horizontal arrangement of elements.
     */
    row: {
        flexDirection: 'row',
        gap: spacing.rowGap,  // Horizontal gap between items
    },
});
