'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { embedText } from '@utils/hackbot/embedText';

export interface ReseedResult {
  ok: boolean;
  successCount: number;
  failureCount: number;
  failures: string[];
  error?: string;
}

/**
 * Re-embeds all docs from hackbot_knowledge into hackbot_docs.
 * Does NOT touch event docs (those are seeded from the events collection via CI).
 */
export default async function reseedHackbot(): Promise<ReseedResult> {
  try {
    const db = await getDatabase();
    const knowledgeDocs = await db
      .collection('hackbot_knowledge')
      .find({})
      .toArray();

    if (knowledgeDocs.length === 0) {
      return {
        ok: false,
        successCount: 0,
        failureCount: 0,
        failures: [],
        error: 'No knowledge documents found. Add some docs first.',
      };
    }

    let successCount = 0;
    const failures: string[] = [];

    for (const doc of knowledgeDocs) {
      const id = String(doc._id);
      try {
        const embedding = await embedText(doc.content);

        await db.collection('hackbot_docs').updateOne(
          { _id: `knowledge-${id}` },
          {
            $set: {
              type: doc.type,
              title: doc.title,
              text: doc.content,
              url: doc.url ?? null,
              embedding,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );

        successCount++;
        console.log(`[reseedHackbot] ✓ knowledge-${id}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        console.error(`[reseedHackbot] ✗ knowledge-${id}:`, msg);
        failures.push(`${doc.title}: ${msg}`);
      }
    }

    console.log(
      `[reseedHackbot] Done: ${successCount}/${knowledgeDocs.length} re-seeded`
    );

    return {
      ok: failures.length === 0,
      successCount,
      failureCount: failures.length,
      failures,
    };
  } catch (e) {
    console.error('[reseedHackbot] Fatal error', e);
    return {
      ok: false,
      successCount: 0,
      failureCount: 0,
      failures: [],
      error: e instanceof Error ? e.message : 'Unexpected error',
    };
  }
}
