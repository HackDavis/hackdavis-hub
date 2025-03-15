import { test as base } from '@playwright/test';
import { MongoClient, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import migrate from 'migrate-mongo';
import generateData from '../scripts/generateData.mjs';

// https://playwright.dev/docs/test-fixtures
type MongoFixture = {
  mongoServer: MongoMemoryServer;
  mongoClient: MongoClient;
  db: Db;
  seedData: (collectionName: string, numDocs: number) => Promise<void>;
};

export const test = base.extend<MongoFixture>({
  // eslint-disable-next-line no-empty-pattern
  mongoServer: async ({}, use) => {
    const mongoServer = await MongoMemoryServer.create();
    await use(mongoServer);
    await mongoServer.stop();
  },

  mongoClient: async ({ mongoServer }, use) => {
    const uri = mongoServer.getUri();
    const testClient = new MongoClient(uri);
    await testClient.connect();

    (global as any).__TEST_CLIENT__ = testClient;

    await use(testClient);

    delete (global as any).__TEST_CLIENT__;
    await testClient.close();
  },

  db: async ({ mongoServer, mongoClient }, use) => {
    const db = mongoClient.db();

    const migrationConfig = {
      mongodb: { url: mongoServer.getUri() },
      migrationsDir: 'migrations',
      changelogCollectionName: 'changelog',
      migrationFileExtension: '.mjs',
      useFileHash: false,
      moduleSystem: 'esm',
    };
    await migrate.config.set(migrationConfig);
    await migrate.up(db, mongoClient);

    await use(db);
  },

  seedData: async ({ db }, use) => {
    const seedData = async (collectionName: string, numDocs: number) => {
      const collection = collectionName === 'admin' ? 'users' : collectionName;
      if (collection !== 'all') {
        const data = generateData(collection, numDocs);
        if (data.length !== 0) await db.collection(collection).insertMany(data);
        return;
      }

      const allCollections = await db.listCollections().toArray();
      allCollections.push({
        name: 'admin',
      });

      const insertPromises = allCollections.map(async (collection) => {
        const data = generateData(collection.name, numDocs);
        if (data.length === 0) return;
        await db
          .collection(collection.name === 'admin' ? 'users' : collection.name)
          .insertMany(data);
      });

      await Promise.all(insertPromises);
    };

    await use(seedData);
  },
});
