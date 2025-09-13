import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Import our custom components and hooks
import FinancialDashboardCard from '../components/FinancialDashboardCard';
import { useBudgetOverview } from '../hooks/useBudgetOverview';
import { useCategorySpending } from '../hooks/useCategorySpending';
import { colors } from '../styles';
import { homeScreenStyles } from '../styles/screens/homeScreenStyles';

/**
 * HomeScreen Component
 *
 * ARCHITECTURE PATTERN:
 * - Custom Hook (`useBudgetOverview`): Handles data fetching and state.
 * - Presentational Components: Focus only on rendering UI.
 * - Container Component (this): Orchestrates data and UI components.
 */

const HomeScreen: React.FC = () => {
  const { overview, loading: overviewLoading } = useBudgetOverview();

  const {
    categories,
    loading: categoriesLoading,
    isEmpty: categoriesEmpty,
  } = useCategorySpending();

  /**
   * FAB Action Handler
   * Primary action for adding new transactions.
   */
  const handleAddTransaction = () => {
    // TODO: Implement navigation to the Add Transaction screen.
    // This is a placeholder and requires proper navigation implementation.
    // navigation.navigate('AddTransaction');
  };

  return (
    <SafeAreaView style={homeScreenStyles.container}>
      <ScrollView style={homeScreenStyles.scrollView}>
        {/* SECTION 1: Financial Dashboard Card */}
        {/*
         * A single large dashboard card that combines all three key metrics
         * with visual elements, progress indicators, and a clear hierarchy.
         */}
        <FinancialDashboardCard
          spent={overviewLoading ? undefined : overview?.spent || 0}
          remaining={overviewLoading ? undefined : overview?.remaining || 0}
          savings={1200} // TODO: Add savings to BudgetOverviewApi when backend supports it.
          // This is hardcoded data; the backend needs to provide savings
          // information for accurate representation.
          loading={overviewLoading}
          period="This Month"
        />

        {/* SECTION 2: Spending by Category */}
        <CategorySpendingSection
          categories={categories}
          loading={categoriesLoading}
          isEmpty={categoriesEmpty}
        />

        {/* SECTION 3: Recent Transactions */}
        <RecentTransactionsSection />

        {/* SECTION 4: Upcoming Bills */}
        <UpcomingBillsSection />
      </ScrollView>

      {/* Floating Action Button for Add Transaction */}
      <FloatingActionButton onPress={handleAddTransaction} />
    </SafeAreaView>
  );
};

/**
 * FloatingActionButton Component
 *
 * A modern FAB design for the primary action (Add Transaction), positioned
 * absolutely in the bottom-right corner of the screen.
 */
const FloatingActionButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => (
  <TouchableOpacity
    style={homeScreenStyles.fab}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons name="add" size={24} color={colors.text.inverse} />
  </TouchableOpacity>
);

/**
 * CategorySpendingSection Component
 *
 * Displays a spending breakdown by category using a pie chart and a legend.
 * Shows loading state, empty state, and actual data visualization.
 */
interface CategorySpendingSectionProps {
  categories: Array<{
    id: string;
    category_name: string;
    spent: string;
    category_color: string;
    currency: string;
  }>;
  loading: boolean;
  isEmpty: boolean;
}

