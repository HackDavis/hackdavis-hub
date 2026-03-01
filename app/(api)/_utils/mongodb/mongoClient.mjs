import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedPromise = null;

export async function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.');
  }

  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    const client = new MongoClient(uri, {
      // Connection pooling
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 5000,

      // Prevent connection overhead
      retryWrites: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedPromise = client
      .connect()
      .then((connectedClient) => {
        cachedClient = connectedClient;
        return connectedClient;
      })
      .catch((error) => {
        client.close().catch(() => {});
        cachedPromise = null;
        cachedClient = null;
        throw error;
      });
  }

  return cachedPromise;
}

// Helper function for testing
export async function resetClient() {
  cachedClient = null;
  cachedPromise = null;
}

export async function getDatabase() {
  const client = await getClient();
  return client.db();
}
