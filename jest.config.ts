const config = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(mjs|js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'ts', 'tsx'],
  moduleNameMapper: {
    '@globals/(.*)': '<rootDir>/app/(pages)/_globals/$1',
    '@components/(.*)': '<rootDir>/app/(pages)/_components/$1',
    //specific for tracks import since it dont deal with images
    '@data/tracks': '<rootDir>/__mocks__/tracks.ts',
    // general
    '@data/(.*)': '<rootDir>/app/_data/$1',
    '@hooks/(.*)': '<rootDir>/app/(pages)/_hooks/$1',
    '@actions/(.*)': '<rootDir>/app/(api)/_actions/$1',
    '@utils/(.*)': '<rootDir>/app/(api)/_utils/$1',
    '@apidata/(.*)': '<rootDir>/app/(api)/_data/$1',
    '@datalib/(.*)': '<rootDir>/app/(api)/_datalib/$1',
    '@typeDefs/(.*)': '<rootDir>/app/_types/$1',
    '@/auth': '<rootDir>/auth.ts',
    '@public/(.*)': '<rootDir>/public/$1',
  },
};

export default config;
