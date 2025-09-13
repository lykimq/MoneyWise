/**
 * Button Component Styles
 *
 * Styles for interactive button components used throughout the MoneyWise app.
 * Includes primary buttons, secondary buttons, and text styles with
 * consistent theming and visual states.
 */

import { StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { buttonBase } from '../base';
import { createTextStyle } from './utils';

// ============================================================================
// 🔘 BUTTON COMPONENT STYLES - Interactive Elements
// ============================================================================

/**
 * Button Styles
 *
 * Used for interactive buttons throughout the app:
 * - Primary buttons (main actions like "Retry", "Save")
 * - Secondary buttons (secondary actions with outline style)
 * - Consistent padding, typography, and visual states
 *
 * Features: Theme colors, consistent sizing, centered text
 * Usage: <TouchableOpacity style={buttonStyles.primary}> for main actions
 */
export const buttonStyles = StyleSheet.create({
  /**
   * @description Primary button style. Extends `buttonBase` and applies the
   * primary brand color as the background. Used for main actions and calls
   * to action.
   * @usedIn `moneywise-app/src/components/SomeComponent.tsx` (example usage,
   * actual usage may vary)
   */
  primary: {
    ...buttonBase,
    backgroundColor: colors.primary,
  },
  /**
   * @description Text style for the primary button. Uses `createTextStyle`
   * utility to define large, semibold, inverse-colored text, centered.
   * @usedIn conjunction with `buttonStyles.primary`
   */
  primaryText: {
    ...createTextStyle('lg', 'semibold', colors.text.inverse),
    textAlign: 'center',
  },

  /**
   * @description Secondary button style. Extends `buttonBase` and applies a
   * tertiary background with a primary color border, creating an outline
   * effect. Used for secondary actions.
   * @usedIn `moneywise-app/src/components/SomeOtherComponent.tsx` (example
   * usage, actual usage may vary)
   */
  secondary: {
    ...buttonBase,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  /**
   * @description Text style for the secondary button. Uses `createTextStyle`
   * utility to define large, semibold text with the primary brand color,
   * centered.
   * @usedIn conjunction with `buttonStyles.secondary`
   */
  secondaryText: {
    ...createTextStyle('lg', 'semibold', colors.primary),
    textAlign: 'center',
  },
});
