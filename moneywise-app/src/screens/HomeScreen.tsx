import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService, { BudgetOverviewApi } from '../services/api';

const HomeScreen: React.FC = () => {
    const [overview, setOverview] = useState<BudgetOverviewApi | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setLoading(true);
                setError(null);
                const now = new Date();
                const data = await apiService.getBudgetOverview({
                    month: String(now.getMonth() + 1),
                    year: String(now.getFullYear()),
                });
                setOverview(data);
            } catch (e) {
                console.error('Failed to fetch budget overview:', e);
                setError('Failed to load');
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Spending Overview Cards */}
                <View style={styles.overviewContainer}>
                    <View style={styles.overviewCard}>
                        <Text style={styles.overviewLabel}>Total Spent</Text>
                        {loading ? (
                            <ActivityIndicator size="small" color="#007AFF" />
                        ) : (
                            <Text style={styles.overviewAmount}>
                                {overview ? `$${Number(overview.spent).toLocaleString()}` : '—'}
                            </Text>
                        )}
                        <Text style={styles.overviewPeriod}>This Month</Text>
                    </View>
                    <View style={styles.overviewCard}>
                        <Text style={styles.overviewLabel}>Remaining</Text>
                        {loading ? (
                            <ActivityIndicator size="small" color="#007AFF" />
                        ) : (
                            <Text style={styles.overviewAmount}>
                                {overview ? `$${Number(overview.remaining).toLocaleString()}` : '—'}
                            </Text>
                        )}
                        <Text style={styles.overviewPeriod}>This Month</Text>
                    </View>
                    <View style={styles.overviewCard}>
                        <Text style={styles.overviewLabel}>Savings</Text>
                        <Text style={styles.overviewAmount}>$1,200</Text>
                        <Text style={styles.overviewPeriod}>Progress</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionsGrid}>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                            <Text style={styles.quickActionText}>Add Transaction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="bar-chart-outline" size={24} color="#007AFF" />
                            <Text style={styles.quickActionText}>View Budget</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="flag-outline" size={24} color="#007AFF" />
                            <Text style={styles.quickActionText}>Goals Progress</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="analytics-outline" size={24} color="#007AFF" />
                            <Text style={styles.quickActionText}>View Reports</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="search-outline" size={24} color="#007AFF" />
                            <Text style={styles.quickActionText}>Search Transactions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
                            <Text style={styles.quickActionText}>Upcoming Bills</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Spending by Category */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Spending by Category</Text>
                    <View style={styles.categoryChart}>
                        <View style={styles.chartPlaceholder}>
                            <Ionicons name="pie-chart-outline" size={48} color="#007AFF" />
                            <Text style={styles.chartPlaceholderText}>Pie Chart</Text>
                        </View>
                    </View>
                    <View style={styles.categoryList}>
                        <View style={styles.categoryItem}>
                            <Ionicons name="home-outline" size={20} color="#007AFF" />
                            <Text style={styles.categoryText}>Housing: $800</Text>
                        </View>
                        <View style={styles.categoryItem}>
                            <Ionicons name="restaurant-outline" size={20} color="#007AFF" />
                            <Text style={styles.categoryText}>Dining: $450</Text>
                        </View>
                        <View style={styles.categoryItem}>
                            <Ionicons name="car-outline" size={20} color="#007AFF" />
                            <Text style={styles.categoryText}>Transport: $300</Text>
                        </View>
                        <View style={styles.categoryItem}>
                            <Ionicons name="bag-outline" size={20} color="#007AFF" />
                            <Text style={styles.categoryText}>Shopping: $400</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <View style={styles.transactionList}>
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="restaurant-outline" size={24} color="#FF6B6B" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Dining Out</Text>
                                <Text style={styles.transactionTime}>Today 2:30 PM</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-$45.00</Text>
                        </View>
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="home-outline" size={24} color="#4ECDC4" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Rent Payment</Text>
                                <Text style={styles.transactionTime}>Yesterday 9:00 AM</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-$1,200.00</Text>
                        </View>
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="cash-outline" size={24} color="#45B7D1" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Salary</Text>
                                <Text style={styles.transactionTime}>2 days ago 9:00 AM</Text>
                            </View>
                            <Text style={styles.transactionAmount}>+$3,500.00</Text>
                        </View>
                    </View>
                </View>

                {/* Upcoming Bills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Bills</Text>
                    <View style={styles.billsList}>
                        <View style={styles.billItem}>
                            <Ionicons name="phone-portrait-outline" size={20} color="#FF6B6B" />
                            <Text style={styles.billText}>Phone Bill - $85 due in 3 days</Text>
                        </View>
                        <View style={styles.billItem}>
                            <Ionicons name="flash-outline" size={20} color="#FF6B6B" />
                            <Text style={styles.billText}>Electricity - $120 due in 5 days</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollView: {
        flex: 1,
    },
    overviewContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 10,
    },
    overviewCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    overviewLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    overviewAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    overviewPeriod: {
        fontSize: 10,
        color: '#999',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    quickActionButton: {
        width: '30%',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    quickActionText: {
        fontSize: 12,
        color: '#333',
        marginTop: 8,
        textAlign: 'center',
    },
    categoryChart: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chartPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },
    chartPlaceholderText: {
        marginTop: 10,
        color: '#666',
    },
    categoryList: {
        gap: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
    },
    transactionList: {
        gap: 10,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    transactionIcon: {
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    transactionTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    billsList: {
        gap: 10,
    },
    billItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    billText: {
        fontSize: 14,
        color: '#333',
    },
});

export default HomeScreen;