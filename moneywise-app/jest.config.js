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
    // TEST ENVIRONMENT
    // 'node' environment is faster and suitable for logic testing
    // Alternative: 'jsdom' for DOM-heavy React components
    testEnvironment: 'node',

    // SETUP FILES
    // These files run AFTER Jest environment is set up, BEFORE each test file
    // Perfect place to configure mocks, global utilities, and test helpers
    // Currently no setup files needed since tests are standalone
    setupFilesAfterEnv: [],

    // FILE TRANSFORMATIONS
    // Jest doesn't understand TypeScript by default, so we need to transform it
    // ts-jest converts TypeScript files to JavaScript before running tests
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',  // Transform all .ts and .tsx files using ts-jest
    },

    // TRANSFORM IGNORE PATTERNS
    // By default, Jest ignores node_modules, but some packages need transformation
    // MSW (Mock Service Worker) is written in modern JS and needs to be transformed
    transformIgnorePatterns: [
        'node_modules/(?!(msw)/)',  // Transform everything in node_modules EXCEPT msw
    ],

    // TEST MATCHING PATTERNS
    // These patterns tell Jest which files contain tests
    // Jest will ONLY run files that match these patterns
    testMatch: [
        '<rootDir>/src/**/*demo*.integration.test.ts',         // Demo tests (learning examples)
        '<rootDir>/src/**/*calculations*.integration.test.ts', // Business logic tests
        '<rootDir>/src/utils/**/*.integration.test.ts',        // Utility function tests
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
