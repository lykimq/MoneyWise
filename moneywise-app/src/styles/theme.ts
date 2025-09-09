/**
 * Unified Theme System
 *
 * Single source of truth for all colors, typography, spacing, and other
 * design tokens used throughout the MoneyWise application.
 */

/**
 * @description Primary color palette for the MoneyWise application.
 * These colors are used consistently across all components and screens to
 * maintain brand identity and semantic meaning.
 * @usedIn Various components and style files across `moneywise-app/src/styles`
 * and `moneywise-app/src/screens`
 */
export const colors = {
    // Primary brand colors
    primary: '#007AFF',      // iOS blue - Main brand color

    // Semantic colors for financial data
    spending: '#FF6B6B',     // Red for expenses and over-budget states
    remaining: '#4ECDC4',    // Teal for remaining budget and available funds
    savings: '#45B7D1',      // Blue for savings and positive amounts

    // Text colors
    text: {
        primary: '#333',     // Dark gray for main text
        secondary: '#666',   // Medium gray for secondary text
        inverse: '#FFFFFF',  // White text for dark backgrounds
    },

    // Background colors
    background: {
        primary: '#F8F9FA',  // Light gray for main screen backgrounds
        secondary: '#FFFFFF', // White for card backgrounds
        tertiary: '#F5F5F5', // Very light gray for subtle backgrounds
    },

    // Card variant backgrounds (for special styling)
    card: {
        spent: '#F0F8FF',    // Very light blue
        remaining: '#F8FFFE', // Very light green
        overBudget: '#FFF5F5', // Very light red
    },
} as const;

/**
 * @description Typography scale for consistent text sizing and weights across
 * the app. Ensures a harmonious visual hierarchy for all textual content.
 * @usedIn Various components and style files for text styling.
 */
export const typography = {
    sizes: {
        sm: 12,
        lg: 16,
        xl: 18,
        '2xl': 20,
        '3xl': 24,
        '4xl': 36,
    },
    weights: {
        semibold: '600',
        bold: '700',
    },
} as const;

/**
 * @description Spacing scale for consistent margins, paddings, and gaps
 * throughout the app. Helps maintain a clean and organized layout.
 * @usedIn Various components and style files for layout and spacing.
 */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    // Common layout spacing
    sectionPadding: 20,    // Horizontal padding for sections
    sectionVertical: 15,   // Vertical padding for sections
    cardGap: 15,           // Gap between cards
    rowGap: 12,            // Gap between items in rows
} as const;

/**
 * @description Border radius values for consistent rounded corners on UI
 * elements.
 * @usedIn Various components and style files for rounded borders.
 */
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
} as const;

/**
 * @description Shadow configurations for consistent elevation and depth
 * effects.
 * @usedIn Various components and style files (e.g., `cardBase` in `base.ts`,
 * `homeScreenStyles.fab`)
 */
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
} as const;
