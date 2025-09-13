/**
 * Base Style Components
 *
 * Reusable base styles that form the foundation for all components.
 * These styles are designed to be composed and extended by specific components.
 */

import { ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './theme';

/**
 * @description Base card style with common properties like background,
 * border radius, padding, and shadow. This is the foundation for all card
 * components in the app.
 * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`,
 * `moneywise-app/src/components/cards.ts`
 */
export const cardBase: ViewStyle = {
  backgroundColor: colors.background.secondary,
  borderRadius: borderRadius.xl,
  padding: spacing.lg,
  ...shadows.md,
};

/**
 * @description Base style for horizontal header rows, ensuring consistent
 * alignment of items within headers.
 * @usedIn `moneywise-app/src/components/layout.ts` (e.g., `headerRow` style)
 */
export const headerRowBase: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

/**
 * @description Base style for progress bars, defining common properties like
 * width, border radius, and overflow behavior.
 * @usedIn `moneywise-app/src/components/progress.ts`
 * (e.g., `progressBarContainer` style)
 */
export const progressBarBase: ViewStyle = {
  width: '100%',
  borderRadius: borderRadius.sm,
  overflow: 'hidden',
};

/**
 * @description Base style for buttons with consistent padding and border
 * radius.
 * @usedIn `moneywise-app/src/styles/components/buttons.ts`
 * (e.g., `primaryButton`, `secondaryButton`)
 */
export const buttonBase: ViewStyle = {
  paddingHorizontal: spacing['2xl'],
  paddingVertical: spacing.md,
  borderRadius: borderRadius.md,
  alignItems: 'center',
  justifyContent: 'center',
};
