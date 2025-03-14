module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: '<rootDir>/../coverage',
  testEnvironment: 'node',
  rootDir: 'src',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  setupFiles: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/application/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@di/(.*)$': '<rootDir>/di/$1',
    '^@domain/(.*)$': '<rootDir>/domain/$1',
    '^@infra/(.*)$': '<rootDir>/infra/$1',
    '^@logger/(.*)$': '<rootDir>/logger/$1',
    '^@presentation/(.*)$': '<rootDir>/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@src/(.*)$': '<rootDir>/$1',
  },
}
