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
    // Don't render section if no insights are available
    if (!insights || insights.length === 0) {
        return null;
    }

    return (
        <View style={sectionStyles.container}>
            <Text style={sectionStyles.title}>Budget Insights</Text>
            <View style={styles.container}>
                {insights.map((insight, index) => (
                    <View key={index} style={styles.item}>
                        <Ionicons
                            name={insight.icon as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={insight.color}
                        />
                        <Text style={styles.message}>{insight.message}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

/**
 * Styles for the BudgetInsightsSection component
 */
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
        flex: 1,
        lineHeight: 20,
    },
});
