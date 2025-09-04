import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import our custom components and hooks
import OverviewCard from '../components/OverviewCard';
import { useBudgetOverview } from '../hooks/useBudgetOverview';

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
        loading,
    } = useBudgetOverview();

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

                {/* SECTION 1: Budget Overview Cards */}
                {/*
                 * Prevent race condition by passing undefined during loading
                 * This ensures the loading spinner shows instead of briefly showing 0
                 * when data is still being fetched
                 */}
                <View style={styles.overviewSection}>
                    <OverviewCard
                        label="Total Spent"
                        amount={loading ? undefined : (overview?.spent || 0)}
                        period="This Month"
                        loading={loading}
                        color={colors.spending} // Red for spending
                    />
                    <OverviewCard
                        label="Remaining"
                        amount={loading ? undefined : (overview?.remaining || 0)}
                        period="This Month"
                        loading={loading}
                        color={colors.remaining} // Teal for remaining budget
                    />
                    <OverviewCard
                        label="Savings"
                        amount={1200} // TODO: Add savings to BudgetOverviewApi when backend supports it
                        period="Progress"
                        loading={false} // TODO: Connect to real savings data when available
                        color={colors.savings} // Blue for savings
                    />
                </View>

                {/* SECTION 2: Spending by Category */}
                <CategorySpendingSection />

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
 * Extracted as separate component for better organization
 * In a larger app, this might be in its own file
 */
const CategorySpendingSection: React.FC = () => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>

        {/* Chart Placeholder - In real app, this would be a chart library component */}
        <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
                <Ionicons name="pie-chart-outline" size={48} color={colors.primary} />
                <Text style={styles.chartPlaceholderText}>Pie Chart</Text>
            </View>
        </View>

        {/* Category List - Shows spending breakdown */}
        <View style={styles.categoryList}>
            <CategoryItem iconName="home-outline" text="Housing: $800" />
            <CategoryItem iconName="restaurant-outline" text="Dining: $450" />
            <CategoryItem iconName="car-outline" text="Transport: $300" />
            <CategoryItem iconName="bag-outline" text="Shopping: $400" />
        </View>
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

    // Special section for overview cards at top
    overviewSection: {
        flexDirection: 'row',       // Horizontal layout for cards
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 10,                    // Space between cards
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
        padding: 20,
        marginBottom: 15,
        ...cardShadow, // Reusable shadow style (defined below)
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
    },

    // List container for categories
    categoryList: {
        gap: 10, // Space between category items
    },

    // Individual category item layout
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
