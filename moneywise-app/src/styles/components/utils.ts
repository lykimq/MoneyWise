/**
 * Dynamic style generation functions with type-safe, reusable style creation.
 */

import { ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, shadows, typography } from '../theme';
import { cardBase } from '../base';

// Style utility functions

/**
 * Creates a card style with customizable elevation and padding.
 */
export const createCardStyle = (
  elevation: 'sm' | 'md' | 'xl' = 'md',
  padding: keyof typeof spacing = 'lg'
): ViewStyle => ({
  ...cardBase,
  padding: spacing[padding],
  ...shadows[elevation],
});

/**
 * Creates text styles with customizable size, weight, and color from theme.
 */
export const createTextStyle = (
  size: keyof typeof typography.sizes,
  weight: keyof typeof typography.weights = 'semibold',
  color: string = colors.text.primary
): TextStyle => ({
  fontSize: typography.sizes[size],
  fontWeight: typography.weights[weight],
  color,
});

/**
 * Creates row layout styles with customizable spacing between items.
 */
export const createRowStyle = (
  gap: keyof typeof spacing = 'md'
): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[gap],
});
