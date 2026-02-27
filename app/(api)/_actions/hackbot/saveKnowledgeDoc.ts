'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import { embedText } from '@utils/hackbot/embedText';
import { HackDocType } from '@datalib/hackbot/hackbotTypes';

export interface SaveKnowledgeDocInput {
  id?: string; // If provided, update existing; otherwise create new
  type: HackDocType;
  title: string;
  content: string;
  url: string | null;
}

export interface SaveKnowledgeDocResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export default async function saveKnowledgeDoc(
  input: SaveKnowledgeDocInput
): Promise<SaveKnowledgeDocResult> {
  const { id, type, title, content, url } = input;

  if (!title.trim() || !content.trim()) {
    return { ok: false, error: 'Title and content are required.' };
  }

  try {
    const db = await getDatabase();
    const now = new Date();

    // Embed the content for vector search
    const embedding = await embedText(content);

    if (id) {
      // Update existing
      const objectId = new ObjectId(id);
      await db.collection('hackbot_knowledge').updateOne(
        { _id: objectId },
        {
          $set: { type, title, content, url: url ?? null, updatedAt: now },
        }
      );

      // Re-embed in hackbot_docs
      await db.collection('hackbot_docs').updateOne(
        { _id: `knowledge-${id}` },
        {
          $set: {
            type,
            title,
            text: content,
            url: url ?? null,
            embedding,
            updatedAt: now,
          },
        },
        { upsert: true }
      );

      console.log(`[saveKnowledgeDoc] Updated ${id}`);
      return { ok: true, id };
    } else {
      // Create new
      const result = await db.collection('hackbot_knowledge').insertOne({
        type,
        title,
        content,
        url: url ?? null,
        createdAt: now,
        updatedAt: now,
      });

      const newId = String(result.insertedId);

      // Embed into hackbot_docs
      await db.collection('hackbot_docs').updateOne(
        { _id: `knowledge-${newId}` },
        {
          $set: {
            type,
            title,
            text: content,
            url: url ?? null,
            embedding,
            updatedAt: now,
          },
        },
        { upsert: true }
      );

      console.log(`[saveKnowledgeDoc] Created ${newId}`);
      return { ok: true, id: newId };
    }
  } catch (e) {
    console.error('[saveKnowledgeDoc] Error', e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Failed to save document',
    };
  }
}
