/**
 * Color constants for the FinancialDashboardCard, matching the app's theme.
 * These colors are specific to the metrics displayed in this card.
 */
export const financialDashboardColors = {
    primary: '#007AFF',      // iOS blue - General primary color
    spending: '#FF6B6B',     // Red for expenses - Highlights spent amounts
    remaining: '#4ECDC4',    // Teal for remaining budget - Indicates available funds
    savings: '#45B7D1',      // Blue for savings - Represents saved amounts
    text: '#333',            // Primary text color - Dark gray for main text
    textSecondary: '#666',   // Secondary text color - Lighter gray for descriptive text
    background: '#F8F9FA',   // Light gray background - General screen background
    white: '#FFFFFF',        // White background for cards - Used for card backgrounds
} as const;
