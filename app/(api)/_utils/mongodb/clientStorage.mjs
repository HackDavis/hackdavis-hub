import fs from 'fs';
import path from 'path';

// these functions are only used during testing

const TESTING_CLIENT_STORE_PATH = path.resolve(
  process.cwd(),
  '.mongo-client-store.json'
);

export async function storeClientDetails(uri) {
  const details = { uri };
  fs.writeFileSync(TESTING_CLIENT_STORE_PATH, JSON.stringify(details), 'utf8');
}

export function getStoredClientUri() {
  try {
    const rawData = fs.readFileSync(TESTING_CLIENT_STORE_PATH, 'utf8');
    const { uri } = JSON.parse(rawData);
    return uri;
  } catch (error) {
    return null;
  }
}

export function clearClientStore() {
  try {
    fs.unlinkSync(TESTING_CLIENT_STORE_PATH);
  } catch (error) {
    // Ignore if file doesn't exist
  }
}
