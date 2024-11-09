module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: [
    'vue',
    'js',
    'json',
    'ts',
    'tsx'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/unit/__mocks__/fileMock.js'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.[jt]s?(x)',
    '**/__tests__/*.[jt]s?(x)'
  ],
  testEnvironmentOptions: {
    customExportConditions: [
      'node',
      'node-addons'
    ]
  },
  setupFiles: [
    '<rootDir>/tests/unit/setup/setup.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/unit/setup/jest-setup.js'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.js'
  ],
  coverageReporters: [
    'text',
    'lcov'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
} 