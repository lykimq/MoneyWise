import { StyleSheet } from 'react-native';

/**
 * Screen-level styles for the main BudgetsScreen container and layout
 */
export const screenStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Light gray background
    },
    scrollContainer: {
        flex: 1,
    },
    centeredMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    subText: {
        marginTop: 8,
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
});

/**
 * Section container styles used across different budget components
 */
export const sectionStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
});

/**
 * Interactive button styles for actions like retry
 */
export const buttonStyles = StyleSheet.create({
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
