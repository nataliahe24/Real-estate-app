const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  }),
  transform: {
    '^.+\\.(ts|js|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        useESM: true
      }
    ]
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov']
};
