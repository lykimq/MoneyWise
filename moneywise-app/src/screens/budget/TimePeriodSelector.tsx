import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { BudgetTimePeriod } from '../../hooks/useBudgetData';
import { sectionStyles } from './styles';

/**
 * Props for the TimePeriodSelector component
 */
interface TimePeriodSelectorProps {
    availablePeriods: BudgetTimePeriod[];
    selectedPeriod: BudgetTimePeriod;
    onPeriodChange: (period: BudgetTimePeriod) => void;
    isUpdating?: boolean;
}

/**
 * TimePeriodSelector Component
 *
 * Renders a toggle selector for choosing between different time periods (Monthly/Yearly).
 * Shows loading indicator when data is being updated for the selected period.
 *
 * @param availablePeriods - Array of available time periods to choose from
 * @param selectedPeriod - Currently selected time period
 * @param onPeriodChange - Callback function when period selection changes
 * @param isUpdating - Whether data is currently being fetched for the selected period
 */
export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
    availablePeriods,
    selectedPeriod,
    onPeriodChange,
    isUpdating = false,
}) => (
    <View style={sectionStyles.container}>
        <View style={styles.periodToggleContainer}>
            {availablePeriods.map((period) => (
                <TouchableOpacity
                    key={period}
                    style={[
                        styles.periodButton,
                        selectedPeriod === period && styles.periodButtonActive,
                    ]}
                    onPress={() => onPeriodChange(period)}
                    disabled={isUpdating}
                >
                    <Text
                        style={[
                            styles.periodButtonText,
                            selectedPeriod === period && styles.periodButtonTextActive,
                        ]}
                    >
                        {period}
                    </Text>
                    {isUpdating && selectedPeriod === period && (
                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

/**
 * Styles for the TimePeriodSelector component
 */
const styles = StyleSheet.create({
    periodToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    periodButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
});
