import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBudgetApi } from '../../services/api';
import {
  colors,
  spacing,
  sectionStyles,
  categoryCardStyles,
  progressBarStyles,
  standardCardStyles,
} from '../../styles';
import { sanitizeString } from '../../utils/sanitization';
import { toNumber } from '../../utils/currencyUtils';

interface CategoryBudgetsSectionProps {
  categories: CategoryBudgetApi[];
  getCategoryIcon: (categoryName: string) => keyof typeof Ionicons.glyphMap;
}

interface CategoryBudgetCardProps {
  category: CategoryBudgetApi;
  iconName: keyof typeof Ionicons.glyphMap;
}

interface CategoryBudgetCardHeaderProps {
  category: CategoryBudgetApi;
  iconName: keyof typeof Ionicons.glyphMap;
  spentAmount: number;
  plannedAmount: number;
}

interface CategoryProgressBarProps {
  progressPercentage: number;
  progressBarColor: string;
}

interface CategoryStatusTextProps {
  remainingAmount: number;
  isOverBudget: boolean;
}

const CategoryBudgetCardHeader: React.FC<CategoryBudgetCardHeaderProps> = ({
  category,
  iconName,
  spentAmount,
  plannedAmount,
}) => (
  <View style={categoryCardStyles.header}>
    { }
    <Ionicons name={iconName} size={24} color={category.category_color} />

    { }
    <View style={categoryCardStyles.categoryInfo}>
      { }
      <Text style={categoryCardStyles.categoryName}>
        {sanitizeString(category.category_name)}
      </Text>

      { }
      <Text style={categoryCardStyles.amountText}>
        ${spentAmount.toLocaleString()} / ${plannedAmount.toLocaleString()}
      </Text>
    </View>
  </View>
);

/**
 * Displays content.
 */
const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
  progressPercentage,
  progressBarColor,
}) => (
  <View style={progressBarStyles.container}>
    { }
    <View style={progressBarStyles.categoryBar}>
      { }
      <View
        style={[
          progressBarStyles.categoryFill,
          {
            width: `${Math.min(progressPercentage, 100)}%`, // Caps at 100% visual width.
            backgroundColor: progressBarColor, // Red if over budget, category color if normal.
          },
        ]}
      />
    </View>

    { }
    <Text style={progressBarStyles.percentageText}>
      {Math.round(progressPercentage)}%
    </Text>
  </View>
);

/**
 * Displays content.
 */
const CategoryStatusText: React.FC<CategoryStatusTextProps> = ({
  remainingAmount,
  isOverBudget,
}) => (
  <Text
    style={[
      categoryCardStyles.remainingText,
      // Red for over budget, gray for normal.
      { color: isOverBudget ? colors.spending : colors.text.secondary },
    ]}
  >
    {isOverBudget
      ? `+$${Math.abs(remainingAmount).toLocaleString()} over budget`
      : `-$${remainingAmount.toLocaleString()} remaining`}
  </Text>
);

/**
 * CategoryBudgetsSection Component
 *
 * Displays content.
 */
export const CategoryBudgetsSection: React.FC<CategoryBudgetsSectionProps> = ({
  categories,
  getCategoryIcon,
}) => (

  <View style={sectionStyles.container}>
    { }
    <Text style={sectionStyles.title}>Category Budgets</Text>

    { }
    <View style={standardCardStyles.container}>
      {categories.map((category) => (

        <CategoryBudgetCard
          key={category.id}
          category={category}
          iconName={getCategoryIcon(category.category_name)}
        />
      ))}
    </View>
  </View>
);

/**
 * CategoryBudgetCard Component
 *
 * Individual category card displaying:
 * - Category icon and name.
 * - Spending progress with a visual progress bar.
 * - Amount spent versus planned budget.
 * - Remaining budget or overspend amount.
 *
 * Uses color coding to indicate budget status:
 * - Normal color when on track.
 * - Red color when over budget.
 *
 */
const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  category,
  iconName,
}) => {
  // BUDGET CALCULATIONS - Converts string amounts to numbers for calculations
  // with sanitization.
  const spentAmount = toNumber(category.spent);
  const plannedAmount = toNumber(category.planned);
  const remainingAmount = toNumber(category.remaining);
  const progressPercentage = toNumber(category.percentage);

  // BUDGET STATUS LOGIC - Determines if the category is over budget and
  // selects appropriate colors.
  const isOverBudget = remainingAmount < 0;
  const progressBarColor =
    progressPercentage > 100 ? colors.spending : category.category_color;

  return (

    <View style={categoryCardStyles.card}>
      { }
      <CategoryBudgetCardHeader
        category={category}
        iconName={iconName}
        spentAmount={spentAmount}
        plannedAmount={plannedAmount}
      />

      { }
      <CategoryProgressBar
        progressPercentage={progressPercentage}
        progressBarColor={progressBarColor}
      />

      { }
      <CategoryStatusText
        remainingAmount={remainingAmount}
        isOverBudget={isOverBudget}
      />
    </View>
  );
};
