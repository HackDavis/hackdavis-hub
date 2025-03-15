import { test as base } from '@playwright/test';
import { MongoClient, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// https://playwright.dev/docs/test-fixtures
type MongoFixture = {
  mongoServer: MongoMemoryServer;
  mongoClient: MongoClient;
  db: Db;
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

  db: async (
    { mongoClient }: { mongoClient: MongoClient },
    use: (db: Db) => Promise<void>
  ) => {
    const db = mongoClient.db();
    await use(db);
  },
});
