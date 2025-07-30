import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoalsScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Goals Overview */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Goals Overview</Text>
                    <View style={styles.overviewContainer}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Total</Text>
                            <Text style={styles.overviewAmount}>$8,000</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Saved</Text>
                            <Text style={styles.overviewAmount}>$2,800</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewLabel}>Remaining</Text>
                            <Text style={styles.overviewAmount}>$5,200</Text>
                        </View>
                    </View>
                </View>

                {/* Active Goals */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Active Goals</Text>
                    <View style={styles.goalsList}>
                        {/* Emergency Fund */}
                        <View style={styles.goalItem}>
                            <View style={styles.goalHeader}>
                                <Ionicons name="home-outline" size={24} color="#007AFF" />
                                <View style={styles.goalInfo}>
                                    <Text style={styles.goalName}>Emergency Fund</Text>
                                    <Text style={styles.goalAmount}>$4,000 / $5,000 • Due: Dec 2024</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '80%' }]} />
                                </View>
                                <Text style={styles.progressText}>80% Complete</Text>
                            </View>
                            <View style={styles.goalActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Vacation Fund */}
                        <View style={styles.goalItem}>
                            <View style={styles.goalHeader}>
                                <Ionicons name="airplane-outline" size={24} color="#FF6B6B" />
                                <View style={styles.goalInfo}>
                                    <Text style={styles.goalName}>Vacation Fund</Text>
                                    <Text style={styles.goalAmount}>$1,800 / $4,000 • Due: Mar 2025</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '45%' }]} />
                                </View>
                                <Text style={styles.progressText}>45% Complete</Text>
                            </View>
                            <View style={styles.goalActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Car Down Payment */}
                        <View style={styles.goalItem}>
                            <View style={styles.goalHeader}>
                                <Ionicons name="car-outline" size={24} color="#4ECDC4" />
                                <View style={styles.goalInfo}>
                                    <Text style={styles.goalName}>Car Down Payment</Text>
                                    <Text style={styles.goalAmount}>$1,500 / $10,000 • Due: Jun 2025</Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '15%' }]} />
                                </View>
                                <Text style={styles.progressText}>15% Complete</Text>
                            </View>
                            <View style={styles.goalActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addGoalButton}>
                        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                        <Text style={styles.addGoalText}>Add New Goal</Text>
                    </TouchableOpacity>
                </View>

                {/* Goal Insights */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Goal Insights</Text>
                    <View style={styles.insightsContainer}>
                        <View style={styles.insightItem}>
                            <Ionicons name="calculator-outline" size={20} color="#007AFF" />
                            <Text style={styles.insightText}>You need to save $520/month to reach all goals</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#4ECDC4" />
                            <Text style={styles.insightText}>Emergency fund will be complete in 2 months</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Ionicons name="bulb-outline" size={20} color="#FF6B6B" />
                            <Text style={styles.insightText}>Consider prioritizing goals based on urgency</Text>
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
    goalsList: {
        gap: 15,
    },
    goalItem: {
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
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    goalInfo: {
        marginLeft: 15,
        flex: 1,
    },
    goalName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    goalAmount: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    progressContainer: {
        marginBottom: 10,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E9ECEF',
        borderRadius: 4,
        marginBottom: 5,
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
    },
    goalActions: {
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
    addGoalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
    },
    addGoalText: {
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

export default GoalsScreen;