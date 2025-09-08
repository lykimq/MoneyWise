/**
 * Budget Screen Styles
 *
 * Centralized styles for the Budget screen components.
 * Replaces inline styles with consistent, maintainable StyleSheet definitions.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';

export const budgetScreenStyles = StyleSheet.create({
    // Main container styles
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },

    scrollView: {
        flex: 1,
    },

    // Loading state styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing['2xl'],
    },

    loadingText: {
        fontSize: typography.sizes.xl,
        color: colors.text.primary,
        marginTop: spacing.lg,
        textAlign: 'center',
    },

    loadingSubtext: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        marginTop: spacing.sm,
        textAlign: 'center',
    },

    // Error state styles
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing['2xl'],
    },

    errorIcon: {
        marginBottom: spacing.lg,
    },

    errorTitle: {
        fontSize: typography.sizes.xl,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },

    errorMessage: {
        fontSize: typography.sizes.lg,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },

    // Time period selector styles
    periodToggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.tertiary,
        borderRadius: 8,
        padding: 4,
        marginBottom: spacing.lg,
    },

    periodToggleButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 6,
        alignItems: 'center',
    },

    periodToggleButtonActive: {
        backgroundColor: colors.primary,
    },

    periodToggleButtonInactive: {
        backgroundColor: 'transparent',
    },

    periodToggleText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },

    periodToggleTextActive: {
        color: colors.text.inverse,
    },

    periodToggleTextInactive: {
        color: colors.text.secondary,
    },

    // Spinner container
    spinnerContainer: {
        marginLeft: spacing.sm,
    },
});
