/**
 * Unified Theme System
 *
 * Single source of truth for all colors, typography, spacing, and other
 * design tokens used throughout the MoneyWise application.
 */

/**
 * Primary color palette for the MoneyWise application.
 * These colors are used consistently across all components and screens.
 */
export const colors = {
    // Primary brand colors
    primary: '#007AFF',      // iOS blue - Main brand color
    secondary: '#4ECDC4',    // Teal - Secondary actions and highlights

    // Semantic colors for financial data
    spending: '#FF6B6B',     // Red for expenses and over-budget states
    remaining: '#4ECDC4',    // Teal for remaining budget and available funds
    savings: '#45B7D1',      // Blue for savings and positive amounts
    planned: '#4ECDC4',      // Teal for planned budget (alias for remaining)
    spent: '#45B7D1',        // Blue for spent amounts (alias for savings)

    // Text colors
    text: {
        primary: '#333',     // Dark gray for main text
        secondary: '#666',   // Medium gray for secondary text
        tertiary: '#999',    // Light gray for less important text
        inverse: '#FFFFFF',  // White text for dark backgrounds
    },

    // Background colors
    background: {
        primary: '#F8F9FA',  // Light gray for main screen backgrounds
        secondary: '#FFFFFF', // White for card backgrounds
        tertiary: '#F5F5F5', // Very light gray for subtle backgrounds
    },

    // Status colors
    status: {
        success: '#4ECDC4',  // Teal for success states
        warning: '#FFA726',  // Orange for warning states
        error: '#FF6B6B',    // Red for error states
        info: '#45B7D1',     // Blue for informational states
    },

    // Card variant backgrounds (for special styling)
    card: {
        spent: '#F0F8FF',    // Very light blue
        remaining: '#F8FFFE', // Very light green
        overBudget: '#FFF5F5', // Very light red
    },

    // Transparent variants for borders and overlays
    transparent: {
        light: 'rgba(255, 255, 255, 0.1)',
        medium: 'rgba(0, 0, 0, 0.1)',
        dark: 'rgba(0, 0, 0, 0.2)',
    },
} as const;

/**
 * Typography scale for consistent text sizing across the app.
 */
export const typography = {
    sizes: {
        xs: 10,
        sm: 12,
        base: 14,
        lg: 16,
        xl: 18,
        '2xl': 20,
        '3xl': 24,
        '4xl': 36,
    },
    weights: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
} as const;

/**
 * Spacing scale for consistent spacing throughout the app.
 */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
} as const;

/**
 * Border radius values for consistent rounded corners.
 */
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
} as const;

/**
 * Shadow configurations for consistent elevation.
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
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
} as const;

/**
 * Theme type for TypeScript support
 */
export type Theme = {
    colors: typeof colors;
    typography: typeof typography;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
};

/**
 * Default theme object
 */
export const theme: Theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
};
