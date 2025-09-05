import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, sectionStyles } from '../../styles';

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
            <View style={{
                backgroundColor: colors.background.secondary,
                borderRadius: 12,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
            }}>
                {insights.map((insight, index) => (
                    // INDIVIDUAL INSIGHT ITEM - Single insight with icon and message
                    <View key={index} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: index < insights.length - 1 ? 12 : 0,
                    }}>
                        {/* INSIGHT ICON - Contextual icon with dynamic color from API */}
                        <Ionicons
                            name={insight.icon as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={insight.color}  // Dynamic color based on insight type
                        />

                        {/* INSIGHT MESSAGE - AI-generated recommendation text */}
                        <Text style={{
                            marginLeft: 12,
                            fontSize: 14,
                            color: colors.text.primary,
                            flex: 1,
                        }}>{insight.message}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
