// Jest config for Next.js 14+ with TypeScript
// Separates "unit" (logic, in-memory) from "integration" (hits live Neon DB)
// and "bench" (performance measurements) via testPathIgnorePatterns.

const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  // Each integration test hits a real DB — give them a generous timeout
  testTimeout: 30000,
}

module.exports = createJestConfig(customJestConfig)
