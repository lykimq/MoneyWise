module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: [
        '<rootDir>/src/__tests__/integration-setup.ts',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(msw)/)',
    ],
    testMatch: [
        '<rootDir>/src/**/*demo*.integration.test.ts',
        '<rootDir>/src/**/*calculations*.integration.test.ts',
        '<rootDir>/src/utils/**/*.integration.test.ts',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/src/__tests__/setup.ts',
        '<rootDir>/src/__tests__/integration-setup.ts',
        '<rootDir>/src/__tests__/test-utils.tsx',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/**/*.test.*',
        '!src/**/*.spec.*',
    ],
    coverageDirectory: 'coverage',
    testTimeout: 10000,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
