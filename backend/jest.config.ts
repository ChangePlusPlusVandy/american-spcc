/**
 * Jest configuration for the backend (TypeScript + Node + Prisma)
 * Docs: https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // use ts-jest for TypeScript support
  testEnvironment: 'node', // backend environment
  clearMocks: true, // auto clear mocks between tests
  verbose: true, // show individual test results
  testMatch: ['**/tests/**/*.ts', '**/__tests__/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
};

export default config;
