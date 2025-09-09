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
    // Used for the primary wrapper of the entire Budget screen.
    // Provides a flexible layout and sets the background color.
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },

    // ScrollView styles
    // Applied to the main ScrollView component that wraps all scrollable content on the Budget screen.
    scrollView: {
        flex: 1,
    },

    // Loading state styles
    // Used for the container that displays the loading spinner and messages when budget data is being fetched.
    // Occupies the full screen and centers its content.
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing['2xl'],
    },

    // Text style for the main loading message.
    loadingText: {
        fontSize: typography.sizes.xl,
        color: colors.text.primary,
        marginTop: spacing.lg,
        textAlign: 'center',
    },

    // Text style for the secondary loading message (e.g., "Fetching latest updates...").
    loadingSubtext: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        marginTop: spacing.sm,
        textAlign: 'center',
    },

    // Error state styles
    // Used for the container that displays error messages and a retry button when data fetching fails or no data is available.
    // Occupies the full screen and centers its content.
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing['2xl'],
    },

    // Style for the error icon displayed in the error state.
    errorIcon: {
        marginBottom: spacing.lg,
    },

    // Text style for the main error title.
    errorTitle: {
        fontSize: typography.sizes.xl,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },

    // Text style for the detailed error message.
    errorMessage: {
        fontSize: typography.sizes.lg,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },

    // Time period selector styles
    // Container for the monthly/yearly toggle buttons at the top of the Budget screen.
    periodToggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.tertiary,
        borderRadius: 8,
        padding: 4,
        marginBottom: spacing.lg,
    },

    // Base style for individual time period toggle buttons.
    periodToggleButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 6,
        alignItems: 'center',
    },

    // Style applied to the active (selected) time period toggle button.
    periodToggleButtonActive: {
        backgroundColor: colors.primary,
    },

    // Style applied to inactive (unselected) time period toggle buttons.
    periodToggleButtonInactive: {
        backgroundColor: 'transparent',
    },

    // Base text style for time period toggle buttons.
    periodToggleText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },

    // Text style for the active (selected) time period toggle button.
    periodToggleTextActive: {
        color: colors.text.inverse,
    },

    // Text style for inactive (unselected) time period toggle buttons.
    periodToggleTextInactive: {
        color: colors.text.secondary,
    },

    // Spinner container
    // Used for the small spinner that appears next to the time period selector during background data fetching.
    spinnerContainer: {
        marginLeft: spacing.sm,
    },
});
