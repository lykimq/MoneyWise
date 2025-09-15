import { Ionicons } from '@expo/vector-icons';

/**
 * Maps budget category names to corresponding Ionicons for UI display.
 */
export const getCategoryIconName = (
  categoryName: string
): keyof typeof Ionicons.glyphMap => {
  const categoryToIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    // Housing & Utilities.
    Rent: 'home-outline',
    Mortgage: 'home-outline',
    Utilities: 'flash-outline',

    // Transportation.
    Gas: 'car-outline',
    'Public Transport': 'bus-outline',
    Maintenance: 'construct-outline',

    // Food & Dining.
    Groceries: 'restaurant-outline',
    'Dining Out': 'restaurant-outline',
    Coffee: 'cafe-outline',

    // Shopping & Personal.
    Clothing: 'shirt-outline',
    Electronics: 'phone-portrait-outline',
    Books: 'library-outline',

    // Savings & Investments.
    'Emergency Fund': 'wallet-outline',
    Retirement: 'wallet-outline',
    'Vacation Fund': 'airplane-outline',
  };

  return categoryToIconMap[categoryName] || 'wallet-outline';
};
