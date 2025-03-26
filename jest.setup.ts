import { Db, MongoClient } from 'mongodb';
import { getClient, getDatabase } from '@utils/mongodb/mongoClient.mjs';
import migrate from 'migrate-mongo';
import migrationConfig from './migrate-mongo-config';

let client: MongoClient;
let db: Db;

beforeAll(async () => {
  client = await getClient();
  db = await getDatabase();

  await migrate.config.set(migrationConfig);
  await migrate.up(db, client);
});

afterAll(async () => {
  await db.dropDatabase();
  await client.close();
});

export { db };
