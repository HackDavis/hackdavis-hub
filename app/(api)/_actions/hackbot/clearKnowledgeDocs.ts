'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';

export interface ClearKnowledgeDocsResult {
  ok: boolean;
  deletedKnowledge: number;
  deletedEmbeddings: number;
  error?: string;
}

export default async function clearKnowledgeDocs(): Promise<ClearKnowledgeDocsResult> {
  try {
    const db = await getDatabase();

    const knowledgeResult = await db
      .collection('hackbot_knowledge')
      .deleteMany({});

    const embeddingsResult = await db
      .collection('hackbot_docs')
      .deleteMany({ _id: { $regex: '^knowledge-' } });

    return {
      ok: true,
      deletedKnowledge: knowledgeResult.deletedCount,
      deletedEmbeddings: embeddingsResult.deletedCount,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('[clearKnowledgeDocs] Error:', msg);
    return {
      ok: false,
      deletedKnowledge: 0,
      deletedEmbeddings: 0,
      error: msg,
    };
  }
}
