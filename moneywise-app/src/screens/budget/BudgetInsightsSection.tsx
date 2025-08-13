import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sectionStyles } from './styles';

/**
 * Props for the BudgetInsightsSection component
 */
interface BudgetInsightsSectionProps {
    insights: Array<{
        type_: string;
        message: string;
        icon: string;
        color: string;
    }>;
}

/**
 * BudgetInsightsSection Component
 *
 * Displays AI-generated insights and recommendations based on spending patterns.
 * Each insight includes:
 * - Contextual icon with appropriate color
 * - Actionable message with spending recommendations
 * - Visual indicators to highlight important information
 *
 * The component gracefully handles empty states by not rendering when no insights are available.
 *
 * @param insights - Array of insight objects containing type, message, icon, and color
 */
export const BudgetInsightsSection: React.FC<BudgetInsightsSectionProps> = ({ insights }) => {
    // EMPTY STATE HANDLING - Don't render section if no insights are available
    // This prevents showing an empty section and maintains clean UI
    if (!insights || insights.length === 0) {
        return null;
    }

    return (
        // MAIN SECTION CONTAINER - Uses shared section styling for consistency
        <View style={sectionStyles.container}>
            {/* SECTION TITLE - Uses shared title styling across all budget sections */}
            <Text style={sectionStyles.title}>Budget Insights</Text>

            {/* INSIGHTS CONTAINER - White card container for all insight items */}
            <View style={styles.container}>
                {insights.map((insight, index) => (
                    // INDIVIDUAL INSIGHT ITEM - Single insight with icon and message
                    <View key={index} style={styles.item}>
                        {/* INSIGHT ICON - Contextual icon with dynamic color from API */}
                        <Ionicons
                            name={insight.icon as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={insight.color}  // Dynamic color based on insight type
                        />

                        {/* INSIGHT MESSAGE - AI-generated recommendation text */}
                        <Text style={styles.message}>{insight.message}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

/**
 * LOCAL STYLES - BudgetInsightsSection Component Styling
 *
 * Creates a clean, card-based layout for displaying AI-generated budget insights.
 * Uses consistent spacing and typography to present recommendations in an
 * easily scannable format with visual hierarchy.
 */
const styles = StyleSheet.create({
    // INSIGHTS CONTAINER - Main card container for all insights
    // Creates elevated white card with rounded corners and shadow
    // Contains all insight items in a vertical list
    container: {
        backgroundColor: '#FFFFFF',  // Pure white background
        borderRadius: 12,        // Rounded corners for modern look
        padding: 15,             // Internal spacing for content

        // SHADOW PROPERTIES - Creates subtle elevation effect
        shadowColor: '#000',     // Black shadow for depth
        shadowOffset: { width: 0, height: 2 },  // Slight downward shadow
        shadowOpacity: 0.1,      // Light shadow (10% opacity)
        shadowRadius: 3.84,      // Soft shadow blur
        elevation: 5,            // Android shadow elevation
    },

    // INSIGHT ITEM - Individual insight row layout
    // Horizontal arrangement of icon and message text
    // Provides consistent spacing between multiple insights
    item: {
        flexDirection: 'row',    // Horizontal arrangement of icon and text
        alignItems: 'center',    // Vertical center alignment
        marginBottom: 10,        // Space between insight items (last item keeps margin)
    },

    // INSIGHT MESSAGE - AI-generated recommendation text
    // Readable typography with proper line height for multi-line text
    // Takes remaining space after icon
    message: {
        fontSize: 14,            // Standard readable text size
        color: '#333',           // Dark gray for high contrast
        marginLeft: 10,          // Space between icon and text
        flex: 1,                 // Takes remaining horizontal space
        lineHeight: 20,          // Improved readability for longer messages
    },
});
