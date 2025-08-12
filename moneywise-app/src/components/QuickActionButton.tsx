import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * QuickActionButton Component
 *
 * Purpose: Reusable button for quick actions on the home screen
 * Pattern: Each button has an icon and text label
 *
 * Design Benefits:
 * - Consistent styling across all quick action buttons
 * - Easy to add new actions without duplicating code
 * - Centralized touch handling
 */

interface QuickActionButtonProps {
    iconName: keyof typeof Ionicons.glyphMap; // Ensures valid Ionicons name
    text: string;                             // Button label text
    onPress: () => void;                      // Function to call when pressed
    disabled?: boolean;                       // Optional disabled state
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    iconName,
    text,
    onPress,
    disabled = false
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && styles.buttonDisabled // Apply disabled style conditionally
            ]}
            onPress={onPress}
            disabled={disabled}
            /**
             * Accessibility: Makes the button accessible to screen readers
             * - accessibilityRole tells screen readers this is a button
             * - accessibilityLabel provides description for visually impaired users
             */
            accessibilityRole="button"
            accessibilityLabel={text}
        >
            {/* Icon - Visual representation of the action */}
            <Ionicons
                name={iconName}
                size={24}
                color={disabled ? '#999' : '#007AFF'}
            />

            {/* Text Label - Describes the action */}
            <Text style={[
                styles.text,
                disabled && styles.textDisabled
            ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

/**
 * Component-specific styles
 * Organized by element hierarchy: container -> content -> states
 */
const styles = StyleSheet.create({
    // Base button styling
    button: {
        width: '30%',               // Takes 30% of container width (allows 3 per row)
        backgroundColor: '#FFFFFF', // Clean white background
        padding: 15,                // Comfortable touch target size
        borderRadius: 12,           // Rounded corners matching design system
        alignItems: 'center',       // Center icon and text

        // Elevation/shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },

    // Disabled button state
    buttonDisabled: {
        backgroundColor: '#F5F5F5',  // Lighter background when disabled
        opacity: 0.6,                // Reduced opacity for disabled appearance
    },

    // Button text styling
    text: {
        fontSize: 12,                // Small, readable text
        color: '#333',               // Dark text for good contrast
        marginTop: 8,                // Space between icon and text
        textAlign: 'center',         // Center text within button
    },

    // Disabled text state
    textDisabled: {
        color: '#999',               // Lighter text color when disabled
    },
});

export default QuickActionButton;
