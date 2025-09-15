/**
 * Pre-built card component styles with consistent theming and layout.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { progressBarBase } from '../base';
import { createCardStyle, createTextStyle, createRowStyle } from './utils';

// Card component styles

/**
 * Main dashboard card styles for primary budget overview display.
 */
export const mainCardStyles = StyleSheet.create({
  /**
   * Main card with large elevation and generous padding.
   */
  card: createCardStyle('xl', '2xl'),

  /**
   * Card header with horizontal layout and bottom margin.
   */
  header: {
    ...createRowStyle('md'),
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  /**
   * Title row within card header.
   */
  titleRow: createRowStyle('md'),

  /**
   * Card title with large, bold typography.
   */
  title: createTextStyle('3xl', 'bold'),
  /**
   * Period text with small, semibold, secondary typography.
   */
  period: createTextStyle('sm', 'semibold', colors.text.secondary),

  /**
   * Card content with centered alignment.
   */
  content: {
    alignItems: 'center',
  },

  /**
   * Amount display with very large, bold typography and bottom margin.
   */
  amount: {
    ...createTextStyle('4xl', 'bold'),
    marginBottom: spacing.lg,
  },

  /**
   * Progress container with full width and centered alignment.
   */
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },

  /**
   * Progress bar with specific height and bottom margin.
   */
  progressBar: {
    ...progressBarBase,
    height: 8,
    marginBottom: spacing.sm,
  },
  /**
   * Progress bar fill with full height and rounded corners.
   */
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  /**
   * Progress text with small, semibold, secondary typography.
   */
  progressText: createTextStyle('sm', 'semibold', colors.text.secondary),
});

/**
 * Secondary dashboard card styles for smaller budget cards in rows.
 */
export const secondaryCardStyles = StyleSheet.create({
  /**
   * Secondary card with medium elevation and flexible width.
   */
  card: {
    ...createCardStyle('md', 'lg'),
    flex: 1,
  },

  /**
   * Secondary card header with horizontal layout and bottom margin.
   */
  header: {
    ...createRowStyle('sm'),
    marginBottom: spacing.md,
  },

  /**
   * Card label with small, semibold, secondary typography.
   */
  label: createTextStyle('sm', 'semibold', colors.text.secondary),
  /**
   * Amount text with large, bold typography and center alignment.
   */
  amount: {
    ...createTextStyle('2xl', 'bold'),
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  /**
   * Status indicator with horizontal layout and center alignment.
   */
  indicator: {
    ...createRowStyle('xs'),
    justifyContent: 'center',
  },

  /**
   * Status indicator dot.
   */
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  /**
   * Status text with small, semibold typography.
   */
  text: createTextStyle('sm', 'semibold'),
});

/**
 * Category budget card styles for individual category items in lists.
 */
export const categoryCardStyles = StyleSheet.create({
  /**
   * Category card with small elevation and standard padding.
   */
  card: createCardStyle('sm', 'lg'),

  /**
   * Category card header with horizontal layout and bottom margin.
   */
  header: {
    ...createRowStyle('sm'),
    marginBottom: spacing.sm,
  },

  /**
   * Category info section with left margin and flexible width.
   */
  categoryInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },

  /**
   * Category name with large, semibold typography.
   */
  categoryName: createTextStyle('lg', 'semibold'),
  /**
   * Amount text with small, semibold, secondary typography.
   */
  amountText: {
    ...createTextStyle('sm', 'semibold', colors.text.secondary),
    marginTop: 2, // Tight spacing for amount comparison
  },
  /**
   * Remaining text with small, semibold, secondary typography.
   */
  remainingText: {
    ...createTextStyle('sm', 'semibold', colors.text.secondary),
    marginTop: spacing.xs, // Spacing for remaining/overspend text
  },
});

/**
 * Content card styles for text content, insights, and information.
 */
export const contentCardStyles = StyleSheet.create({
  /**
   * Content card with medium elevation and standard padding.
   */
  card: createCardStyle('md', 'lg'),

  /**
   * Content item with horizontal layout and bottom margin.
   */
  item: {
    ...createRowStyle('md'),
    marginBottom: spacing.md,
  },
  /**
   * Last content item without bottom margin.
   */
  itemLast: {
    ...createRowStyle('md'),
    marginBottom: 0,
  },

  /**
   * Content item text with small, semibold typography and flexible width.
   */
  itemText: {
    ...createTextStyle('sm', 'semibold'),
    marginLeft: spacing.md,
    flex: 1, // Takes remaining space
  },
});

/**
 * Standard card styles for common layout patterns.
 */
export const standardCardStyles = StyleSheet.create({
  /**
   * Standard card with medium elevation and padding.
   */
  card: createCardStyle('md', 'lg'),

  /**
   * Container with vertical gap between cards.
   */
  container: {
    gap: spacing.cardGap, // Vertical gap between cards
  },
  /**
   * Row layout with horizontal gap between items.
   */
  row: {
    flexDirection: 'row',
    gap: spacing.rowGap, // Horizontal gap between items
  },
});
