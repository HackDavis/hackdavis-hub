// Using require because this config file can't use ESM
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env' }); // migrate-mongo doesn't have access to automatically loaded Next.js environment files

const config = {
  mongodb: { url: process.env.MONGODB_URI },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.mjs',
  useFileHash: false,
  moduleSystem: 'esm',
};

module.exports = config;