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
    // Section container with standard padding
    container: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    // Section title with bold typography
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
    // Spent amount styling (light blue)
    spent: {
        backgroundColor: colors.card.spent,
        borderWidth: 1,
        borderColor: colors.savings + '30',  // 30% opacity blue border
    },
    // Remaining budget styling (light green)
    remaining: {
        backgroundColor: colors.card.remaining,
        borderWidth: 1,
        borderColor: colors.remaining + '30',  // 30% opacity teal border
    },
    // Over budget styling (light red)
    overBudget: {
        backgroundColor: colors.card.overBudget,
        borderWidth: 1,
        borderColor: colors.spending + '30',  // 30% opacity red border
    },
});
