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
    // Primary card container with maximum visual prominence
    card: createCardStyle('xl', '2xl'),

    // Header section with icon, title, and period info
    header: {
        ...createRowStyle('md'),
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },

    // Row containing icon and title text
    titleRow: createRowStyle('md'),

    // Typography for card elements
    title: createTextStyle('3xl', 'bold'),                    // Large card title
    period: createTextStyle('sm', 'semibold', colors.text.secondary), // Period label

    // Content area with centered alignment
    content: {
        alignItems: 'center',
    },

    // Large amount display (e.g., "$1,234.56")
    amount: {
        ...createTextStyle('4xl', 'bold'),
        marginBottom: spacing.lg,
    },

    // Container for progress bar and percentage
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },

    // Progress bar elements
    progressBar: {
        ...progressBarBase,
        height: 8,
        marginBottom: spacing.sm,
    },
    progressFill: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
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
    // Card container that expands to fill available space
    card: {
        ...createCardStyle('md', 'lg'),
        flex: 1,
    },

    // Header with icon and label
    header: {
        ...createRowStyle('sm'),
        marginBottom: spacing.md,
    },

    // Typography for secondary card elements
    label: createTextStyle('sm', 'semibold', colors.text.secondary),  // Card label (e.g., "Spent")
    amount: {
        ...createTextStyle('2xl', 'bold'),
        marginBottom: spacing.md,
        textAlign: 'center',
    },

    // Status indicator row (dot + text)
    indicator: {
        ...createRowStyle('xs'),
        justifyContent: 'center',
    },

    // Status dot (8x8px circle)
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    // Status text (e.g., "On Track", "Over Budget")
    text: createTextStyle('sm', 'semibold'),
});

/**
 * Category Budget Card Styles
 *
 * Used for individual category budget items in lists (e.g., "Groceries", "Transportation"):
 * - Category icon, name, and spending amounts
 * - Progress bar showing spending vs budget
 * - Remaining budget or overspend amount
 *
 * Features: Subtle elevation, horizontal layout, progress indication
 * Usage: <View style={categoryCardStyles.card}> for category budget items
 */
export const categoryCardStyles = StyleSheet.create({
    // Category card container with subtle shadow
    card: createCardStyle('sm', 'lg'),

    // Header row with category icon and info
    header: {
        ...createRowStyle('sm'),
        marginBottom: spacing.sm,
    },

    // Category information section (name + amounts)
    categoryInfo: {
        marginLeft: spacing.lg,
        flex: 1,
    },

    // Typography for category elements
    categoryName: createTextStyle('lg', 'semibold'),  // Category name (e.g., "Groceries")
    amountText: {
        ...createTextStyle('sm', 'semibold', colors.text.secondary),
        marginTop: 2,  // Tight spacing for amount comparison
    },
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
    // Content card container
    card: createCardStyle('md', 'lg'),

    // List item layout (with bottom margin)
    item: {
        ...createRowStyle('md'),
        marginBottom: spacing.md,
    },
    // Last list item (no bottom margin)
    itemLast: {
        ...createRowStyle('md'),
        marginBottom: 0,
    },

    // Content text with flexible width
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
    // Standard card appearance
    card: createCardStyle('md', 'lg'),

    // Layout containers using utility functions
    container: {
        gap: spacing.cardGap,  // Vertical gap between cards
    },
    row: {
        flexDirection: 'row',
        gap: spacing.rowGap,  // Horizontal gap between items
    },
});
