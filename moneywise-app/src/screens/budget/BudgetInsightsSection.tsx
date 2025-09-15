import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, sectionStyles, contentCardStyles } from '../../styles';

/**
 * Props for the BudgetInsightsSection component.
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
 * Props for the InsightItem component.
 */
interface InsightItemProps {
  insight: {
    type_: string;
    message: string;
    icon: string;
    color: string;
  };
  isLast: boolean;
}

/**
 * Insight item component with icon and message styling.
 */
const InsightItem: React.FC<InsightItemProps> = ({ insight, isLast }) => (
  <View style={isLast ? contentCardStyles.itemLast : contentCardStyles.item}>
    <Ionicons
      name={insight.icon as keyof typeof Ionicons.glyphMap}
      size={20}
      color={insight.color}
    />

    <Text style={contentCardStyles.itemText}>{insight.message}</Text>
  </View>
);

/**
 * BudgetInsightsSection Component
 *
 * Displays AI-generated insights and recommendations based on spending
 * patterns. Each insight includes:
 * - A contextual icon with an appropriate color.
 * - An actionable message with spending recommendations.
 * - Visual indicators to highlight important information.
 *
 * The component gracefully handles empty states by not rendering when no
 * insights are available, maintaining a clean UI.
 *
 */
export const BudgetInsightsSection: React.FC<BudgetInsightsSectionProps> = ({
  insights,
}) => {
  // EMPTY STATE HANDLING - Prevents rendering the section if no insights
  // are available, maintaining a clean UI.
  if (!insights || insights.length === 0) {
    return null;
  }

  return (

    <View style={sectionStyles.container}>
      { }
      <Text style={sectionStyles.title}>Budget Insights</Text>

      { }
      <View style={contentCardStyles.card}>
        {insights.map((insight, index) => (

          <InsightItem
            key={index}
            insight={insight}
            isLast={index === insights.length - 1}
          />
        ))}
      </View>
    </View>
  );
};
