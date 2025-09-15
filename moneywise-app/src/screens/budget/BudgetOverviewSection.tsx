import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  spacing,
  mainCardStyles,
  secondaryCardStyles,
  progressBarStyles,
  sectionStyles,
  cardVariants,
  standardCardStyles,
} from '../../styles';
import { toNumber, formatAmount } from '../../utils/currencyUtils';

/**
 * Budget overview section component props.
 */
interface BudgetOverviewSectionProps {
  overview: {
    planned: string;
    spent: string;
    remaining: string;
  };
  loading?: boolean;
  period?: string;
}

/**
 * Planned budget card component props.
 */
interface PlannedBudgetCardProps {
  planned: string;
  spentPercentage: number;
  isOverBudget: boolean;
  loading: boolean;
  period: string;
}

/**
 * Spent card component props.
 */
interface SpentCardProps {
  spent: string;
  isOverBudget: boolean;
  loading: boolean;
}

/**
 * Remaining budget card component props.
 */
interface RemainingBudgetCardProps {
  remaining: string;
  remainingPercentage: number;
  isOverBudget: boolean;
  loading: boolean;
}

/**
 * Budget secondary cards row component props.
 */
interface BudgetSecondaryCardsRowProps {
  spent: string;
  remaining: string;
  remainingPercentage: number;
  isOverBudget: boolean;
  loading: boolean;
}

/**
 * Planned budget card with progress indicator.
 */
const PlannedBudgetCard: React.FC<PlannedBudgetCardProps> = ({
  planned,
  spentPercentage,
  isOverBudget,
  loading,
  period,
}) => (
  <View style={mainCardStyles.card}>
    
    <View style={mainCardStyles.header}>
      
      <View style={mainCardStyles.titleRow}>
        <Ionicons name="wallet-outline" size={28} color={colors.remaining} />
        <Text style={mainCardStyles.title}>Planned Budget</Text>
      </View>
      
      <Text style={mainCardStyles.period}>{period}</Text>
    </View>

    
    <View style={mainCardStyles.content}>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.remaining} />
      ) : (
        <Text style={[mainCardStyles.amount, { color: colors.remaining }]}>
          {formatAmount(planned)}
        </Text>
      )}

      
      <View style={mainCardStyles.progressContainer}>
        <View
          style={[
            mainCardStyles.progressBar,
            { backgroundColor: colors.remaining + '20' },
          ]}
        >
          <View
            style={[
              mainCardStyles.progressFill,
              {
                // Fills the bar based on spent percentage, capped at 100%.
                // Color changes to 'spending' (red) if over budget, otherwise 'spent' (blue).
                width: `${Math.min(spentPercentage, 100)}%`,
                backgroundColor: isOverBudget
                  ? colors.spending
                  : colors.savings,
              },
            ]}
          />
        </View>
        
        <Text style={mainCardStyles.progressText}>
          {spentPercentage > 0
            ? `${Math.round(spentPercentage)}% spent`
            : 'No budget planned'}
          {/* TODO: Add more detailed budget progress text with warnings at 80%, danger at 95%. */}
        </Text>
      </View>
    </View>
  </View>
);

/**
 * SpentCard Component
 *
 * Displays content.
 */
const SpentCard: React.FC<SpentCardProps> = ({
  spent,
  isOverBudget,
  loading,
}) => (
  <View
    style={[
      secondaryCardStyles.card,
      // Applies 'overBudgetCard' style (red border) if over budget, otherwise
      // 'spentCard' (light blue border).
      isOverBudget ? cardVariants.overBudget : cardVariants.spent,
    ]}
  >
    {}
    <View style={secondaryCardStyles.header}>
      <Ionicons
        name="trending-down-outline"
        size={20}
        // Icon color changes to 'spending' (red) if over budget, otherwise
        // 'spent' (blue).
        color={isOverBudget ? colors.spending : colors.savings}
      />
      <Text style={secondaryCardStyles.label}>Spent</Text>
    </View>
    {}
    {loading ? (
      <ActivityIndicator
        size="small"
        // Indicator color changes to 'spending' (red) if over budget,
        // otherwise 'spent' (blue).
        color={isOverBudget ? colors.spending : colors.savings}
      />
    ) : (
      <Text
        style={[
          secondaryCardStyles.amount,
          // Amount text color changes to 'spending' (red) if over budget,
          // otherwise 'spent' (blue).
          { color: isOverBudget ? colors.spending : colors.savings },
        ]}
      >
        {formatAmount(spent)}
      </Text>
    )}
    {}
    <View style={secondaryCardStyles.indicator}>
      <View
        style={[
          secondaryCardStyles.dot,
          // Dot color changes to 'spending' (red) if over budget, otherwise
          // 'spent' (blue).
          {
            backgroundColor: isOverBudget ? colors.spending : colors.savings,
          },
        ]}
      />
      <Text
        style={[
          secondaryCardStyles.text,
          // Text color changes to 'spending' (red) if over budget, otherwise
          // 'spent' (blue).
          { color: isOverBudget ? colors.spending : colors.savings },
        ]}
      >
        {isOverBudget ? 'Over Budget' : 'On Track'}
        {/* TODO: Add more sophisticated budget health logic with color coding:
                    warning at 80%, danger at 95%. */}
      </Text>
    </View>
  </View>
);

