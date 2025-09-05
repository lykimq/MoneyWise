/**
 * Reusable Component Styles
 *
 * Pre-built style combinations for common UI components.
 * These styles extend the base styles with specific configurations.
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from './theme';
import { cardBase, headerRowBase, progressBarBase, buttonBase } from './base';

/**
 * Main card styles for prominent dashboard cards.
 * These cards have enhanced visual prominence with larger shadows and padding.
 */
export const mainCardStyles = StyleSheet.create({
    card: {
        ...cardBase,
        borderRadius: borderRadius['2xl'],
        padding: spacing['2xl'],
        ...shadows.xl,
    },
    header: {
        ...headerRowBase,
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    titleRow: {
        ...headerRowBase,
        gap: spacing.md,
    },
    title: {
        fontSize: typography.sizes['3xl'],
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    period: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        fontWeight: typography.weights.semibold,
    },
    content: {
        alignItems: 'center',
    },
    amount: {
        fontSize: typography.sizes['4xl'],
        fontWeight: typography.weights.bold,
        marginBottom: spacing.lg,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressBar: {
        ...progressBarBase,
        height: 8,
        marginBottom: spacing.sm,
    },
    progressFill: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
    progressText: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        fontWeight: typography.weights.semibold,
    },
});

/**
 * Secondary card styles for smaller dashboard cards.
 * These cards are designed to be displayed in rows or grids.
 */
export const secondaryCardStyles = StyleSheet.create({
    card: {
        ...cardBase,
        flex: 1,
    },
    header: {
        ...headerRowBase,
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    label: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        fontWeight: typography.weights.semibold,
    },
    amount: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.bold,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    indicator: {
        ...headerRowBase,
        justifyContent: 'center',
        gap: spacing.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    text: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
});

/**
 * Category budget card styles for individual category displays.
 */
export const categoryCardStyles = StyleSheet.create({
    card: {
        ...cardBase,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    header: {
        ...headerRowBase,
        marginBottom: spacing.sm,
    },
    categoryInfo: {
        marginLeft: spacing.lg,
        flex: 1,
    },
    categoryName: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.text.primary,
    },
    amountText: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        marginTop: 2,
    },
    remainingText: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
});

/**
 * Progress bar component styles.
 */
export const progressBarStyles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    bar: {
        ...progressBarBase,
        height: 8,
        backgroundColor: colors.text.secondary + '20',
        marginBottom: spacing.sm,
    },
    fill: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
    categoryBar: {
        ...progressBarBase,
        flex: 1,
        height: 8,
        backgroundColor: colors.background.primary,
        marginRight: spacing.sm,
    },
    categoryFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.sm,
    },
    percentageText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        color: colors.text.primary,
        minWidth: 35,
        textAlign: 'right',
    },
});

/**
 * Button component styles.
 */
export const buttonStyles = StyleSheet.create({
    primary: {
        ...buttonBase,
        backgroundColor: colors.primary,
    },
    primaryText: {
        color: colors.text.inverse,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        textAlign: 'center',
    },
    secondary: {
        ...buttonBase,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondaryText: {
        color: colors.primary,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        textAlign: 'center',
    },
});

/**
 * Section container styles.
 */
export const sectionStyles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
});

/**
 * Card variant styles for special states.
 */
export const cardVariants = StyleSheet.create({
    spent: {
        backgroundColor: colors.card.spent,
        borderWidth: 1,
        borderColor: colors.savings + '30',
    },
    remaining: {
        backgroundColor: colors.card.remaining,
        borderWidth: 1,
        borderColor: colors.remaining + '30',
    },
    overBudget: {
        backgroundColor: colors.card.overBudget,
        borderWidth: 1,
        borderColor: colors.spending + '30',
    },
});
