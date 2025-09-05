import { StyleSheet } from 'react-native';

/**
 * Section container styles used across different budget components.
 * These provide consistent padding and title styling for various sections on the budget screen.
 */
export const sectionStyles = StyleSheet.create({
    /**
     * General container for a section, providing horizontal and vertical padding.
     */
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    /**
     * Style for section titles, ensuring consistent font size, weight, and color.
     */
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
});
