import { ViewStyle } from 'react-native';
import { financialDashboardColors } from './colors';

/**
 * Generic styles for a progress bar component.
 * These are extracted to be reusable across different progress bar instances.
 */
export const progressContainerBase: ViewStyle = {
    width: '100%',
    alignItems: 'center',
};

export const genericProgressBarBase: ViewStyle = {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    height: 8, // Default height for progress bars
    backgroundColor: financialDashboardColors.textSecondary + '20', // Default light background
    marginBottom: 8,
};

export const progressFillBase: ViewStyle = {
    height: '100%',
    borderRadius: 4,
};
