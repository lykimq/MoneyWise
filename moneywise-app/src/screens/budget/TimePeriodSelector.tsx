import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { BudgetTimePeriod } from '../../hooks/useBudgetData';
import { colors } from '../../styles/theme';
import { sectionStyles } from '../../styles/components';

/**
 * Props for the TimePeriodSelector component.
 */
interface TimePeriodSelectorProps {
  availablePeriods: BudgetTimePeriod[];
  selectedPeriod: BudgetTimePeriod;
  onPeriodChange: (period: BudgetTimePeriod) => void;
  isUpdating?: boolean;
}

/**
 * Time period selector with toggle buttons and loading indicator.
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
            styles.periodButton, // Base button styling.
            selectedPeriod === period && styles.periodButtonActive, // Active state styling.
          ]}
          onPress={() => onPeriodChange(period)}
          disabled={isUpdating} // Disables interaction during data updates.
        >
          {}
          <Text
            style={[
              styles.periodButtonText, // Base text styling.
              selectedPeriod === period && styles.periodButtonTextActive, // Active text styling.
            ]}
          >
            {period}
          </Text>

          {}
          {isUpdating && selectedPeriod === period && (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
              style={styles.spinnerContainer}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

/**
 * LOCAL STYLES - TimePeriodSelector Component Styling
 *
 * Creates a toggle-style selector with two buttons in a horizontal layout.
 * Uses iOS-style design with active state highlighting and smooth visual
 * transitions. Includes shadow and rounded corners for an elevated card
 * appearance.
 */
const styles = StyleSheet.create({
  
  // Creates an elevated white card with internal padding for button spacing.
  // Uses theme values.
  periodToggleContainer: {
    flexDirection: 'row', // Horizontal arrangement of toggle buttons.
    backgroundColor: colors.background.secondary, // Pure white background.
    borderRadius: 12, // Rounded corners for a modern look.
    padding: 4, // Internal padding creates spacing between buttons.

    
    shadowColor: '#000', // Black shadow for depth.
    shadowOffset: { width: 0, height: 2 }, // Slight downward shadow.
    shadowOpacity: 0.1, // Light shadow (10% opacity).
    shadowRadius: 3.84, // Soft shadow blur.
    elevation: 5, // Android shadow elevation.
  },

  
  // Base styling for both active and inactive states.
  // Uses theme values.
  periodButton: {
    flex: 1, // Equal width distribution (50% each).
    flexDirection: 'row', // Horizontal layout for text and loading indicator.
    paddingVertical: 12, // Vertical padding for touch target.
    paddingHorizontal: 16, // Horizontal padding for comfortable spacing.
    borderRadius: 8, // Rounded button corners (smaller than container).
    alignItems: 'center', // Vertical center alignment.
    justifyContent: 'center', // Horizontal center alignment.
  },

  
  // Blue background to indicate the current selection.
  periodButtonActive: {
    backgroundColor: colors.primary, // iOS blue for active state.
  },

  
  // Medium gray color for inactive buttons.
  periodButtonText: {
    fontSize: 14, // Standard readable text size.
    color: colors.text.secondary, // Medium gray for inactive state.
    fontWeight: '500', // Medium weight for clarity.
  },

  
  // White color and bold weight for the selected state.
  periodButtonTextActive: {
    color: colors.text.inverse, // White text on blue background.
    fontWeight: 'bold', // Bold weight for emphasis.
  },

  
  // Provides functionality.
  spinnerContainer: {
    marginLeft: 8, // Space between text and spinner.
  },
});
