import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BudgetsScreen: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

    const periods = ['Monthly', 'Yearly', 'Custom Range'];

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
                            <Text style={styles.overviewAmount}>$3,000</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Spent</Text>
                            <Text style={styles.overviewAmount}>$2,450</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Remaining</Text>
                            <Text style={styles.overviewAmount}>$550</Text>
                        </View>
                    </View>
                </View>

                {/* Category Budgets */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category Budgets</Text>

                    <TouchableOpacity style={styles.addCategoryButton}>
                        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                        <Text style={styles.addCategoryText}>Add Category</Text>
                    </TouchableOpacity>

                    <View style={styles.categoryList}>
                        {/* Housing */}
                        <View style={styles.categoryBudget}>
                            <View style={styles.categoryHeader}>
                                <Ionicons name="home-outline" size={24} color="#007AFF" />
                                <View style={styles.categoryInfo}>
                                    <Text style={styles.categoryName}>Housing</Text>
                                    <Text style={styles.categoryAmount}>$800 / $1,000</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '80%' }]} />
                                </View>
                                <Text style={styles.progressText}>80%</Text>
                            </View>
                            <Text style={styles.remainingText}>-$200 remaining</Text>
                        </View>

                        {/* Dining */}
                        <View style={styles.categoryBudget}>
                            <View style={styles.categoryHeader}>
                                <Ionicons name="restaurant-outline" size={24} color="#FF6B6B" />
                                <View style={styles.categoryInfo}>
                                    <Text style={styles.categoryName}>Dining</Text>
                                    <Text style={styles.categoryAmount}>$450 / $400</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '112%', backgroundColor: '#FF6B6B' }]} />
                                </View>
                                <Text style={styles.progressText}>112%</Text>
                            </View>
                            <Text style={[styles.remainingText, { color: '#FF6B6B' }]}>+$50 over budget</Text>
                        </View>

                        {/* Transport */}
                        <View style={styles.categoryBudget}>
                            <View style={styles.categoryHeader}>
                                <Ionicons name="car-outline" size={24} color="#4ECDC4" />
                                <View style={styles.categoryInfo}>
                                    <Text style={styles.categoryName}>Transport</Text>
                                    <Text style={styles.categoryAmount}>$300 / $300</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '100%' }]} />
                                </View>
                                <Text style={styles.progressText}>100%</Text>
                            </View>
                            <Text style={styles.remainingText}>$0 remaining</Text>
                        </View>

                        {/* Shopping */}
                        <View style={styles.categoryBudget}>
                            <View style={styles.categoryHeader}>
                                <Ionicons name="bag-outline" size={24} color="#45B7D1" />
                                <View style={styles.categoryInfo}>
                                    <Text style={styles.categoryName}>Shopping</Text>
                                    <Text style={styles.categoryAmount}>$400 / $500</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '80%' }]} />
                                </View>
                                <Text style={styles.progressText}>80%</Text>
                            </View>
                            <Text style={styles.remainingText}>-$100 remaining</Text>
                        </View>

                        {/* Savings */}
                        <View style={styles.categoryBudget}>
                            <View style={styles.categoryHeader}>
                                <Ionicons name="wallet-outline" size={24} color="#96CEB4" />
                                <View style={styles.categoryInfo}>
                                    <Text style={styles.categoryName}>Savings</Text>
                                    <Text style={styles.categoryAmount}>$500 / $800</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '62%' }]} />
                                </View>
                                <Text style={styles.progressText}>62%</Text>
                            </View>
                            <Text style={styles.remainingText}>-$300 remaining</Text>
                        </View>
                    </View>
                </View>

                {/* Budget Insights */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Budget Insights</Text>
                    <View style={styles.insightsContainer}>
                        <View style={styles.insightItem}>
                            <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
                            <Text style={styles.insightText}>You're 12% over budget on dining</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Ionicons name="bulb-outline" size={20} color="#007AFF" />
                            <Text style={styles.insightText}>Consider reducing dining out this month</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#4ECDC4" />
                            <Text style={styles.insightText}>You have $550 remaining for other expenses</Text>
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
    addCategoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
    },
    addCategoryText: {
        fontSize: 14,
        color: '#007AFF',
        marginLeft: 8,
        fontWeight: '500',
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