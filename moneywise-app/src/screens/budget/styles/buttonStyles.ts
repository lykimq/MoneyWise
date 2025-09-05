import { StyleSheet } from 'react-native';

/**
 * Interactive button styles for actions like retry.
 * These styles define the appearance of actionable buttons within the budget screen.
 */
export const buttonStyles = StyleSheet.create({
    /**
     * Style for a primary action button, with a blue background, padding, and rounded corners.
     */
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    /**
     * Text style for the button label, ensuring white color and bold font.
     */
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
