/**
 * Shared Design System
 *
 * This is the single source of truth for all styling across the MoneyWise app.
 * It provides a unified theme, base components, and utilities that ensure
 * consistency while allowing for domain-specific customizations.
 */

/**
 * @description Re-exports all theme-related styles and design tokens (colors,
 * spacing, borderRadius, shadows). This allows for easy access to the
 * application's visual theme throughout the codebase.
 * @usedIn Various components and style files across `moneywise-app/src/styles`
 * and `moneywise-app/src/screens`
 */
export * from './theme';

/**
 * @description Re-exports base styles that serve as foundational building
 * blocks for components. These include generic styles for cards, headers,
 * progress bars, and buttons.
 * @usedIn Various component style files (e.g.,
 * `moneywise-app/src/styles/components/cards.ts`,
 * `moneywise-app/src/styles/components/buttons.ts`)
 */
export * from './base';

/**
 * @description Re-exports all component-specific styles, which are organized
 * in the `components/` directory. This provides a centralized way to access
 * styles for individual UI components.
 * @usedIn `moneywise-app/src/screens/HomeScreen.tsx`,
 * `moneywise-app/src/screens/budgetScreenStyles.ts`
 */
export * from './components';

/**
 * @description Re-exports styles specifically designed for the Budget Screen.
 * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx`
 */
export * from './screens/budgetScreenStyles';
