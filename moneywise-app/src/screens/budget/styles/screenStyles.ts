import { StyleSheet } from 'react-native';

/**
 * Screen-level styles for the main BudgetsScreen container and layout.
 * These styles are used for the overall structure and common elements of the BudgetsScreen.
 */
export const screenStyles = StyleSheet.create({
    /**
     * Main container for the entire screen, ensuring it takes full available space
     * and sets a light gray background.
     */
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Light gray background
    },
    /**
     * Style for scrollable content areas, allowing content to expand vertically.
     */
    scrollContainer: {
        flex: 1,
    },
    /**
     * Container for messages that need to be centered on the screen,
     * such as loading indicators or error messages.
     */
    centeredMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    /**
     * Text style for loading messages.
     */
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    /**
     * Text style for secondary or descriptive text.
     */
    subText: {
        marginTop: 8,
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    /**
     * Text style specifically for displaying error messages.
     */
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
});
