/**
 * Rate Limit Status Indicator Component
 *
 * Displays rate limit information only when relevant:
 * - When user is approaching the rate limit (< 20% requests remaining)
 * - When user has hit the rate limit
 * - When there are active requests in the current time window
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRateLimitStatus } from '../hooks/useRateLimitStatus';

interface RateLimitIndicatorProps {
    endpoint: string;
}

export const RateLimitIndicator: React.FC<RateLimitIndicatorProps> = ({
    endpoint
}) => {
    const {
        remainingRequests,
        formattedTimeUntilReset,
        isLimited,
        userStatus,
        maxRequests,
        hasRecentActivity
    } = useRateLimitStatus(endpoint);

    // Only show when there's recent activity AND either:
    // - User is rate limited OR
    // - User is approaching the limit (less than 20% remaining)
    const shouldShow = hasRecentActivity && (
        isLimited ||
        (maxRequests > 0 && remainingRequests < maxRequests * 0.2)
    );

    if (!shouldShow) {
        return null;
    }

    return (
        <View style={[
            styles.container,
            isLimited ? styles.limitedContainer : styles.warningContainer
        ]}>
            <Text style={[
                styles.status,
                isLimited ? styles.limitedText : styles.warningText
            ]}>
                {isLimited ? userStatus : `${remainingRequests} requests remaining`}
            </Text>

            {isLimited && formattedTimeUntilReset && (
                <Text style={styles.resetText}>
                    Reset in: {formattedTimeUntilReset}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 4,
        marginVertical: 4,
        opacity: 0.95,
    },
    warningContainer: {
        backgroundColor: '#fff3e0',
        borderColor: '#ffb74d',
        borderWidth: 1,
    },
    limitedContainer: {
        backgroundColor: '#ffebee',
        borderColor: '#ef5350',
        borderWidth: 1,
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
    },
    warningText: {
        color: '#f57c00',
    },
    limitedText: {
        color: '#c62828',
    },
    resetText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});