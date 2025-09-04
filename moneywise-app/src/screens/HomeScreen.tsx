import React from 'react';
import {
    View,
    Text,
    StyleSheet,
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

/**
 * HomeScreen Component
 *
 * ARCHITECTURE PATTERN:
 * - Custom Hook (useBudgetOverview): Handles data fetching and state
 * - Presentational Components: Focus only on rendering UI
 * - Container Component (this): Orchestrates data and UI components
 */

const HomeScreen: React.FC = () => {
    const {
        overview,
        loading: overviewLoading,
    } = useBudgetOverview();

    const {
        categories,
        loading: categoriesLoading,
        isEmpty: categoriesEmpty,
    } = useCategorySpending();

    /**
     * FAB Action Handler
     * Primary action for adding transactions
     */
    const handleAddTransaction = () => {
        console.log('Navigate to Add Transaction screen');
        // navigation.navigate('AddTransaction');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>

                {/* SECTION 1: Financial Dashboard Card */}
                {/*
                 * Single large dashboard card that combines all three key metrics
                 * with visual elements, progress indicators, and clear hierarchy
                 */}
                <FinancialDashboardCard
                    spent={overviewLoading ? undefined : (overview?.spent || 0)}
                    remaining={overviewLoading ? undefined : (overview?.remaining || 0)}
                    savings={1200} // TODO: Add savings to BudgetOverviewApi when backend supports it
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
 * Modern FAB design for primary action (Add Transaction)
 * Positioned absolutely in bottom-right corner
 */
const FloatingActionButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
        <Ionicons name="add" size={24} color={colors.white} />
    </TouchableOpacity>
);

/**
 * CategorySpendingSection Component
 *
 * Displays spending breakdown by category using a pie chart and legend.
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
    isEmpty
}) => {
    // Screen dimensions for chart sizing
    const screenWidth = Dimensions.get('window').width;
    const chartSize = Math.min(screenWidth - 120, 250); // Even more padding to prevent cutoff

    // Get default colors for categories - distinct, easy-to-distinguish colors
    const getDefaultColor = (index: number) => {
        const defaultColors = [
            '#FF6B6B', // Red - highest spending
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#96CEB4', // Green
            '#FFEAA7', // Yellow
            '#DDA0DD', // Purple
            '#FF8A80', // Light Red
            '#81C784', // Light Green
            '#FFB74D', // Orange
            '#BA68C8', // Light Purple
            '#4DB6AC', // Dark Teal
            '#FF7043'  // Deep Orange
        ];
        return defaultColors[index % defaultColors.length];
    };

    // Calculate total spending for percentage calculations
    const totalSpending = categories.reduce((sum, category) => sum + parseFloat(category.spent), 0);

    // Sort categories by spending amount (highest to lowest) for better visual hierarchy
    const sortedCategories = [...categories].sort((a, b) => parseFloat(b.spent) - parseFloat(a.spent));

    // Prepare data for pie chart
    const chartData = sortedCategories.map((category, index) => ({
        name: category.category_name,
        population: parseFloat(category.spent),
        color: getDefaultColor(index), // Use our improved color palette
        legendFontColor: colors.text,
        legendFontSize: 12,
    }));

    // Format currency for display
    const formatCurrency = (amount: string, currency: string) => {
        const num = parseFloat(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
        }).format(num);
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>

            <View style={styles.chartContainer}>
                {loading ? (
                    <View style={styles.chartPlaceholder}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.chartPlaceholderText}>Loading spending data...</Text>
                    </View>
                ) : isEmpty ? (
                    <View style={styles.chartPlaceholder}>
                        <Ionicons name="pie-chart-outline" size={48} color={colors.textSecondary} />
                        <Text style={styles.chartPlaceholderText}>No spending data available</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.pieChartWrapper}>
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

                        {/* Category Legend - Grid Layout */}
                        <View style={styles.categoryLegendGrid}>
                            {sortedCategories.map((category, index) => {
                                const spendingPercentage = totalSpending > 0
                                    ? ((parseFloat(category.spent) / totalSpending) * 100).toFixed(1)
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
 * Displays individual category in the legend with color indicator, amount, and percentage
 */
const CategoryLegendItem: React.FC<{
    name: string;
    amount: string;
    percentage: string;
    color: string;
}> = ({ name, amount, percentage, color }) => (
    <View style={styles.legendItem}>
        <View style={[styles.legendColorIndicator, { backgroundColor: color }]} />
        <Text style={styles.legendName}>{name}</Text>
        <Text style={styles.legendAmount}>{amount}</Text>
        <Text style={styles.legendPercentage}>{percentage}</Text>
    </View>
);

/**
 * CategoryItem Component
 * Small reusable component for category display
 */
const CategoryItem: React.FC<{ iconName: keyof typeof Ionicons.glyphMap; text: string }> = ({ iconName, text }) => (
    <View style={styles.categoryItem}>
        <Ionicons name={iconName} size={20} color={colors.primary} />
        <Text style={styles.categoryText}>{text}</Text>
    </View>
);

/**
 * RecentTransactionsSection Component
 * Shows recent transaction history
 */
const RecentTransactionsSection: React.FC = () => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.transactionList}>
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
 * Reusable component for individual transaction display
 */
const TransactionItem: React.FC<{
    iconName: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    title: string;
    time: string;
    amount: string;
    amountColor: string;
}> = ({ iconName, iconColor, title, time, amount, amountColor }) => (
    <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
            <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{title}</Text>
            <Text style={styles.transactionTime}>{time}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {amount}
        </Text>
    </View>
);

/**
 * UpcomingBillsSection Component
 * Shows upcoming bill reminders
 */
const UpcomingBillsSection: React.FC = () => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Bills</Text>
        <View style={styles.billsList}>
            <BillItem iconName="phone-portrait-outline" text="Phone Bill - $85 due in 3 days" />
            <BillItem iconName="flash-outline" text="Electricity - $120 due in 5 days" />
        </View>
    </View>
);

/**
 * BillItem Component
 * Reusable component for individual bill display
 */
const BillItem: React.FC<{ iconName: keyof typeof Ionicons.glyphMap; text: string }> = ({ iconName, text }) => (
    <View style={styles.billItem}>
        <Ionicons name={iconName} size={20} color={colors.spending} />
        <Text style={styles.billText}>{text}</Text>
    </View>
);

/**
 * REUSABLE STYLE OBJECTS
 *
 * Extract common patterns into reusable objects
 * This prevents duplication and ensures consistency
 */
const cardShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
};

/**
 * COLOR CONSTANTS
 *
 * Centralized color definitions to prevent duplication
 * and ensure consistent theming across the app
 */
const colors = {
    primary: '#007AFF',      // iOS blue
    spending: '#FF6B6B',     // Red for expenses
    remaining: '#4ECDC4',    // Teal for remaining budget
    savings: '#45B7D1',      // Blue for savings
    text: '#333',            // Primary text color
    textSecondary: '#666',   // Secondary text color
    background: '#F8F9FA',   // Light gray background
    white: '#FFFFFF',        // White background for cards
} as const;

/**
 * STYLES ORGANIZATION
 *
 * Organized by hierarchy and purpose:
 * 1. Layout styles (container, sections)
 * 2. Component-specific styles (grouped by component)
 * 3. Text styles
 * 4. Interactive element styles
 *
 * NAMING CONVENTION:
 * - Descriptive names that indicate purpose
 * - Grouped by component/section
 * - Consistent naming patterns
 */
const styles = StyleSheet.create({
    // === LAYOUT STYLES ===

    // Main container - defines overall screen layout
    container: {
        flex: 1,
        backgroundColor: colors.background, // Light gray background for entire screen
    },

    // Scrollable content area
    scrollView: {
        flex: 1,
    },

    // Generic section container - used for each major section
    section: {
        paddingHorizontal: 20,      // Consistent horizontal padding
        paddingVertical: 15,        // Vertical spacing between sections
    },


    // === TEXT STYLES ===

    // Section headers - consistent styling for all section titles
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
    },

    // === FLOATING ACTION BUTTON STYLES ===

    // Floating Action Button - positioned absolutely in bottom-right
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,                 // Standard FAB size
        height: 56,
        borderRadius: 28,          // Perfect circle
        backgroundColor: colors.primary, // iOS blue for primary action
        justifyContent: 'center',
        alignItems: 'center',
        ...cardShadow,             // Reuse shadow for elevation
        zIndex: 1000,              // Ensure it stays on top
    },

    // === CATEGORY SECTION STYLES ===

    // Chart container with card styling
    chartContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 30,
        marginBottom: 15,
        alignItems: 'center', // Center the chart
        ...cardShadow, // Reusable shadow style (defined below)
    },

    // Wrapper for pie chart to ensure proper centering
    pieChartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
        overflow: 'visible',
    },

    // Placeholder for actual chart component
    chartPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },

    chartPlaceholderText: {
        marginTop: 10,
        color: colors.textSecondary,
        fontSize: 14,
    },

    // Category legend container - Grid layout
    categoryLegendGrid: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },

    // Individual legend item - Grid layout
    legendItem: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.background,
        borderRadius: 8,
        minWidth: 80,
        maxWidth: 120,
        flex: 1,
    },

    // Color indicator for legend
    legendColorIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginBottom: 6,
    },

    // Category name in legend
    legendName: {
        fontSize: 12,
        color: colors.text,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 2,
    },

    // Amount in legend
    legendAmount: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },

    // Percentage in legend
    legendPercentage: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: '600',
        textAlign: 'center',
    },

    // List container for categories (legacy - keeping for other components)
    categoryList: {
        gap: 10, // Space between category items
    },

    // Individual category item layout (legacy - keeping for other components)
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    categoryText: {
        fontSize: 14,
        color: colors.text,
    },

    // === TRANSACTION SECTION STYLES ===

    // List container for transactions
    transactionList: {
        gap: 10,
    },

    // Individual transaction item with card styling
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 12,
        ...cardShadow,
    },

    transactionIcon: {
        marginRight: 15,
    },

    transactionDetails: {
        flex: 1, // Take remaining space
    },

    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },

    transactionTime: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },

    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        // Color is set dynamically
    },

    // === BILLS SECTION STYLES ===

    billsList: {
        gap: 10,
    },

    billItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 12,
        gap: 10,
        ...cardShadow,
    },

    billText: {
        fontSize: 14,
        color: colors.text,
    },
});

export default HomeScreen;
