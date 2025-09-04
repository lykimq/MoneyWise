import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * OverviewCard Component
 *
 * Purpose: Displays a single metric card with label, amount, and period
 * Used for: Budget overview metrics like "Total Spent", "Remaining", etc.
 *
 * Benefits of separation:
 * - Reusable across different screens
 * - Easier to test individual components
 * - Styles are co-located with the component that uses them
 */

interface OverviewCardProps {
    label: string;                    // The metric label (e.g., "Total Spent")
    amount: string | number | undefined; // The main value to display
    period: string;                   // Time period description (e.g., "This Month")
    loading?: boolean;                // Whether to show loading spinner
    color?: string;                   // Optional custom color for the amount
}

const OverviewCard: React.FC<OverviewCardProps> = ({
    label,
    amount,
    period,
    loading = false,
    color = '#007AFF'
}) => {
    return (
        <View style={styles.card}>
            {/* Card Label - describes what metric this card shows */}
            <Text style={styles.label}>{label}</Text>

            {/* Main Amount Display - shows loading spinner or the actual value */}
            {/* Handle undefined amount to prevent showing 0 during data loading */}
            {loading || amount === undefined ? (
                <ActivityIndicator size="small" color={color} />
            ) : (
                <Text style={[styles.amount, { color }]}>
                    {typeof amount === 'number'
                        ? `$${amount.toLocaleString()}`
                        : amount
                    }
                </Text>
            )}

            {/* Period Description - shows time context */}
            <Text style={styles.period}>{period}</Text>
        </View>
    );
};

/**
 * Styles are co-located with the component
 * Benefits:
 * - Easy to find and modify styles for this specific component
 * - No confusion about which styles belong to which component
 * - Better maintainability
 */
const styles = StyleSheet.create({
    // Main card container - provides the white background and shadow
    card: {
        flex: 1,                    // Takes equal space in flex container
        backgroundColor: '#FFFFFF',  // Clean white background
        padding: 15,                // Internal spacing for content
        borderRadius: 12,           // Rounded corners for modern look
        alignItems: 'center',       // Center all content horizontally

        // Shadow properties for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,

        // Shadow property for Android
        elevation: 5,
    },

    // Label text styling - the top description text
    label: {
        fontSize: 12,               // Small, subtle text
        color: '#666',              // Gray color for secondary text
        marginBottom: 5,            // Space below label
    },

    // Amount text styling - the main prominent number
    amount: {
        fontSize: 18,               // Larger, prominent text
        fontWeight: 'bold',         // Bold for emphasis
        marginBottom: 5,            // Space below amount
        // Note: color is set dynamically via props
    },

    // Period text styling - the bottom description text
    period: {
        fontSize: 10,               // Smallest text size
        color: '#999',              // Light gray for least important text
    },
});

export default OverviewCard;
