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
 * InsightItem Component
 *
 * Displays a single insight with an icon and message. Handles the styling for
 * individual insight items, including proper spacing.
 */
const InsightItem: React.FC<InsightItemProps> = ({ insight, isLast }) => (
  <View style={isLast ? contentCardStyles.itemLast : contentCardStyles.item}>
    {/* INSIGHT ICON - Contextual icon with dynamic color from the API. */}
    <Ionicons
      name={insight.icon as keyof typeof Ionicons.glyphMap}
      size={20}
      color={insight.color} // Dynamic color based on insight type.
    />

    {/* INSIGHT MESSAGE - AI-generated recommendation text. */}
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
 * @param insights - An array of insight objects containing type, message,
 *                   icon, and color.
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
    // MAIN SECTION CONTAINER - Uses shared section styling for consistency.
    <View style={sectionStyles.container}>
      {/* SECTION TITLE - Uses shared title styling across all budget sections. */}
      <Text style={sectionStyles.title}>Budget Insights</Text>

      {/* INSIGHTS CONTAINER - White card container for all insight items. */}
      <View style={contentCardStyles.card}>
        {insights.map((insight, index) => (
          // INDIVIDUAL INSIGHT ITEM - Single insight with icon and message.
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
