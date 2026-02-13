'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';

export default async function checkTeamsPopulated() {
  try {
    const db = await getDatabase();
    const count = await db.collection('teams').countDocuments({});
    return { ok: true, populated: count > 0, count, error: null };
  } catch (e) {
    const error = e as Error;
    return { ok: false, populated: false, count: 0, error: error.message };
  }
}
