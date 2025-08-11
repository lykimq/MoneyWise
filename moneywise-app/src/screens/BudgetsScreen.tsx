import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService, { BudgetResponse } from '../services/api';

const BudgetsScreen: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
    const [budgetData, setBudgetData] = useState<BudgetResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const periods = ['Monthly', 'Yearly'];

    const getCategoryIcon = (categoryName: string): keyof typeof Ionicons.glyphMap => {
        const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
            'Rent': 'home-outline',
            'Mortgage': 'home-outline',
            'Utilities': 'flash-outline',
            'Gas': 'car-outline',
            'Public Transport': 'bus-outline',
            'Maintenance': 'construct-outline',
            'Groceries': 'restaurant-outline',
            'Dining Out': 'restaurant-outline',
            'Coffee': 'cafe-outline',
            'Clothing': 'shirt-outline',
            'Electronics': 'phone-portrait-outline',
            'Books': 'library-outline',
            'Emergency Fund': 'wallet-outline',
            'Retirement': 'wallet-outline',
            'Vacation Fund': 'airplane-outline',
        };
        return iconMap[categoryName] || 'wallet-outline';
    };

    useEffect(() => {
        fetchBudgetData();
    }, [selectedPeriod]);

    const fetchBudgetData = async () => {
        try {
            setLoading(true);
            setError(null);

            const now = new Date();
            const params: { month?: string; year?: string } = {};
            if (selectedPeriod === 'Monthly') {
                params.month = String(now.getMonth() + 1);
                params.year = String(now.getFullYear());
            } else if (selectedPeriod === 'Yearly') {
                params.year = String(now.getFullYear());
            }

            const data = await apiService.getBudgets(params);

            setBudgetData(data);
        } catch (err) {
            console.error('Failed to fetch budget data:', err);
            setError('Failed to load budget data. Please try again.');
            Alert.alert('Error', 'Failed to load budget data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading budget data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !budgetData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
                    <Text style={styles.errorText}>
                        {error || 'Failed to load budget data'}
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchBudgetData}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Time Period Toggle */}
                <View style={styles.section}>
                    <View style={styles.periodToggle}>
                        {periods.map((period) => (
                            <TouchableOpacity
                                key={period}
                                style={[
                                    styles.periodButton,
                                    selectedPeriod === period && styles.periodButtonActive,
                                ]}
                                onPress={() => setSelectedPeriod(period)}
                            >
                                <Text
                                    style={[
                                        styles.periodButtonText,
                                        selectedPeriod === period && styles.periodButtonTextActive,
                                    ]}
                                >
                                    {period}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Budget Overview */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Budget Overview</Text>
                    <View style={styles.overviewContainer}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Planned</Text>
                            <Text style={styles.overviewAmount}>
                                ${Number(budgetData.overview.planned).toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Spent</Text>
                            <Text style={styles.overviewAmount}>
                                ${Number(budgetData.overview.spent).toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Remaining</Text>
                            <Text style={[
                                styles.overviewAmount,
                                { color: Number(budgetData.overview.remaining) >= 0 ? '#007AFF' : '#FF6B6B' }
                            ]}>
                                ${Number(budgetData.overview.remaining).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Category Budgets */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category Budgets</Text>

                    <View style={styles.categoryList}>
                        {budgetData.categories.map((category) => (
                            <View key={category.id} style={styles.categoryBudget}>
                                <View style={styles.categoryHeader}>
                                    <Ionicons
                                        name={getCategoryIcon(category.category_name)}
                                        size={24}
                                        color={category.category_color}
                                    />
                                    <View style={styles.categoryInfo}>
                                        <Text style={styles.categoryName}>{category.category_name}</Text>
                                        <Text style={styles.categoryAmount}>
                                            ${Number(category.spent).toLocaleString()} / ${Number(category.planned).toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View style={[
                                            styles.progressFill,
                                            {
                                                width: `${Math.min(Number(category.percentage), 100)}%`,
                                                backgroundColor: Number(category.percentage) > 100 ? '#FF6B6B' : category.category_color
                                            }
                                        ]} />
                                    </View>
                                    <Text style={styles.progressText}>{Math.round(Number(category.percentage))}%</Text>
                                </View>
                                <Text style={[
                                    styles.remainingText,
                                    { color: Number(category.remaining) < 0 ? '#FF6B6B' : '#666' }
                                ]}>
                                    {Number(category.remaining) >= 0
                                        ? `-$${Number(category.remaining).toLocaleString()} remaining`
                                        : `+$${Math.abs(Number(category.remaining)).toLocaleString()} over budget`
                                    }
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Budget Insights */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Budget Insights</Text>
                    <View style={styles.insightsContainer}>
                        {budgetData.insights.map((insight, index) => (
                            <View key={index} style={styles.insightItem}>
                                <Ionicons
                                    name={insight.icon as keyof typeof Ionicons.glyphMap}
                                    size={20}
                                    color={insight.color}
                                />
                                <Text style={styles.insightText}>{insight.message}</Text>
                            </View>
                        ))}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    periodToggle: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: '#007AFF',
    },
    periodButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    periodButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    overviewContainer: {
        flexDirection: 'row',
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
    },
    categoryList: {
        gap: 15,
    },
    categoryBudget: {
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
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryInfo: {
        marginLeft: 15,
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    categoryAmount: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#E9ECEF',
        borderRadius: 4,
        marginRight: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        minWidth: 35,
    },
    remainingText: {
        fontSize: 12,
        color: '#666',
    },

    insightsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    insightText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
        flex: 1,
    },
});

export default BudgetsScreen;