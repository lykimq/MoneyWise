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
    /**
     * @description Main container for the Budget screen.
     * Provides a flexible layout (`flex: 1`) to take up the full screen and
     * sets the background color to `colors.background.primary`.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (main `View` or
     * `SafeAreaView`)
     */
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },

    // ScrollView styles
    /**
     * @description Style for the main ScrollView component on the Budget
     * screen. Allows content to be scrollable and takes up available vertical
     * space.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (main `ScrollView`)
     */
    scrollView: {
        flex: 1,
    },

    // Loading state styles
    /**
     * @description Container style for displaying loading indicators and
     * messages. Occupies the full screen, centers its content, and provides
     * padding.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (when `loading`
     * state is true)
     */
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing['2xl'],
    },

    /**
     * @description Text style for the main loading message (e.g., "Loading
     * budget data..."). Uses `typography.sizes.xl` for size,
     * `colors.text.primary` for color, and provides top margin.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (within
     * `loadingContainer`)
     */
    loadingText: {
        fontSize: typography.sizes.xl,
        color: colors.text.primary,
        marginTop: spacing.lg,
        textAlign: 'center',
    },

    /**
     * @description Text style for a secondary loading message (e.g., "Fetching
     * latest updates..."). Uses `typography.sizes.sm` for size,
     * `colors.text.secondary` for color, and provides top margin.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (within
     * `loadingContainer`)
     */
    loadingSubtext: {
        fontSize: typography.sizes.sm,
        color: colors.text.secondary,
        marginTop: spacing.sm,
        textAlign: 'center',
    },

    // Error state styles
    /**
     * @description Container style for displaying error messages and retry
     * options. Occupies the full screen, centers its content, and provides
     * padding.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (when `error` state
     * is true or data is empty)
     */
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing['2xl'],
    },

    /**
     * @description Style for the error icon displayed in the error state.
     * Provides bottom margin for spacing.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (within
     * `errorContainer`)
     */
    errorIcon: {
        marginBottom: spacing.lg,
    },

    /**
     * @description Text style for the main error title.
     * Uses `typography.sizes.xl` for size, `colors.text.primary` for color,
     * and provides bottom margin.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (within
     * `errorContainer`)
     */
    errorTitle: {
        fontSize: typography.sizes.xl,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },

    /**
     * @description Text style for the detailed error message.
     * Uses `typography.sizes.lg` for size, `colors.text.secondary` for color,
     * and provides bottom margin.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (within
     * `errorContainer`)
     */
    errorMessage: {
        fontSize: typography.sizes.lg,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },

    // Time period selector styles
    /**
     * @description Container for the monthly/yearly toggle buttons.
     * Arranges buttons horizontally, applies a tertiary background, rounded
     * corners, and padding.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (for period
     * selection)
     */
    periodToggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.tertiary,
        borderRadius: 8,
        padding: 4,
        marginBottom: spacing.lg,
    },

    /**
     * @description Base style for individual time period toggle buttons (e.g.,
     * "Monthly", "Yearly"). Provides flexible width, vertical and horizontal
     * padding, rounded corners, and centers content.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (for toggle buttons)
     */
    periodToggleButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 6,
        alignItems: 'center',
    },

    /**
     * @description Style applied to the active (selected) time period toggle
     * button. Sets the background color to `colors.primary`.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (conditional
     * styling for active button)
     */
    periodToggleButtonActive: {
        backgroundColor: colors.primary,
    },

    /**
     * @description Style applied to inactive (unselected) time period toggle
     * buttons. Sets the background to transparent.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (conditional
     * styling for inactive buttons)
     */
    periodToggleButtonInactive: {
        backgroundColor: 'transparent',
    },

    /**
     * @description Base text style for time period toggle buttons.
     * Uses `typography.sizes.sm` for size and `typography.weights.semibold`
     * for font weight.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (for toggle button
     * text)
     */
    periodToggleText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },

    /**
     * @description Text style for the active (selected) time period toggle
     * button. Sets the text color to `colors.text.inverse` (white).
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (conditional
     * styling for active button text)
     */
    periodToggleTextActive: {
        color: colors.text.inverse,
    },

    /**
     * @description Text style for inactive (unselected) time period toggle
     * buttons. Sets the text color to `colors.text.secondary`.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (conditional
     * styling for inactive button text)
     */
    periodToggleTextInactive: {
        color: colors.text.secondary,
    },

    // Spinner container
    /**
     * @description Container for a small spinner that appears next to the time
     * period selector. Provides left margin for spacing.
     * @usedIn `moneywise-app/src/screens/BudgetScreen.tsx` (when fetching data
     * for period change)
     */
    spinnerContainer: {
        marginLeft: spacing.sm,
    },
});
