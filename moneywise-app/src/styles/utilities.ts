/**
 * Style Utilities
 *
 * Utility functions for creating dynamic styles based on context or state.
 * These functions help maintain consistency while allowing for contextual variations.
 */

import { ViewStyle, TextStyle } from 'react-native';
import { colors } from './theme';

/**
 * Creates a progress bar style with a specific background color.
 * @param backgroundColor - The background color for the progress bar
 * @param height - The height of the progress bar (default: 8)
 */
export const createProgressBarStyle = (
    backgroundColor: string,
    height: number = 8
): ViewStyle => ({
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    height,
    backgroundColor: backgroundColor + '20', // Add 20% opacity
});

/**
 * Creates a progress fill style with a specific color.
 * @param color - The fill color for the progress bar
 */
export const createProgressFillStyle = (color: string): ViewStyle => ({
    height: '100%',
    borderRadius: 4,
    backgroundColor: color,
});

/**
 * Creates a card style with enhanced shadow for prominence.
 * @param baseStyle - The base card style to enhance
 */
export const createProminentCardStyle = (baseStyle: ViewStyle): ViewStyle => ({
    ...baseStyle,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
});

/**
 * Creates a text style with a specific color and weight.
 * @param color - The text color
 * @param fontSize - The font size
 * @param fontWeight - The font weight
 */
export const createTextStyle = (
    color: string,
    fontSize: number,
    fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' = '400'
): TextStyle => ({
    color,
    fontSize,
    fontWeight,
});

/**
 * Creates a financial amount text style with appropriate formatting.
 * @param color - The text color (default: primary text color)
 * @param size - The font size (default: 36)
 */
export const createAmountStyle = (
    color: string = colors.text.primary,
    size: number = 36
): TextStyle => ({
    fontSize: size,
    fontWeight: 'bold',
    color,
});

/**
 * Creates a status indicator style with a specific color.
 * @param color - The color for the status indicator
 */
export const createStatusIndicatorStyle = (color: string): ViewStyle => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color,
});

/**
 * Creates a row style with specific alignment and spacing.
 * @param justifyContent - The main axis alignment
 * @param gap - The gap between items
 */
export const createRowStyle = (
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' = 'flex-start',
    gap: number = 0
): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent,
    gap,
});

/**
 * Creates a container style with specific padding and background.
 * @param padding - The padding value
 * @param backgroundColor - The background color
 */
export const createContainerStyle = (
    padding: number,
    backgroundColor: string = colors.background.secondary
): ViewStyle => ({
    padding,
    backgroundColor,
});

/**
 * Gets the appropriate color for a financial status.
 * @param status - The financial status
 */
export const getFinancialStatusColor = (status: 'onTrack' | 'overBudget' | 'underBudget'): string => {
    switch (status) {
        case 'onTrack':
            return colors.remaining;
        case 'overBudget':
            return colors.spending;
        case 'underBudget':
            return colors.savings;
        default:
            return colors.primary;
    }
};

/**
 * Gets the appropriate background color for a card variant.
 * @param variant - The card variant
 */
export const getCardVariantColor = (variant: 'spent' | 'remaining' | 'overBudget'): string => {
    switch (variant) {
        case 'spent':
            return colors.card.spent;
        case 'remaining':
            return colors.card.remaining;
        case 'overBudget':
            return colors.card.overBudget;
        default:
            return colors.background.secondary;
    }
};
