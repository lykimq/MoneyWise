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
} from '../styles';
import { toNumber, formatAmount } from '../utils/currencyUtils';

interface FinancialDashboardCardProps {
  spent?: string | number;
  remaining?: string | number;
  savings?: string | number;
  totalBudget?: string | number;
  loading?: boolean;
  period?: string;
}

interface MainCardProps {
  spent: string | number;
  spentPercentage: number;
  totalBudgetAmount: number;
  loading: boolean;
  period: string;
}

interface SecondaryCardsRowProps {
  remaining: string | number;
  savings: string | number;
  remainingPercentage: number;
  remainingNum: number;
  loading: boolean;
}

interface RemainingCardProps {
  remaining: string | number;
  remainingPercentage: number;
  remainingNum: number;
  loading: boolean;
}

interface SavingsCardProps {
  savings: string | number;
  loading: boolean;
}

/**
 * MainCard Component
 *
 * Displays content.
 */
const MainCard: React.FC<MainCardProps> = ({
  spent,
  spentPercentage,
  totalBudgetAmount,
  loading,
  period,
}) => (
  <View style={mainCardStyles.card}>
    <View style={mainCardStyles.header}>
      <View style={mainCardStyles.titleRow}>
        <Ionicons
          name="trending-down-outline"
          size={28}
          color={colors.spending}
        />
        <Text style={mainCardStyles.title}>Total Spent</Text>
      </View>
      <Text style={mainCardStyles.period}>{period}</Text>
    </View>

    <View style={mainCardStyles.content}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.spending} />
      ) : (
        <Text style={[mainCardStyles.amount, { color: colors.spending }]}>
          {formatAmount(spent)}
        </Text>
      )}

      <View style={mainCardStyles.progressContainer}>
        <View
          style={[
            mainCardStyles.progressBar,
            { backgroundColor: colors.spending + '20' },
          ]}
        >
          <View
            style={[
              mainCardStyles.progressFill,
              {
                width: `${Math.min(spentPercentage, 100)}%`,
                backgroundColor: colors.spending,
              },
            ]}
          />
        </View>
        <Text style={mainCardStyles.progressText}>
          {totalBudgetAmount > 0
            ? `${Math.round(spentPercentage)}% of budget`
            : 'No budget set'}
        </Text>
      </View>
    </View>
  </View>
);

/**
 * Card displaying remaining budget amount with progress indicator.
 */
const RemainingCard: React.FC<RemainingCardProps> = ({
  remaining,
  remainingPercentage,
  remainingNum,
  loading,
}) => (
  <View style={[secondaryCardStyles.card, cardVariants.remaining]}>
    <View style={secondaryCardStyles.header}>
      <Ionicons
        name="checkmark-circle-outline"
        size={20}
        color={colors.remaining}
      />
      <Text style={secondaryCardStyles.label}>Remaining</Text>
    </View>
    {loading ? (
      <ActivityIndicator size="small" color={colors.remaining} />
    ) : (
      <Text style={[secondaryCardStyles.amount, { color: colors.remaining }]}>
        {formatAmount(remaining)}
      </Text>
    )}
    <View style={secondaryCardStyles.indicator}>
      <View
        style={[secondaryCardStyles.dot, { backgroundColor: colors.remaining }]}
      />
      <Text style={[secondaryCardStyles.text, { color: colors.remaining }]}>
        {remainingNum > 0 ? 'On Track' : 'Over Budget'}
      </Text>
    </View>
    <View style={progressBarStyles.container}>
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
              width: `${Math.min(remainingPercentage, 100)}%`,
              backgroundColor: colors.remaining,
            },
          ]}
        />
      </View>
      <Text style={progressBarStyles.percentageText}>
        {`${Math.round(remainingPercentage)}% ${remainingNum > 0 ? 'remaining' : 'over budget'}`}
      </Text>
    </View>
  </View>
);

/**
 * Card displaying total savings amount with status indicator.
 */
const SavingsCard: React.FC<SavingsCardProps> = ({ savings, loading }) => (
  <View style={secondaryCardStyles.card}>
    <View style={secondaryCardStyles.header}>
      <Ionicons name="trending-up-outline" size={20} color={colors.savings} />
      <Text style={secondaryCardStyles.label}>Savings</Text>
    </View>
    {loading ? (
      <ActivityIndicator size="small" color={colors.savings} />
    ) : (
      <Text style={[secondaryCardStyles.amount, { color: colors.savings }]}>
        {formatAmount(savings)}
      </Text>
    )}
    <View style={secondaryCardStyles.indicator}>
      <View
        style={[secondaryCardStyles.dot, { backgroundColor: colors.savings }]}
      />
      <Text style={[secondaryCardStyles.text, { color: colors.savings }]}>
        Savings
      </Text>
    </View>
  </View>
);

/**
 * Row containing Remaining and Savings cards displayed side-by-side.
 */
const SecondaryCardsRow: React.FC<SecondaryCardsRowProps> = ({
  remaining,
  savings,
  remainingPercentage,
  remainingNum,
  loading,
}) => (
  <View style={standardCardStyles.row}>
    <RemainingCard
      remaining={remaining}
      remainingPercentage={remainingPercentage}
      remainingNum={remainingNum}
      loading={loading}
    />

    <SavingsCard savings={savings} loading={loading} />
  </View>
);

/**
 * Financial dashboard card displaying spending overview with progress indicators.
 */
const FinancialDashboardCard: React.FC<FinancialDashboardCardProps> = ({
  spent = 0,
  remaining = 0,
  savings = 0,
  totalBudget,
  loading = false,
  period = 'This Month',
}) => {
  // Convert props to numbers for calculations
  const spentNum = toNumber(spent);
  const remainingNum = toNumber(remaining);
  const savingsNum = toNumber(savings);
  const totalBudgetNum = toNumber(totalBudget);

  // Calculate total budget amount, fallback to spent + remaining if not provided
  const totalBudgetAmount = totalBudgetNum || spentNum + remainingNum;

  // Calculate percentages for progress bars
  const spentPercentage =
    totalBudgetAmount > 0 ? (spentNum / totalBudgetAmount) * 100 : 0;
  const remainingPercentage =
    totalBudgetAmount > 0 ? (remainingNum / totalBudgetAmount) * 100 : 0;
  // TODO: Replace hardcoded $1000 with actual savings goal from API
  const savingsPercentage = Math.min(100, (savingsNum / 1000) * 100);

  return (
    <View style={sectionStyles.container}>
      <View style={standardCardStyles.container}>
        <MainCard
          spent={spent}
          spentPercentage={spentPercentage}
          totalBudgetAmount={totalBudgetAmount}
          loading={loading}
          period={period}
        />

        <SecondaryCardsRow
          remaining={remaining}
          savings={savings}
          remainingPercentage={remainingPercentage}
          remainingNum={remainingNum}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default FinancialDashboardCard;
