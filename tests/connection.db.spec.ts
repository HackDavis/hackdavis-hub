import { test } from './test';
import { expect } from '@playwright/test';

test('testing connection to in-memory database', async ({
  mongoServer,
  mongoClient,
  db,
}) => {
  expect(mongoServer.getUri()).toBe;
  expect((mongoClient as any).s.url).toBe(mongoServer.getUri());
  expect(db.databaseName).toBe('test');
});

test('testing migration', async ({ db }) => {
  const dbCollections = (await db.listCollections().toArray()).map(
    (c) => c.name
  );
  expect(dbCollections).toContain('events');
  expect(dbCollections).toContain('submissions');
  expect(dbCollections).toContain('teams');
  expect(dbCollections).toContain('users');
  expect(dbCollections).toContain('userToEvents');
  expect(dbCollections).toContain('changelog');
});

test('generating collections with 10 documents', async ({ db, seedData }) => {
  await seedData('all', 10);

  const dbCollections = (await db.listCollections().toArray())
    .map((c) => c.name)
    .filter((c) => c !== 'changelog' && c !== 'userToEvents');

  const findPromises = dbCollections.map(async (collection) => {
    const docs = await db.collection(collection).find({}).toArray();
    expect(docs.length).toBe(collection === 'users' ? 21 : 10);
  });

  await Promise.all(findPromises);
});

test('admin login', async ({ mongoServer, mongoClient, adminUser }) => {
  expect((mongoClient as any).s.url).toBe(mongoServer.getUri());

  expect(adminUser.ok).toBe(true);
  expect(adminUser.body).toBe('Successfully logged in');
  expect(adminUser.error).toBe(null);
});
