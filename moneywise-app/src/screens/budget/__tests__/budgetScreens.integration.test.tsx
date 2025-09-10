import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { BudgetOverviewSection } from '../BudgetOverviewSection';

// Mock the currencyUtils to ensure consistent formatting in tests
jest.mock('../../../utils/currencyUtils', () => ({
    toNumber: jest.fn((amount: string) => parseFloat(amount)),
    formatAmount: jest.fn((amount: string) => `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
}));

describe('BudgetOverviewSection Integration Tests', () => {
    /**
     * Test Case: Initial render with valid data
     * Purpose: Verifies that the BudgetOverviewSection component correctly displays
     *          planned, spent, and remaining amounts, along with calculated percentages,
     *          when provided with valid and realistic budget data.
     *          This ensures the core display logic and data transformations are working as expected.
     */
    test('should display correct planned, spent, and remaining amounts with valid data', async () => {
        const mockOverview = {
            planned: "1000.00",
            spent: "300.00",
            remaining: "700.00",
        };
        const mockPeriod = "This Month";

        render(<BudgetOverviewSection overview={mockOverview} period={mockPeriod} />);

        // Use waitFor to ensure all asynchronous updates (like icon loading) have completed
        // before making assertions, which helps resolve the "not wrapped in act(...)" warning.
        await waitFor(() => {
            // Verify Planned Budget Card
            expect(screen.getByText('Planned Budget')).toBeTruthy();
            expect(screen.getByText(mockPeriod)).toBeTruthy();
            expect(screen.getByText('$1,000.00')).toBeTruthy(); // Formatted amount
            expect(screen.getByText('30% spent')).toBeTruthy(); // (300/1000)*100 = 30%

            // Verify Spent Card
            expect(screen.getByText('Spent')).toBeTruthy();
            expect(screen.getByText('$300.00')).toBeTruthy(); // Formatted amount
            expect(screen.getByText('On Track')).toBeTruthy();

            // Verify Remaining Card
            expect(screen.getByText('Remaining')).toBeTruthy();
            expect(screen.getByText('$700.00')).toBeTruthy(); // Formatted amount
        });
    });
});
