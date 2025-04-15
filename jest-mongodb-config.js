module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: "8.0.5",
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: "jest-test-db",
    },
  },

  mongoURLEnvName: "MONGODB_URI",
};
