import { Db, MongoClient } from 'mongodb';
import { getClient, getDatabase } from '@utils/mongodb/mongoClient.mjs';
import migrate from 'migrate-mongo';
import migrationConfig from './migrate-mongo-config';

let client: MongoClient;
let db: Db;

beforeAll(async () => {
  client = await getClient();
  db = await getDatabase();

  await db.dropDatabase();
  await migrate.config.set(migrationConfig);
  try {
    await migrate.up(db, client);
  } catch (error) {
    console.error('migrating up failed');
    console.error(error);
  }
});

afterAll(async () => {
  try {
    await migrate.down(db, client);
  } catch (error) {
    console.error('migrating down failed');
    console.error(error);
  }
  await client.close();
});

export { db };
