module.exports = {
  // The root directory that Jest should scan for tests and modules
  rootDir: '.',
  
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // An array of regexp pattern strings that are matched against all test paths
  // matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/'
  ],
  
  // An array of regexp pattern strings that are matched against all source file paths
  // matched files will be skipped by the coverage calculation
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/__tests__/'
  ],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  
  // Setup files that will be executed before each test file
  setupFilesAfterEnv: ['./jest.setup.js']
};