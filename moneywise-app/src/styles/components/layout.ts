/**
 * Layout component styles with consistent spacing and theming.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { createTextStyle } from './utils';

// Layout component styles

/**
 * Section container styles for consistent layout across screens.
 */
export const sectionStyles = StyleSheet.create({
  /**
   * Section container with consistent horizontal and vertical padding.
   */
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  /**
   * Section title with large, bold typography and bottom margin.
   */
  title: {
    ...createTextStyle('xl', 'bold'),
    marginBottom: spacing.lg,
  },
});


/**
 * Card variant styles for different budget states with color-coded backgrounds.
 */
export const cardVariants = StyleSheet.create({
  /**
   * Spent card variant with light blue background and border.
   */
  spent: {
    backgroundColor: colors.card.spent,
    borderWidth: 1,
    borderColor: colors.savings + '30', // 30% opacity blue border
  },
  /**
   * Remaining card variant with light green background and border.
   */
  remaining: {
    backgroundColor: colors.card.remaining,
    borderWidth: 1,
    borderColor: colors.remaining + '30', // 30% opacity teal border
  },
  /**
   * Over budget card variant with light red background and border.
   */
  overBudget: {
    backgroundColor: colors.card.overBudget,
    borderWidth: 1,
    borderColor: colors.spending + '30', // 30% opacity red border
  },
});
