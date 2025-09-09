import { Ionicons } from '@expo/vector-icons';

/**
 * Maps category names to appropriate Ionicons for visual consistency.
 * Returns type-safe icon names that are guaranteed to exist in Ionicons.
 *
 * @param categoryName - The name of the budget category.
 * @returns Icon name that exists in Ionicons.glyphMap.
 */
export const getCategoryIconName = (categoryName: string): keyof typeof Ionicons.glyphMap => {
    const categoryToIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
        // Housing & Utilities.
        'Rent': 'home-outline',
        'Mortgage': 'home-outline',
        'Utilities': 'flash-outline',

        // Transportation.
        'Gas': 'car-outline',
        'Public Transport': 'bus-outline',
        'Maintenance': 'construct-outline',

        // Food & Dining.
        'Groceries': 'restaurant-outline',
        'Dining Out': 'restaurant-outline',
        'Coffee': 'cafe-outline',

        // Shopping & Personal.
        'Clothing': 'shirt-outline',
        'Electronics': 'phone-portrait-outline',
        'Books': 'library-outline',

        // Savings & Investments.
        'Emergency Fund': 'wallet-outline',
        'Retirement': 'wallet-outline',
        'Vacation Fund': 'airplane-outline',
    };

    // Returns the mapped icon or a default fallback if no match is found.
    return categoryToIconMap[categoryName] || 'wallet-outline';
};
