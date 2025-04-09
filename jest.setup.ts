import { Db, MongoClient } from 'mongodb';
import { getClient, getDatabase } from '@utils/mongodb/mongoClient.mjs';
import migrate from 'migrate-mongo';
import migrationConfig from './migrate-mongo-config';
import fs from 'fs';
import path from 'path';

let client: MongoClient;
let db: Db;

beforeAll(async () => {
  client = await getClient();
  db = await getDatabase();

  await db.dropDatabase();
  await migrate.config.set(migrationConfig);
  try {
    await applyTestMigrations(db, client);
  } catch (error) {
    console.error('Error migrating up:', error);
  }
});

afterAll(async () => {
  try {
    await migrate.down(db, client);
  } catch (error) {
    console.error('Error migrating down:', error);
  }
  await client.close();
});

export { db };

// function to run create before update migrations in test env
async function applyTestMigrations(db: Db, client: MongoClient) {
  const migrationDir = path.join(__dirname, './migrations');

  const migrationFiles = fs.readdirSync(migrationDir);

  // separate create migrations from others
  const createMigrations = migrationFiles.filter((file) =>
    file.includes('create')
  );
  const otherMigrations = migrationFiles.filter(
    (file) => !file.includes('create')
  );

  const orderedMigrations = [...createMigrations, ...otherMigrations];

  for (const migrationFile of orderedMigrations) {
    const migration = await import(path.join(migrationDir, migrationFile));
    await migration.up(db, client);
  }
}
