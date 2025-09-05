import { ViewStyle } from 'react-native';
import { budgetOverviewColors } from './colors';

/**
 * Reusable base style for cards, defining common properties like background,
 * border radius, padding, and subtle shadow for a lifted effect.
 */
export const cardBase: ViewStyle = {
    backgroundColor: budgetOverviewColors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
};

/**
 * Reusable base style for horizontal header rows, ensuring consistent alignment
 * of items within headers.
 */
export const headerRowBase: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
};

/**
 * Reusable base style for progress bars, defining common properties like width,
 * border radius, and overflow behavior.
 */
export const progressBarBase: ViewStyle = {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
};
