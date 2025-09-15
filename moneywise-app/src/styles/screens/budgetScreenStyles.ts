/**
 * Centralized styles for the Budget screen components.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';

export const budgetScreenStyles = StyleSheet.create({
  // Main container styles
  /**
   * Main container for the Budget screen with full screen layout.
   */
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // ScrollView styles
  /**
   * Main ScrollView component for scrollable content.
   */
  scrollView: {
    flex: 1,
  },

  // Loading state styles
  /**
   * Container for loading indicators with centered content.
   */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },

  /**
   * Main loading text with large typography and top margin.
   */
  loadingText: {
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },

  /**
   * Secondary loading text with small typography and top margin.
   */
  loadingSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  // Error state styles
  /**
   * Error container with full screen layout and centered content.
   */
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },

  /**
   * Error icon with bottom margin.
   */
  errorIcon: {
    marginBottom: spacing.lg,
  },

  /**
   * Error title with large typography and bottom margin.
   */
  errorTitle: {
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  /**
   * Uses theme values.secondary` for color,
   * and provides bottom margin.
   * `errorContainer`)
   */
  errorMessage: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  // Time period selector styles
  /**
   * Arranges buttons horizontally, applies a tertiary background, rounded
   * corners, and padding.
   * selection)
   */
  periodToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.lg,
  },

  /**
   * "Monthly", "Yearly"). Provides flexible width, vertical and horizontal
   * padding, rounded corners, and centers content.
   */
  periodToggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
  },

  /**
   * button. Sets the background color to `colors.primary`.
   * styling for active button)
   */
  periodToggleButtonActive: {
    backgroundColor: colors.primary,
  },

  /**
   * buttons. Sets the background to transparent.
   * styling for inactive buttons)
   */
  periodToggleButtonInactive: {
    backgroundColor: 'transparent',
  },

  /**
   * Uses theme values.semibold`
   * for font weight.
   * text)
   */
  periodToggleText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },

  /**
   * button. Sets the text color to `colors.text.inverse` (white).
   * styling for active button text)
   */
  periodToggleTextActive: {
    color: colors.text.inverse,
  },

  /**
   * buttons. Sets the text color to `colors.text.secondary`.
   * styling for inactive button text)
   */
  periodToggleTextInactive: {
    color: colors.text.secondary,
  },

  // Spinner container
  /**
   * period selector. Provides functionality.
   * for period change)
   */
  spinnerContainer: {
    marginLeft: spacing.sm,
  },
});
