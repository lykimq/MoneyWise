import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransactionsScreen: React.FC = () => {
    const [searchText, setSearchText] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Search & Filters */}
                <View style={styles.section}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInputContainer}>
                            <Ionicons name="search-outline" size={20} color="#666" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search transactions..."
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Filter</Text>
                            <Ionicons name="chevron-down-outline" size={16} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Sort</Text>
                            <Ionicons name="chevron-down-outline" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Transaction List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Transaction List</Text>

                    <TouchableOpacity style={styles.addTransactionButton}>
                        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                        <Text style={styles.addTransactionText}>Add Transaction</Text>
                    </TouchableOpacity>

                    <View style={styles.transactionList}>
                        {/* Dining Out */}
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="restaurant-outline" size={24} color="#FF6B6B" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Dining Out</Text>
                                <Text style={styles.transactionTime}>Today 2:30 PM • Italian Restaurant</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-$45.00</Text>
                            <View style={styles.transactionActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Rent Payment */}
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="home-outline" size={24} color="#4ECDC4" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Rent Payment</Text>
                                <Text style={styles.transactionTime}>Yesterday 9:00 AM • Monthly Rent</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-$1,200.00</Text>
                            <View style={styles.transactionActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Salary */}
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="cash-outline" size={24} color="#45B7D1" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Salary</Text>
                                <Text style={styles.transactionTime}>2 days ago 9:00 AM • Monthly Salary</Text>
                            </View>
                            <Text style={styles.transactionAmount}>+$3,500.00</Text>
                            <View style={styles.transactionActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Gas Station */}
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="car-outline" size={24} color="#96CEB4" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Gas Station</Text>
                                <Text style={styles.transactionTime}>3 days ago 5:30 PM • Shell Station</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-$35.00</Text>
                            <View style={styles.transactionActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Groceries */}
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="bag-outline" size={24} color="#FFA726" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Groceries</Text>
                                <Text style={styles.transactionTime}>4 days ago 3:15 PM • Walmart</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-$85.50</Text>
                            <View style={styles.transactionActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Savings Contribution */}
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name="wallet-outline" size={24} color="#AB47BC" />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>Savings Contribution</Text>
                                <Text style={styles.transactionTime}>5 days ago 10:00 AM • Emergency Fund</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-$200.00</Text>
                            <View style={styles.transactionActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Income:</Text>
                            <Text style={styles.summaryAmount}>$3,500</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Expenses:</Text>
                            <Text style={styles.summaryAmount}>$2,450</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.netRow]}>
                            <Text style={styles.summaryLabel}>Net:</Text>
                            <Text style={[styles.summaryAmount, { color: '#4ECDC4' }]}>+$1,050</Text>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 12,
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
    filterButtonText: {
        fontSize: 14,
        color: '#666',
        marginRight: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    transactionList: {
        gap: 10,
    },
    transactionItem: {
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
        marginBottom: 10,
    },
    transactionDetails: {
        marginBottom: 10,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    transactionTime: {
        fontSize: 12,
        color: '#666',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6B6B',
        marginBottom: 10,
    },
    transactionActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    actionText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
    addTransactionButton: {
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
    addTransactionText: {
        fontSize: 14,
        color: '#007AFF',
        marginLeft: 8,
        fontWeight: '500',
    },
    summaryContainer: {
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
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    netRow: {
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
        paddingTop: 10,
        marginTop: 5,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default TransactionsScreen;