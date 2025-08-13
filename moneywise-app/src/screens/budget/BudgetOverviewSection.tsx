import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { sectionStyles } from './styles';

/**
 * Props for the BudgetOverviewSection component
 */
interface BudgetOverviewSectionProps {
    overview: {
        planned: string;
        spent: string;
        remaining: string;
    };
}

/**
 * BudgetOverviewSection Component
 *
 * Displays high-level budget totals with three main metrics:
 * - Planned: Total budgeted amount for the period
 * - Spent: Total amount already spent
 * - Remaining: Amount left to spend (or overspent amount)
 *
 * Uses color-coded indicators to help users quickly assess budget health.
 * Shows "Over Budget" label and red color when spending exceeds planned amount.
 *
 * @param overview - Object containing planned, spent, and remaining amounts as strings
 */
export const BudgetOverviewSection: React.FC<BudgetOverviewSectionProps> = ({ overview }) => {
    const remainingAmount = Number(overview.remaining);
    const isOverBudget = remainingAmount < 0;

    return (
        <View style={sectionStyles.container}>
            <Text style={sectionStyles.title}>Budget Overview</Text>
            <View style={styles.cardContainer}>
                {/* Planned Budget Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Planned</Text>
                    <Text style={styles.cardAmount}>
                        ${Number(overview.planned).toLocaleString()}
                    </Text>
                </View>

                {/* Spent Budget Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Spent</Text>
                    <Text style={styles.cardAmount}>
                        ${Number(overview.spent).toLocaleString()}
                    </Text>
                </View>

                {/* Remaining Budget Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>
                        {isOverBudget ? 'Over Budget' : 'Remaining'}
                    </Text>
                    <Text style={[
                        styles.cardAmount,
                        { color: isOverBudget ? '#FF6B6B' : '#007AFF' }
                    ]}>
                        ${Math.abs(remainingAmount).toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
};

/**
 * Styles for the BudgetOverviewSection component
 */
const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
        textAlign: 'center',
    },
    cardAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
    },
});
