/**
 * Color constants matching the existing app theme with budget-specific colors.
 * These colors are used consistently across the budget overview section for visual coherence.
 */
export const budgetOverviewColors = {
    primary: '#007AFF',      // iOS blue - A general primary color
    planned: '#4ECDC4',      // Teal for planned budget - Represents the target budget
    spent: '#45B7D1',        // Blue for spent amount - Indicates money already used
    remaining: '#4ECDC4',    // Teal for remaining budget - Shows available funds (same as planned for consistency)
    spending: '#FF6B6B',     // Red for over budget - Alerts when spending exceeds planned
    text: '#333',            // Primary text color - Dark gray for main text
    textSecondary: '#666',   // Secondary text color - Lighter gray for less prominent text
    background: '#F8F9FA',   // Light gray background - General screen background
    white: '#FFFFFF',        // White background for cards - Used for card backgrounds
} as const;
