/**
 * Button component styles with consistent theming and visual states.
 */

import { StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { buttonBase } from '../base';
import { createTextStyle } from './utils';

// Button component styles

/**
 * Button styles for primary and secondary actions with consistent theming.
 */
export const buttonStyles = StyleSheet.create({
  /**
   * primary brand color as the background. Used for main actions and calls
   * to action.
   * actual usage may vary)
   */
  primary: {
    ...buttonBase,
    backgroundColor: colors.primary,
  },
  /**
   * utility to define large, semibold, inverse-colored text, centered.
   */
  primaryText: {
    ...createTextStyle('lg', 'semibold', colors.text.inverse),
    textAlign: 'center',
  },

  /**
   * tertiary background with a primary color border, creating an outline
   * effect. Used for secondary actions.
   * usage, actual usage may vary)
   */
  secondary: {
    ...buttonBase,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  /**
   * utility to define large, semibold text with the primary brand color,
   * centered.
   */
  secondaryText: {
    ...createTextStyle('lg', 'semibold', colors.primary),
    textAlign: 'center',
  },
});
