'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';

export interface DeleteKnowledgeDocResult {
  ok: boolean;
  error?: string;
}

export default async function deleteKnowledgeDoc(
  id: string
): Promise<DeleteKnowledgeDocResult> {
  try {
    const db = await getDatabase();
    const objectId = new ObjectId(id);

    await db.collection('hackbot_knowledge').deleteOne({ _id: objectId });
    await db.collection('hackbot_docs').deleteOne({ _id: `knowledge-${id}` });

    console.log(`[deleteKnowledgeDoc] Deleted ${id}`);
    return { ok: true };
  } catch (e) {
    console.error('[deleteKnowledgeDoc] Error', e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Failed to delete document',
    };
  }
}