/**
 * RemainingBudgetCard Component
 *
 * Displays content.
 */
const RemainingBudgetCard: React.FC<RemainingBudgetCardProps> = ({
  remaining,
  remainingPercentage,
  isOverBudget,
  loading,
}) => (
  <View
    style={[
      secondaryCardStyles.card,
      // Applies 'overBudgetCard' style (red border) if over budget, otherwise
      // 'remainingCard' (light green border).
      isOverBudget ? cardVariants.overBudget : cardVariants.remaining,
    ]}
  >
    {}
    <View style={secondaryCardStyles.header}>
      <Ionicons
        name="checkmark-circle-outline"
        size={20}
        // Icon color changes to 'spending' (red) if over budget, otherwise
        // 'remaining' (teal).
        color={isOverBudget ? colors.spending : colors.remaining}
      />
      <Text style={secondaryCardStyles.label}>
        {isOverBudget ? 'Over Budget' : 'Remaining'}
      </Text>
    </View>
    {}
    {loading ? (
      <ActivityIndicator
        size="small"
        // Indicator color changes to 'spending' (red) if over budget,
        // otherwise 'remaining' (teal).
        color={isOverBudget ? colors.spending : colors.remaining}
      />
    ) : (
      <Text
        style={[
          secondaryCardStyles.amount,
          // Amount text color changes to 'spending' (red) if over budget,
          // otherwise 'remaining' (teal).
          { color: isOverBudget ? colors.spending : colors.remaining },
        ]}
      >
        {formatAmount(Math.abs(toNumber(remaining)))}
      </Text>
    )}
    {}
    <View style={{ width: '100%' }}>
      <View
        style={[
          progressBarStyles.bar,
          { backgroundColor: colors.remaining + '20' },
        ]}
      >
        <View
          style={[
            progressBarStyles.fill,
            {
              // Fills the bar based on remaining percentage, capped at 100%.
              // Color changes to 'spending' (red) if over budget, otherwise
              // 'remaining' (teal).
              width: `${Math.min(Math.abs(remainingPercentage), 100)}%`,
              backgroundColor: isOverBudget
                ? colors.spending
                : colors.remaining,
            },
          ]}
        />
      </View>
      {/* TODO: Add remaining budget percentage text (e.g., "20% left") and
                progress indicators. */}
    </View>
  </View>
);

/**
 * BudgetSecondaryCardsRow Component
 *
 * Contains elements.
 */
const BudgetSecondaryCardsRow: React.FC<BudgetSecondaryCardsRowProps> = ({
  spent,
  remaining,
  remainingPercentage,
  isOverBudget,
  loading,
}) => (
  <View style={standardCardStyles.row}>
    {}
    <SpentCard spent={spent} isOverBudget={isOverBudget} loading={loading} />

    {}
    <RemainingBudgetCard
      remaining={remaining}
      remainingPercentage={remainingPercentage}
      isOverBudget={isOverBudget}
      loading={loading}
    />
  </View>
);

/**
 * BudgetOverviewSection Component
 *
 * Displays high-level budget totals with an improved dashboard design:
 * - Planned: Total budgeted amount for the period (main card).
 * - Spent: Total amount already spent (secondary card).
 * - Remaining: Amount left to spend (secondary card).
 *
 * Uses visual hierarchy, progress indicators, and better UX for budget
 * management.
 *
 */
export const BudgetOverviewSection: React.FC<BudgetOverviewSectionProps> = ({
  overview,
  loading = false,
  period = 'This Month',
}) => {
  // Converts all values to numbers for calculations.
  const plannedNum = toNumber(overview.planned);
  const spentNum = toNumber(overview.spent);
  const remainingNum = toNumber(overview.remaining);

  // Calculates progress percentages for visual indicators.
  const spentPercentage = plannedNum > 0 ? (spentNum / plannedNum) * 100 : 0;
  const remainingPercentage =
    plannedNum > 0 ? (remainingNum / plannedNum) * 100 : 0;
  const isOverBudget = remainingNum < 0;

  return (
    // Main container for the entire Budget Overview section.
    <View style={sectionStyles.container}>
      {}
      <Text style={sectionStyles.title}>Budget Overview</Text>

      {}
      <View style={standardCardStyles.container}>
        {}
        <PlannedBudgetCard
          planned={overview.planned}
          spentPercentage={spentPercentage}
          isOverBudget={isOverBudget}
          loading={loading}
          period={period}
        />

        {}
        <BudgetSecondaryCardsRow
          spent={overview.spent}
          remaining={overview.remaining}
          remainingPercentage={remainingPercentage}
          isOverBudget={isOverBudget}
          loading={loading}
        />
      </View>
    </View>
  );
};
