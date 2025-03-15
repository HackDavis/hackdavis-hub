import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

export async function getClient() {
  if (global.__TEST_CLIENT__) {
    return global.__TEST_CLIENT__;
  }

  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri);
  cachedClient = client;
  return cachedClient;
}

export async function getDatabase() {
  const client = await getClient();
  return client.db();
}
