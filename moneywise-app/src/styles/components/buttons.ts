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
    // Primary button with brand color background
    primary: {
        ...buttonBase,
        backgroundColor: colors.primary,
    },
    primaryText: {
        ...createTextStyle('lg', 'semibold', colors.text.inverse),
        textAlign: 'center',
    },

    // Secondary button with outline style
    secondary: {
        ...buttonBase,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondaryText: {
        ...createTextStyle('lg', 'semibold', colors.primary),
        textAlign: 'center',
    },
});
