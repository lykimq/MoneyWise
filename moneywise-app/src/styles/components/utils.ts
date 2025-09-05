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
 * Creates a card style with customizable elevation and padding
 *
 * @param elevation - Shadow depth: 'sm' (subtle), 'md' (standard), 'xl' (prominent)
 * @param padding - Internal spacing: 'sm', 'md', 'lg', 'xl', '2xl'
 * @returns Complete card style with background, border radius, padding, and shadow
 *
 * Example: createCardStyle('xl', '2xl') → Large card with prominent shadow
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
 * Creates a text style with consistent typography from theme
 *
 * @param size - Text size from typography scale: 'sm', 'lg', 'xl', '2xl', '3xl', '4xl'
 * @param weight - Font weight: 'semibold', 'bold'
 * @param color - Text color (defaults to primary text color)
 * @returns Typography style with consistent sizing and theming
 *
 * Example: createTextStyle('3xl', 'bold', colors.primary) → Large bold primary text
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
 * Creates a horizontal flex layout with consistent gap spacing
 *
 * @param gap - Spacing between items: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
 * @returns Row layout with center alignment and specified gap
 *
 * Example: createRowStyle('lg') → Row with large gaps between items
 */
export const createRowStyle = (gap: keyof typeof spacing = 'md'): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[gap],
});

/**
 * Creates a container layout with consistent gap spacing
 *
 * @param gap - Spacing between child elements: 'cardGap', 'rowGap', or theme spacing
 * @returns Container with vertical gap spacing
 *
 * Example: createContainerStyle('cardGap') → Container with standard card spacing
 */
export const createContainerStyle = (gap: keyof typeof spacing = 'cardGap'): ViewStyle => ({
    gap: spacing[gap],
});
