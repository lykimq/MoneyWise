/**
 * Progress bar component styles with consistent theming and visual hierarchy.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { progressBarBase } from '../base';
import { createTextStyle } from './utils';

// Progress bar component styles

/**
 * Progress bar styles for visual progress indication.
 */
export const progressBarStyles = StyleSheet.create({
  /**
   * Container for progress bar and percentage text with full width and centering.
   */
  container: {
    width: '100%',
    alignItems: 'center',
  },

  /**
   * Main progress bar with fixed height and semi-transparent background.
   */
  bar: {
    ...progressBarBase,
    height: 8,
    backgroundColor: colors.text.secondary + '20', // 20% opacity gray
    marginBottom: spacing.sm,
  },
  /**
   * Progress bar fill with full height and rounded corners.
   */
  fill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },

  /**
   * Category progress bar that flexes to fill available space.
   */
  categoryBar: {
    ...progressBarBase,
    flex: 1, // Expands to fill available space
    height: 8,
    backgroundColor: colors.background.primary,
    marginRight: spacing.sm,
  },
  /**
   * Category progress bar fill with dynamic background color.
   */
  categoryFill: {
    height: '100%',
    backgroundColor: colors.primary, // Dynamic color based on category
    borderRadius: borderRadius.sm,
  },

  /**
   * Percentage text with consistent alignment and minimum width.
   */
  percentageText: {
    ...createTextStyle('sm', 'semibold'),
    minWidth: 35, // Ensures consistent alignment
    textAlign: 'right',
  },
});
