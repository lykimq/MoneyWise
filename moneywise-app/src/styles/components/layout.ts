/**
 * Layout Component Styles
 *
 * Styles for structural layout components used throughout the MoneyWise app.
 * Includes section containers, card variants, and common layout patterns
 * with consistent spacing and theming.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { createTextStyle } from './utils';

// ============================================================================
// 📐 LAYOUT COMPONENT STYLES - Structure & Spacing
// ============================================================================

/**
 * Section Container Styles
 *
 * Used for consistent section layout across all screens:
 * - Section titles and content containers
 * - Consistent padding and spacing
 * - Standard typography for section headers
 *
 * Features: Standard padding, bold titles, consistent spacing
 * Usage: <View style={sectionStyles.container}> for screen sections
 */
export const sectionStyles = StyleSheet.create({
    /**
     * @description Section container style with standard horizontal and
     * vertical padding. Provides consistent spacing for major sections on
     * various screens.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (for main sections)
     */
    container: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    /**
     * @description Text style for section titles.
     * Applies a large, bold typography with bottom margin for spacing.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (for section headers)
     */
    title: {
        ...createTextStyle('xl', 'bold'),
        marginBottom: spacing.lg,
    },
});

// ============================================================================
// 🎨 CARD VARIANT STYLES - State-Based Styling
// ============================================================================

/**
 * Card Variant Styles
 *
 * Used to apply different visual states to cards based on budget status:
 * - spent: Light blue background for spent amounts
 * - remaining: Light green background for remaining budget
 * - overBudget: Light red background for overspent amounts
 *
 * Features: Color-coded backgrounds, subtle borders, state indication
 * Usage: <View style={[cardStyles.card, cardVariants.spent]}> for state styling
 */
export const cardVariants = StyleSheet.create({
    /**
     * @description Style for cards indicating spent amounts.
     * Applies a light blue background and a subtle blue border.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     * (for "Spent" card)
     */
    spent: {
        backgroundColor: colors.card.spent,
        borderWidth: 1,
        borderColor: colors.savings + '30',  // 30% opacity blue border
    },
    /**
     * @description Style for cards indicating remaining budget.
     * Applies a light green background and a subtle teal border.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     * (for "Remaining" card)
     */
    remaining: {
        backgroundColor: colors.card.remaining,
        borderWidth: 1,
        borderColor: colors.remaining + '30',  // 30% opacity teal border
    },
    /**
     * @description Style for cards indicating an over-budget state.
     * Applies a light red background and a subtle red border.
     * @usedIn `moneywise-app/src/components/FinancialDashboardCard.tsx`
     * (for "Over Budget" state)
     */
    overBudget: {
        backgroundColor: colors.card.overBudget,
        borderWidth: 1,
        borderColor: colors.spending + '30',  // 30% opacity red border
    },
});
