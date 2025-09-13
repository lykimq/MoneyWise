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
  /**
   * @description Container for the progress bar and its associated
   * percentage text. Ensures the progress elements take full width and are
   * centered.
   * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`,
   * `moneywise-app/src/components/CategoryBudgetCard.tsx` (example usage)
   */
  container: {
    width: '100%',
    alignItems: 'center',
  },

  /**
   * @description Style for the main progress bar. Extends `progressBarBase`,
   * sets a fixed height, and uses a semi-transparent gray background.
   * Typically used in prominent dashboard cards.
   * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
   */
  bar: {
    ...progressBarBase,
    height: 8,
    backgroundColor: colors.text.secondary + '20', // 20% opacity gray
    marginBottom: spacing.sm,
  },
  /**
   * @description Style for the filled portion of the main progress bar.
   * Ensures it takes full height and maintains rounded corners.
   * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
   */
  fill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },

  /**
   * @description Style for category-specific progress bars.
   * Extends `progressBarBase`, allows it to flex and fill available space,
   * and uses a light background. Typically used within individual category
   * budget cards.
   * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx`
   * (example usage)
   */
  categoryBar: {
    ...progressBarBase,
    flex: 1, // Expands to fill available space
    height: 8,
    backgroundColor: colors.background.primary,
    marginRight: spacing.sm,
  },
  /**
   * @description Style for the filled portion of the category progress bar.
   * The background color is typically set dynamically based on the category's
   * status.
   * @usedIn `moneywise-app/src/components/CategoryBudgetCard.tsx`
   * (example usage)
   */
  categoryFill: {
    height: '100%',
    backgroundColor: colors.primary, // Dynamic color based on category
    borderRadius: borderRadius.sm,
  },

  /**
   * @description Text style for displaying percentages (e.g., "75%").
   * Uses a small, semibold typography and ensures consistent alignment with
   * a minimum width.
   * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`,
   * `moneywise-app/src/components/CategoryBudgetCard.tsx` (example usage)
   */
  percentageText: {
    ...createTextStyle('sm', 'semibold'),
    minWidth: 35, // Ensures consistent alignment
    textAlign: 'right',
  },
});
