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
  await migrate.up(db, client);
});

afterAll(async () => {
  await migrate.down(db, client);
  await client.close();
});

export { db };
