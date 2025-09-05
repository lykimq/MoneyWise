/**
 * Progress Bar Component Styles
 *
 * Styles for visual progress indicators used throughout the MoneyWise app.
 * Includes main progress bars, category progress bars, and percentage displays
 * with consistent theming and visual hierarchy.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { progressBarBase } from '../base';
import { createTextStyle } from './utils';

// ============================================================================
// 📊 PROGRESS BAR COMPONENT STYLES - Visual Progress Indicators
// ============================================================================

/**
 * Progress Bar Styles
 *
 * Used for visual progress indication throughout the app:
 * - Budget spending progress (main cards)
 * - Category spending progress (category cards)
 * - Percentage display with consistent formatting
 *
 * Features: 8px height, rounded corners, theme colors, flexible width
 * Usage: <View style={progressBarStyles.container}> for progress sections
 */
export const progressBarStyles = StyleSheet.create({
    // Container for progress bar and percentage text
    container: {
        width: '100%',
        alignItems: 'center',
    },

    // Main progress bar (used in main dashboard cards)
    bar: {
        ...progressBarBase,
        height: 8,
        backgroundColor: colors.text.secondary + '20',  // 20% opacity gray
        marginBottom: spacing.sm,
    },
    fill: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },

    // Category progress bar (used in category cards)
    categoryBar: {
        ...progressBarBase,
        flex: 1,  // Expands to fill available space
        height: 8,
        backgroundColor: colors.background.primary,
        marginRight: spacing.sm,
    },
    categoryFill: {
        height: '100%',
        backgroundColor: colors.primary,  // Dynamic color based on category
        borderRadius: borderRadius.sm,
    },

    // Percentage text (e.g., "75%")
    percentageText: {
        ...createTextStyle('sm', 'semibold'),
        minWidth: 35,  // Ensures consistent alignment
        textAlign: 'right',
    },
});
