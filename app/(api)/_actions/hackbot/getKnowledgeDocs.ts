'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HackDocType } from '@typeDefs/hackbot';

export interface KnowledgeDoc {
  id: string;
  type: HackDocType;
  title: string;
  content: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetKnowledgeDocsResult {
  ok: boolean;
  docs: KnowledgeDoc[];
  error?: string;
}

export default async function getKnowledgeDocs(): Promise<GetKnowledgeDocsResult> {
  try {
    const db = await getDatabase();
    const raw = await db
      .collection('hackbot_knowledge')
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    const docs: KnowledgeDoc[] = raw.map((d: any) => ({
      id: String(d._id),
      type: d.type,
      title: d.title,
      content: d.content,
      url: d.url ?? null,
      createdAt: d.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: d.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    }));

    return { ok: true, docs };
  } catch (e) {
    console.error('[getKnowledgeDocs] Error', e);
    return {
      ok: false,
      docs: [],
      error: e instanceof Error ? e.message : 'Failed to load knowledge docs',
    };
  }
}
