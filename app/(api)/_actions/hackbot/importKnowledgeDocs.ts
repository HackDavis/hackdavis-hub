'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { embedText } from '@utils/hackbot/embedText';
import { HackDocType } from '@typeDefs/hackbot';

export interface ImportDocInput {
  type: HackDocType;
  title: string;
  content: string;
  url?: string | null;
}

export interface ImportKnowledgeDocsResult {
  ok: boolean;
  successCount: number;
  failureCount: number;
  failures: string[];
  error?: string;
}

const VALID_TYPES = new Set<HackDocType>([
  'judging',
  'submission',
  'faq',
  'general',
  'track',
  'event',
]);

export default async function importKnowledgeDocs(
  docs: ImportDocInput[]
): Promise<ImportKnowledgeDocsResult> {
  if (!Array.isArray(docs) || docs.length === 0) {
    return {
      ok: false,
      successCount: 0,
      failureCount: 0,
      failures: [],
      error: 'No documents provided.',
    };
  }

  const db = await getDatabase();
  const now = new Date();
  let successCount = 0;
  const failures: string[] = [];

  for (const doc of docs) {
    const label = doc.title || '(untitled)';

    if (!doc.title?.trim() || !doc.content?.trim()) {
      failures.push(`${label}: title and content are required`);
      continue;
    }

    if (!VALID_TYPES.has(doc.type)) {
      failures.push(`${label}: invalid type "${doc.type}"`);
      continue;
    }

    try {
      // Insert into hackbot_knowledge
      const result = await db.collection('hackbot_knowledge').insertOne({
        type: doc.type,
        title: doc.title.trim(),
        content: doc.content.trim(),
        url: doc.url ?? null,
        createdAt: now,
        updatedAt: now,
      });

      const newId = String(result.insertedId);

      // Embed and upsert into hackbot_docs
      const embedding = await embedText(doc.content.trim());
      await db.collection('hackbot_docs').updateOne(
        { _id: `knowledge-${newId}` },
        {
          $set: {
            type: doc.type,
            title: doc.title.trim(),
            text: doc.content.trim(),
            url: doc.url ?? null,
            embedding,
            updatedAt: now,
          },
        },
        { upsert: true }
      );

      successCount++;
      console.log(`[importKnowledgeDocs] ✓ ${label}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      console.error(`[importKnowledgeDocs] ✗ ${label}:`, msg);
      failures.push(`${label}: ${msg}`);
    }
  }

  return {
    ok: failures.length === 0,
    successCount,
    failureCount: failures.length,
    failures,
  };
}
