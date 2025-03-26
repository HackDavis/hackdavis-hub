module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest-test-db',
    },
  },

  mongoURLEnvName: 'MONGODB_URI',
};
