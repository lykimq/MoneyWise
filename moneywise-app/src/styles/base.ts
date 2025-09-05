/**
 * Base Style Components
 *
 * Reusable base styles that form the foundation for all components.
 * These styles are designed to be composed and extended by specific components.
 */

import { ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './theme';

/**
 * Base card style with common properties like background, border radius, padding, and shadow.
 * This is the foundation for all card components in the app.
 */
export const cardBase: ViewStyle = {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
};

/**
 * Base style for horizontal header rows, ensuring consistent alignment of items within headers.
 */
export const headerRowBase: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
};

/**
 * Base style for progress bars, defining common properties like width, border radius, and overflow behavior.
 */
export const progressBarBase: ViewStyle = {
    width: '100%',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
};

/**
 * Base text style for primary headings.
 */
export const headingBase: TextStyle = {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
};

/**
 * Base text style for secondary headings.
 */
export const subheadingBase: TextStyle = {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
};

/**
 * Base text style for body text.
 */
export const bodyTextBase: TextStyle = {
    fontSize: 14,
    color: colors.text.primary,
};

/**
 * Base text style for secondary/caption text.
 */
export const captionTextBase: TextStyle = {
    fontSize: 12,
    color: colors.text.secondary,
};

/**
 * Base container style for full-width sections.
 */
export const sectionContainerBase: ViewStyle = {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
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
