/**
 * Base styles that form the foundation for all components.
 */

import { ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './theme';

/**
 * Base card style with background, border radius, padding, and shadow.
 */
export const cardBase: ViewStyle = {
  backgroundColor: colors.background.secondary,
  borderRadius: borderRadius.xl,
  padding: spacing.lg,
  ...shadows.md,
};

/**
 * Base style for horizontal header rows with consistent alignment.
 */
export const headerRowBase: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

/**
 * Base style for progress bars with width, border radius, and overflow.
 */
export const progressBarBase: ViewStyle = {
  width: '100%',
  borderRadius: borderRadius.sm,
  overflow: 'hidden',
};

/**
 * Base style for buttons with consistent padding and border radius.
 */
export const buttonBase: ViewStyle = {
  paddingHorizontal: spacing['2xl'],
  paddingVertical: spacing.md,
  borderRadius: borderRadius.md,
  alignItems: 'center',
  justifyContent: 'center',
};
