import { StyleSheet } from 'react-native';
import { colors } from '../index'; // Assuming index.ts exports colors

/**
 * Reusable style objects to prevent duplication and ensure consistency.
 */
const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,
  elevation: 5,
};

/**
 * Styles organized by hierarchy: layout, components, text, and interactive elements.
 */
export const homeScreenStyles = StyleSheet.create({
  // === LAYOUT STYLES ===

  /**
   * Main container for the HomeScreen with full screen layout.
   */
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // Light gray background
  },

  /**
   * Scrollable content area for the HomeScreen.
   */
  scrollView: {
    flex: 1,
  },

  /**
   * Section container with consistent horizontal padding and vertical spacing.
   */
  section: {
    paddingHorizontal: 20, // Consistent horizontal padding
    paddingVertical: 15, // Vertical spacing between sections
  },

  // === TEXT STYLES ===

  /**
   * Section title with consistent styling.
   */
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },

  // === FLOATING ACTION BUTTON STYLES ===

  /**
   * Floating action button positioned at bottom-right with elevation.
   */
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56, // Standard FAB size
    height: 56,
    borderRadius: 28, // Perfect circle
    backgroundColor: colors.primary, // iOS blue for primary action
    justifyContent: 'center',
    alignItems: 'center',
    ...cardShadow, // Reuse shadow for elevation
    zIndex: 1000, // Ensure it stays on top
  },

  // === CATEGORY SECTION STYLES ===

  /**
   * Chart container with card-like appearance and centered content.
   */
  chartContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 30,
    marginBottom: 15,
    alignItems: 'center', // Center the chart
    ...cardShadow, // Reusable shadow style (defined below)
  },

  /**
   * Pie chart wrapper with overflow handling.
   */
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
    overflow: 'visible',
  },

  /**
   * Chart placeholder with centered content and fixed height.
   */
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },

  chartPlaceholderText: {
    marginTop: 10,
    color: colors.text.secondary,
    fontSize: 14,
  },

  /**
   * layout. Uses `flexWrap` to allow items to wrap to the next line and
   * `justifyContent` for spacing.
   */
  categoryLegendGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  /**
   * Arranges content vertically, centers items, and applies background,
   * padding, and rounded corners. `minWidth` and `maxWidth` help with
   * responsive layout.
   */
  legendItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    minWidth: 80,
    maxWidth: 120,
    flex: 1,
  },

  /**
   */
  legendColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 6,
  },

  /**
   */
  legendName: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },

  /**
   */
  legendAmount: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },

  /**
   */
  legendPercentage: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },

  /**
   * Provides functionality.
   * (Note: Marked as legacy as the primary category display now uses
   * `categoryLegendGrid`).
   * `categoryLegendGrid`)
   */
  categoryList: {
    gap: 10, // Space between category items
  },

  /**
   * Arranges layout.
   * (Note: Marked as legacy as the primary category display now uses
   * `legendItem`).
   */
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  /**
   */
  categoryText: {
    fontSize: 14,
    color: colors.text.primary,
  },

  // === TRANSACTION SECTION STYLES ===

  /**
   * Provides functionality.
   */
  transactionList: {
    gap: 10,
  },

  /**
   * Displays icon, details, and amount horizontally with card-like styling
   * and shadow.
   */
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 15,
    borderRadius: 12,
    ...cardShadow,
  },

  /**
   * spacing.
   */
  transactionIcon: {
    marginRight: 15,
  },

  /**
   * Takes up remaining horizontal space.
   */
  transactionDetails: {
    flex: 1, // Take remaining space
  },

  /**
   */
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },

  /**
   */
  transactionTime: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },

  /**
   * Note: The color is set dynamically based on the amount (income/expense).
   */
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    // Color is set dynamically
  },

  // === BILLS SECTION STYLES ===

  /**
   * Provides functionality.
   */
  billsList: {
    gap: 10,
  },

  /**
   * Displays content.
   */
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 15,
    borderRadius: 12,
    gap: 10,
    ...cardShadow,
  },

  /**
   */
  billText: {
    fontSize: 14,
    color: colors.text.primary,
  },
});
