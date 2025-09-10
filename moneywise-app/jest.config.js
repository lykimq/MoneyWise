/**
 * JEST CONFIGURATION FILE - EDUCATIONAL GUIDE
 *
 * This file configures Jest (JavaScript testing framework) for our MoneyWise app.
 * Jest is the most popular testing framework for React/React Native applications.
 *
 * LEARNING OBJECTIVES:
 * 1. Understand how Jest finds and runs tests
 * 2. Learn about test environment setup
 * 3. Understand file transformations and module resolution
 * 4. Learn about test patterns and exclusions
 *
 * WHY THIS CONFIGURATION EXISTS:
 * - Without proper configuration, Jest might not find our tests
 * - React Native and TypeScript need special handling
 * - We need to mock certain modules that don't work in test environment
 * - We want to run only specific types of tests (integration tests)
 */

module.exports = {
    // Use the jest-expo preset for React Native projects
    preset: 'jest-expo',

    // SETUP FILES
    // These files run AFTER Jest environment is set up, BEFORE each test file
    // Perfect place to configure mocks, global utilities, and test helpers
    setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"], // Setup file for React Native Testing Library

    // FILE TRANSFORMATIONS
    // Jest doesn't understand TypeScript by default, so we need to transform it
    // ts-jest converts TypeScript files to JavaScript before running tests
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            babelConfig: true, // Use babel.config.js for transformation
        }],
    },

    // TRANSFORM IGNORE PATTERNS
    // By default, Jest ignores node_modules, but some packages need transformation
    // For React Native, many modules need to be transformed.
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|msw)',
    ],

    // TEST MATCHING PATTERNS
    // These patterns tell Jest which files contain tests
    // Jest will ONLY run files that match these patterns
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{test,integration.test}.{ts,tsx}',  // All test files in __tests__ directories
        '<rootDir>/src/**/*demo*.integration.test.{ts,tsx}',                 // Demo tests (learning examples)
        '<rootDir>/src/**/*calculations*.integration.test.{ts,tsx}',         // Business logic tests
        '<rootDir>/src/utils/**/*.integration.test.{ts,tsx}',                // Utility function tests
    ],

    // TEST PATH IGNORE PATTERNS
    // Files that Jest should completely ignore (won't run as tests)
    // These are helper files, not actual test files
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',                        // Never run node_modules as tests
    ],

    // CODE COVERAGE CONFIGURATION
    // Tells Jest which files to include when calculating test coverage
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',    // Include all TypeScript files in src
        '!src/**/*.d.ts',       // Exclude TypeScript definition files
        '!src/**/__tests__/**', // Exclude test directories from coverage
        '!src/**/*.test.*',     // Exclude test files from coverage
        '!src/**/*.spec.*',     // Exclude spec files from coverage
    ],

    // COVERAGE OUTPUT
    // Where to save coverage reports (HTML, JSON, etc.)
    coverageDirectory: 'coverage',

    // TEST TIMEOUT
    // Maximum time (in milliseconds) a test can run before being killed
    // Integration tests often need more time than unit tests
    testTimeout: 10000,  // 10 seconds - generous for integration tests

    // MODULE NAME MAPPING
    // Allows us to use absolute imports like '@/components/Button'
    // This maps '@/' to 'src/' directory
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',  // '@/utils/helper' becomes 'src/utils/helper'
    },

    // FILE EXTENSIONS
    // File extensions Jest should recognize as modules
    // Order matters - Jest tries them in this order
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
