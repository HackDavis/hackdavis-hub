import { test as base } from '@playwright/test';
import { MongoClient, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import { up } from 'migrate-mongo';
// import path from 'path';
// import { fileURLToPath } from 'url';

// https://playwright.dev/docs/test-fixtures
type MongoFixture = {
  mongoServer: MongoMemoryServer;
  mongoClient: MongoClient;
  db: Db;
};

const getTestClient = async (mongoServer: MongoMemoryServer) => {
  const uri = mongoServer.getUri();
  const client = new MongoClient(uri);
  await client.connect();
  return client;
};

export const test = base.extend<MongoFixture>({
  // eslint-disable-next-line no-empty-pattern
  mongoServer: async ({}, use) => {
    const mongoServer = await MongoMemoryServer.create();
    await use(mongoServer);
    await mongoServer.stop();
  },

  mongoClient: async ({ mongoServer }, use) => {
    const testClient = await getTestClient(mongoServer);

    await use(testClient);
    //   (global as any).getClient = () => getTestClient;
    //   await use(testClient);
    //   delete (global as any).getClient;

    await testClient.close();
  },

  db: async (
    { mongoClient }: { mongoClient: MongoClient },
    use: (db: Db) => Promise<void>
  ) => {
    const db = mongoClient.db('test-db');
    await use(db);
  },
});
