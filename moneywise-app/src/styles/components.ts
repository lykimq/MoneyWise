/**
 * MoneyWise Component Styles
 *
 * A comprehensive, functional style system that provides:
 *
 * 🎯 UTILITY FUNCTIONS: Dynamic style generation with type safety
 * 🏗️  COMPONENT STYLES: Pre-built styles for common UI patterns
 * 📐 LAYOUT HELPERS: Consistent spacing and alignment utilities
 * 🎨 THEME INTEGRATION: Seamless integration with design tokens
 * ⚡ PERFORMANCE: Optimized for minimal re-renders and memory usage
 *
 * This file now serves as a centralized export point for all component styles
 * that are organized into focused, maintainable files in the components/ folder.
 *
 * Usage Examples:
 * - createCardStyle('xl', '2xl') → Large card with extra elevation
 * - createTextStyle('3xl', 'bold') → Large bold text with theme colors
 * - mainCardStyles.card → Pre-built main dashboard card
 * - standardCardStyles.container → Consistent container spacing
 */

// Re-export all component styles from the organized folder structure
export * from './components/index';
