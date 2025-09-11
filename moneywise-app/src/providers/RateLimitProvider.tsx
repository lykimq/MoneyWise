/**
 * Global Rate Limit Provider
 *
 * Provides rate limit status information to the entire app.
 * Only shows indicators when there is active API usage and
 * when rate limits are approaching or exceeded.
 */

import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { RateLimitIndicator } from '../components/RateLimitIndicator';

interface RateLimitProviderProps {
    children: ReactNode;
}

export const RateLimitProvider: React.FC<RateLimitProviderProps> = ({ children }) => {
    return (
        <View style={{ flex: 1 }}>
            {children}
            {/* Rate limit indicators only show when relevant */}
            <View style={{
                position: 'absolute',
                bottom: 70,
                left: 0,
                right: 0,
                padding: 8,
                pointerEvents: 'none'
            }}>
                <RateLimitIndicator endpoint="/budgets" />
                {/* TODO: other endpoints */}
            </View>
        </View>
    );
};