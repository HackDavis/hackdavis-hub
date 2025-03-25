import { MongoClient } from 'mongodb';
import {
  storeClientDetails,
  getStoredClientUri,
  clearClientStore,
} from './clientStorage.mjs';

const defaultUri = process.env.MONGODB_URI;
let cachedClient = null;

export async function getClient(uri) {
  if (cachedClient) {
    console.error('Using cached client.');
    return cachedClient;
  }

  let connectionUri = null;
  if (process.env.NODE_ENV === 'test') {
    connectionUri = uri || getStoredClientUri();
    console.error('Using test uri: ', connectionUri);
  }

  console.error('create new client');
  const client = new MongoClient(connectionUri ?? defaultUri);
  await client.connect();

  cachedClient = client;
  storeClientDetails(connectionUri);
  return cachedClient;
}

export async function getDatabase() {
  const client = await getClient();
  return client.db();
}

export async function flushCache() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    clearClientStore();
  }
}
