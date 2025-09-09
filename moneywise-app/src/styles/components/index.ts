/**
 * Component Styles Index
 *
 * Centralized exports for all component styles in the MoneyWise app.
 * This file provides a single import point for all style components,
 * making it easy to import styles while maintaining organized file structure.
 *
 * Usage:
 * import { mainCardStyles, buttonStyles } from '../styles/components';
 * import { createCardStyle, createTextStyle } from '../styles/components/utils';
 */

/**
 * @description Re-exports utility functions for creating dynamic styles
 * (e.g., `createCardStyle`, `createTextStyle`, `createRowStyle`).
 * These utilities help in generating consistent styles based on theme tokens.
 * @usedIn `moneywise-app/src/styles/components/cards.ts`,
 * `moneywise-app/src/styles/components/buttons.ts`,
 * `moneywise-app/src/styles/components/layout.ts`,
 * `moneywise-app/src/styles/components/progress.ts`
 */
export * from './utils';
/**
 * @description Re-exports all card-related styles (e.g., `mainCardStyles`,
 * `secondaryCardStyles`, `categoryCardStyles`, `contentCardStyles`,
 * `standardCardStyles`).
 * @usedIn `moneywise-app/src/screens/HomeScreen.tsx`,
 * `moneywise-app/src/screens/BudgetScreen.tsx`,
 * `moneywise-app/src/components/FinancialDashboardCard.tsx`
 */
export * from './cards';
/**
 * @description Re-exports progress bar related styles.
 * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
 */
export * from './progress';
/**
 * @description Re-exports button-related styles (e.g., `buttonStyles`).
 * @usedIn `moneywise-app/src/components/SomeButtonComponent.tsx` (example usage)
 */
export * from './buttons';
/**
 * @description Re-exports layout-related styles.
 * @usedIn `moneywise-app/src/components/SomeLayoutComponent.tsx` (example usage)
 */
export * from './layout';
