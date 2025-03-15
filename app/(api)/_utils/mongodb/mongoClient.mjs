import { MongoClient } from 'mongodb';

const defaultUri = process.env.MONGODB_URI;
let cachedClient = null;

export async function getClient(uri) {
  if (cachedClient) {
    console.log('reusing cached client');
    return cachedClient;
  }
  console.log('using uri', uri || defaultUri);
  const client = new MongoClient(uri || defaultUri);
  cachedClient = client;
  return cachedClient;
}

export async function getDatabase() {
  const client = await getClient();
  return client.db();
}

export async function flushCache() {
  cachedClient = null;
}
