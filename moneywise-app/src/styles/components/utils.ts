/**
 * Style Utility Functions
 *
 * Dynamic style generation functions that provide type-safe, reusable
 * style creation with consistent theming and spacing.
 *
 * These utilities eliminate code duplication and ensure consistency
 * across all component styles in the MoneyWise app.
 */

import { ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, shadows, typography } from '../theme';
import { cardBase } from '../base';

// ============================================================================
// 🛠️  UTILITY FUNCTIONS - Dynamic Style Generation
// ============================================================================

/**
 * @description Creates a card style with customizable elevation (shadow depth)
 * and padding. This function composes `cardBase` with dynamic shadow and
 * padding values from the theme.
 * @param elevation - Shadow depth: 'sm' (subtle), 'md' (standard),
 * 'xl' (prominent). Defaults to 'md'.
 * @param padding - Internal spacing: 'sm', 'md', 'lg', 'xl', '2xl'.
 * Defaults to 'lg'.
 * @returns A complete `ViewStyle` object for a card.
 * @usedIn `moneywise-app/src/styles/components/cards.ts` (e.g.,
 * `mainCardStyles.card`, `secondaryCardStyles.card`)
 *
 * Example: `createCardStyle('xl', '2xl')` → Large card with prominent shadow
 * and extra-large padding.
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
 * @description Creates a text style with consistent typography (size, weight,
 * color) from the theme. This utility ensures all text elements adhere to the
 * defined design system.
 * @param size - Text size from typography scale: 'sm', 'lg', 'xl', '2xl',
 * '3xl', '4xl'.
 * @param weight - Font weight: 'semibold', 'bold'. Defaults to 'semibold'.
 * @param color - Text color. Defaults to `colors.text.primary`.
 * @returns A `TextStyle` object with consistent sizing and theming.
 * @usedIn `moneywise-app/src/styles/components/buttons.ts`,
 * `moneywise-app/src/styles/components/cards.ts`,
 * `moneywise-app/src/styles/components/layout.ts`,
 * `moneywise-app/src/styles/components/progress.ts`
 *
 * Example: `createTextStyle('3xl', 'bold', colors.primary)` → Large, bold text
 * in the primary brand color.
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
 * @description Creates a horizontal flex layout style with consistent gap
 * spacing between items. This utility simplifies the creation of row-based
 * layouts.
 * @param gap - Spacing between items: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'.
 * Defaults to 'md'.
 * @returns A `ViewStyle` object for a row layout with center alignment and
 * specified gap.
 * @usedIn `moneywise-app/src/styles/components/cards.ts` (e.g.,
 * `mainCardStyles.header`, `secondaryCardStyles.header`)
 *
 * Example: `createRowStyle('lg')` → A horizontal row with large gaps between
 * its child elements.
 */
export const createRowStyle = (
  gap: keyof typeof spacing = 'md'
): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[gap],
});
