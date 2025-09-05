import { StyleSheet } from 'react-native';
import { budgetOverviewColors } from './colors';
import { cardBase, headerRowBase } from './baseStyles';

/**
 * Styles for the BudgetInsightsSection Component.
 * These styles create a clean, card-based layout for displaying AI-generated budget insights.
 * Uses consistent spacing and typography to present recommendations in an
 * easily scannable format with visual hierarchy.
 */
export const budgetInsightsSectionStyles = StyleSheet.create({
    /**
     * Main card container for all insights.
     * Inherits common card properties from `cardBase` and customizes for insight display.
     * Creates an elevated white card with rounded corners and shadow.
     */
    container: {
        ...cardBase,
        borderRadius: 12,        // Rounded corners for modern look
        padding: 15,             // Internal spacing for content
        shadowRadius: 3.84,      // Soft shadow blur
        elevation: 5,            // Android shadow elevation
    },

    /**
     * Individual insight row layout.
     * Arranges the icon and message text horizontally and provides consistent spacing.
     */
    item: {
        ...headerRowBase,        // Horizontal arrangement of icon and text, vertical center alignment
        marginBottom: 10,        // Space between insight items (last item keeps margin)
    },

    /**
     * Text style for AI-generated recommendation messages.
     * Ensures readable typography with proper line height for multi-line text.
     * Takes remaining horizontal space after the icon.
     */
    message: {
        fontSize: 14,            // Standard readable text size
        color: budgetOverviewColors.text, // Dark gray for high contrast
        marginLeft: 10,          // Space between icon and text
        flex: 1,                 // Takes remaining horizontal space
        lineHeight: 20,          // Improved readability for longer messages
    },
});