const CategorySpendingSection: React.FC<CategorySpendingSectionProps> = ({
  categories,
  loading,
  isEmpty,
}) => {
  // Screen dimensions for chart sizing.
  const screenWidth = Dimensions.get('window').width;
  const chartSize = Math.min(screenWidth - 120, 250); // More padding to prevent cutoff.

  // Retrieves default colors for categories, ensuring distinct and
  // easy-to-distinguish colors.
  const getDefaultColor = (index: number) => {
    const defaultColors = [
      '#FF6B6B', // Red - typically for highest spending.
      '#4ECDC4', // Teal.
      '#45B7D1', // Blue.
      '#96CEB4', // Green.
      '#FFEAA7', // Yellow.
      '#DDA0DD', // Purple.
      '#FF8A80', // Light Red.
      '#81C784', // Light Green.
      '#FFB74D', // Orange.
      '#BA68C8', // Light Purple.
      '#4DB6AC', // Dark Teal.
      '#FF7043', // Deep Orange.
    ];
    return defaultColors[index % defaultColors.length];
  };

  // Calculates total spending for percentage calculations.
  const totalSpending = categories.reduce(
    (sum, category) => sum + parseFloat(category.spent),
    0
  );

  // Sorts categories by spending amount (highest to lowest) for better
  // visual hierarchy in the chart.
  const sortedCategories = [...categories].sort(
    (a, b) => parseFloat(b.spent) - parseFloat(a.spent)
  );

  // Prepares data for the pie chart.
  const chartData = sortedCategories.map((category, index) => ({
    name: category.category_name,
    population: parseFloat(category.spent),
    color: getDefaultColor(index), // Uses the improved color palette.
    legendFontColor: colors.text.primary,
    legendFontSize: 12,
  }));

  // Formats currency for display.
  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(num);
  };

  return (
    <View style={homeScreenStyles.section}>
      <Text style={homeScreenStyles.sectionTitle}>Spending by Category</Text>

      <View style={homeScreenStyles.chartContainer}>
        {loading ? (
          <View style={homeScreenStyles.chartPlaceholder}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={homeScreenStyles.chartPlaceholderText}>
              Loading spending data...
            </Text>
          </View>
        ) : isEmpty ? (
          <View style={homeScreenStyles.chartPlaceholder}>
            <Ionicons
              name="pie-chart-outline"
              size={48}
              color={colors.text.secondary}
            />
            <Text style={homeScreenStyles.chartPlaceholderText}>
              No spending data available.
            </Text>
          </View>
        ) : (
          <>
            <View style={homeScreenStyles.pieChartWrapper}>
              <PieChart
                data={chartData}
                width={chartSize + 40}
                height={chartSize + 40}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="40"
                center={[20, 20]}
                absolute
                hasLegend={false}
              />
            </View>

            {/* Category Legend - Grid Layout. */}
            <View style={homeScreenStyles.categoryLegendGrid}>
              {sortedCategories.map((category, index) => {
                const spendingPercentage =
                  totalSpending > 0
                    ? (
                        (parseFloat(category.spent) / totalSpending) *
                        100
                      ).toFixed(1)
                    : '0.0';

                return (
                  <CategoryLegendItem
                    key={category.id}
                    name={category.category_name}
                    amount={formatCurrency(category.spent, category.currency)}
                    percentage={`${spendingPercentage}%`}
                    color={getDefaultColor(index)}
                  />
                );
              })}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

/**
 * CategoryLegendItem Component
 *
 * Displays an individual category in the legend with a color indicator,
 * amount, and percentage.
 */
const CategoryLegendItem: React.FC<{
  name: string;
  amount: string;
  percentage: string;
  color: string;
}> = ({ name, amount, percentage, color }) => (
  <View style={homeScreenStyles.legendItem}>
    <View
      style={[
        homeScreenStyles.legendColorIndicator,
        { backgroundColor: color },
      ]}
    />
    <Text style={homeScreenStyles.legendName}>{name}</Text>
    <Text style={homeScreenStyles.legendAmount}>{amount}</Text>
    <Text style={homeScreenStyles.legendPercentage}>{percentage}</Text>
  </View>
);

/**
 * CategoryItem Component
 *
 * A small, reusable component for displaying a category with an icon and text.
 */
const CategoryItem: React.FC<{
  iconName: keyof typeof Ionicons.glyphMap;
  text: string;
}> = ({ iconName, text }) => (
  <View style={homeScreenStyles.categoryItem}>
    <Ionicons name={iconName} size={20} color={colors.primary} />
    <Text style={homeScreenStyles.categoryText}>{text}</Text>
  </View>
);

/**
 * RecentTransactionsSection Component
 *
 * Displays a list of recent transaction history.
 */
const RecentTransactionsSection: React.FC = () => (
  <View style={homeScreenStyles.section}>
    <Text style={homeScreenStyles.sectionTitle}>Recent Transactions</Text>
    <View style={homeScreenStyles.transactionList}>
      {/* TODO: Replace with actual transaction data from the API. */}
      <TransactionItem
        iconName="restaurant-outline"
        iconColor={colors.spending}
        title="Dining Out"
        time="Today 2:30 PM"
        amount="-$45.00"
        amountColor={colors.spending}
      />
      <TransactionItem
        iconName="home-outline"
        iconColor={colors.remaining}
        title="Rent Payment"
        time="Yesterday 9:00 AM"
        amount="-$1,200.00"
        amountColor={colors.spending}
      />
      <TransactionItem
        iconName="cash-outline"
        iconColor={colors.savings}
        title="Salary"
        time="2 days ago 9:00 AM"
        amount="+$3,500.00"
        amountColor={colors.remaining}
      />
    </View>
  </View>
);

/**
 * TransactionItem Component
 *
 * A reusable component for displaying an individual transaction.
 */
const TransactionItem: React.FC<{
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  time: string;
  amount: string;
  amountColor: string;
}> = ({ iconName, iconColor, title, time, amount, amountColor }) => (
  <View style={homeScreenStyles.transactionItem}>
    <View style={homeScreenStyles.transactionIcon}>
      <Ionicons name={iconName} size={24} color={iconColor} />
    </View>
    <View style={homeScreenStyles.transactionDetails}>
      <Text style={homeScreenStyles.transactionTitle}>{title}</Text>
      <Text style={homeScreenStyles.transactionTime}>{time}</Text>
    </View>
    <Text style={[homeScreenStyles.transactionAmount, { color: amountColor }]}>
      {amount}
    </Text>
  </View>
);

/**
 * UpcomingBillsSection Component
 *
 * Displays a list of upcoming bill reminders.
 */
const UpcomingBillsSection: React.FC = () => (
  <View style={homeScreenStyles.section}>
    <Text style={homeScreenStyles.sectionTitle}>Upcoming Bills</Text>
    <View style={homeScreenStyles.billsList}>
      {/* TODO: Replace with actual bills data from the API. */}
      <BillItem
        iconName="phone-portrait-outline"
        text="Phone Bill - $85 due in 3 days"
      />
      <BillItem
        iconName="flash-outline"
        text="Electricity - $120 due in 5 days"
      />
    </View>
  </View>
);

/**
 * BillItem Component
 *
 * A reusable component for displaying an individual bill.
 */
const BillItem: React.FC<{
  iconName: keyof typeof Ionicons.glyphMap;
  text: string;
}> = ({ iconName, text }) => (
  <View style={homeScreenStyles.billItem}>
    <Ionicons name={iconName} size={20} color={colors.spending} />
    <Text style={homeScreenStyles.billText}>{text}</Text>
  </View>
);

export default HomeScreen;
