import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  verbose: true,
  testMatch: ['**/tests/**/*.ts', '**/__tests__/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/prismaMock.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/setup/prismaMock.setup.ts'], 
};

export default config;
