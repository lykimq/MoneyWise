import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { BudgetOverviewSection } from '../BudgetOverviewSection';

// Mock the currencyUtils to ensure consistent formatting in tests
jest.mock('../../../utils/currencyUtils', () => ({
  toNumber: jest.fn((amount: string) => parseFloat(amount)),
  formatAmount: jest.fn(
    (amount: string) =>
      `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  ),
}));

/**
 * Integration Tests for Budget Screens
 *
 * Tests React Native component rendering and data display for budget overview.
 * Verifies component integration with mocked utilities and proper data formatting.
 */

describe('BudgetOverviewSection Integration Tests', () => {
  // Tests component rendering with valid budget data
  test('should display correct planned, spent, and remaining amounts with valid data', async () => {
    const mockOverview = {
      planned: '1000.00',
      spent: '300.00',
      remaining: '700.00',
    };
    const mockPeriod = 'This Month';

    render(
      <BudgetOverviewSection overview={mockOverview} period={mockPeriod} />
    );

    await waitFor(() => {
      // Verify Planned Budget Card
      expect(screen.getByText('Planned Budget')).toBeTruthy();
      expect(screen.getByText(mockPeriod)).toBeTruthy();
      expect(screen.getByText('$1,000.00')).toBeTruthy();
      expect(screen.getByText('30% spent')).toBeTruthy();

      // Verify Spent Card
      expect(screen.getByText('Spent')).toBeTruthy();
      expect(screen.getByText('$300.00')).toBeTruthy();
      expect(screen.getByText('On Track')).toBeTruthy();

      // Verify Remaining Card
      expect(screen.getByText('Remaining')).toBeTruthy();
      expect(screen.getByText('$700.00')).toBeTruthy();
    });
  });
});
