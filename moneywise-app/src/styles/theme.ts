/**
 * Unified theme system with colors, typography, spacing, and design tokens.
 */

/**
 * Primary color palette for consistent brand identity and semantic meaning.
 */
export const colors = {
  // Brand colors
  primary: '#007AFF',

  // Financial data colors
  spending: '#FF6B6B',
  remaining: '#4ECDC4',
  savings: '#45B7D1',

  // Text colors
  text: {
    primary: '#333',
    secondary: '#666',
    inverse: '#FFFFFF',
  },

  // Background colors
  background: {
    primary: '#F8F9FA',
    secondary: '#FFFFFF',
    tertiary: '#F5F5F5',
  },

  // Card variant backgrounds
  card: {
    spent: '#F0F8FF',
    remaining: '#F8FFFE',
    overBudget: '#FFF5F5',
  },
} as const;

/**
 * Typography scale for consistent text sizing and weights.
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
 * Spacing scale for consistent margins, paddings, and gaps.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  // Layout spacing
  sectionPadding: 20,
  sectionVertical: 15,
  cardGap: 15,
  rowGap: 12,
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
} as const;

/**
 * Shadow configurations for consistent elevation and depth effects.
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
