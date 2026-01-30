import { HackDoc, HackDocType } from './hackbotTypes';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';

export interface RetrievedContext {
  docs: HackDoc[];
  usage?: {
    promptTokens?: number;
    totalTokens?: number;
  };
}

function formatEventDateTime(raw: unknown): string | null {
  let date: Date | null = null;

  if (raw instanceof Date) {
    date = raw;
  } else if (typeof raw === 'string') {
    date = new Date(raw);
  } else if (raw && typeof raw === 'object' && '$date' in (raw as any)) {
    date = new Date((raw as any).$date);
  }

  if (!date || Number.isNaN(date.getTime())) return null;

  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatLiveEventDoc(event: any): {
  title: string;
  text: string;
  url: string;
  startISO?: string;
  endISO?: string;
} {
  const title = String(event?.name || 'Event');
  const type = event?.type ? String(event.type) : '';
  const start = formatEventDateTime(event?.start_time);
  const end = formatEventDateTime(event?.end_time);
  const location = event?.location ? String(event.location) : '';
  const host = event?.host ? String(event.host) : '';
  const tags = Array.isArray(event?.tags) ? event.tags.map(String) : [];

  const parts = [
    `Event: ${title}`,
    type ? `Type: ${type}` : '',
    // Machine-readable anchors to allow reliable chronological ordering.
    event?.start_time instanceof Date
      ? `StartISO: ${event.start_time.toISOString()}`
      : '',
    event?.end_time instanceof Date
      ? `EndISO: ${event.end_time.toISOString()}`
      : '',
    start ? `Starts (Pacific Time): ${start}` : '',
    end ? `Ends (Pacific Time): ${end}` : '',
    location ? `Location: ${location}` : '',
    host ? `Host: ${host}` : '',
    tags.length ? `Tags: ${tags.join(', ')}` : '',
  ].filter(Boolean);

  return {
    title,
    text: parts.join('\n'),
    url: '/hackers/hub/schedule',
    startISO:
      event?.start_time instanceof Date
        ? event.start_time.toISOString()
        : undefined,
    endISO:
      event?.end_time instanceof Date
        ? event.end_time.toISOString()
        : undefined,
  };
}

async function getQueryEmbedding(query: string): Promise<{
  embedding: number[];
  usage?: {
    promptTokens?: number;
    totalTokens?: number;
  };
} | null> {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

  try {
    const startedAt = Date.now();
    const res = await fetch(`${ollamaUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3.2', prompt: query }),
    });

    if (!res.ok) {
      console.error(
        '[hackbot][embeddings] Upstream error',
        res.status,
        res.statusText
      );
      return null;
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.embedding)) {
      console.error('[hackbot][embeddings] Invalid response shape');
      return null;
    }

    const promptTokens =
      typeof data?.prompt_eval_count === 'number'
        ? data.prompt_eval_count
        : undefined;
    const totalTokens =
      typeof data?.eval_count === 'number'
        ? data.eval_count
        : typeof promptTokens === 'number'
        ? promptTokens
        : undefined;

    console.log('[hackbot][ollama][embeddings]', {
      model: data?.model ?? 'unknown',
      promptTokens,
      totalTokens,
      ms: Date.now() - startedAt,
    });

    return {
      embedding: data.embedding as number[],
      usage: {
        promptTokens,
        totalTokens,
      },
    };
  } catch (err) {
    console.error('[hackbot][embeddings] Failed to get embedding', err);
    return null;
  }
}

export async function retrieveContext(
  query: string,
  opts?: { limit?: number; preferredTypes?: HackDocType[] }
): Promise<RetrievedContext> {
  const limit = opts?.limit ?? 25;
  const trimmed = query.trim();

  // Vector-only search over hackbot_docs in MongoDB.
  try {
    const embeddingResult = await getQueryEmbedding(trimmed);
    if (!embeddingResult) {
      console.error(
        '[hackbot][retrieve] No embedding available for query; vector search required.'
      );
      throw new Error('Embedding unavailable');
    }

    const embedding = embeddingResult.embedding;

    const db = await getDatabase();
    const collection = db.collection('hackbot_docs');

    const preferredTypes = opts?.preferredTypes?.length
      ? Array.from(new Set(opts.preferredTypes))
      : null;

    const numCandidates = Math.min(200, Math.max(50, limit * 10));

    const vectorResults = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: 'hackbot_vector_index',
            queryVector: embedding,
            path: 'embedding',
            numCandidates,
            limit,
            ...(preferredTypes
              ? {
                  filter: {
                    type: { $in: preferredTypes },
                  },
                }
              : {}),
          },
        },
      ])
      .toArray();

    if (!vectorResults.length) {
      console.warn('[hackbot][retrieve] Vector search returned no results.');
      return { docs: [] };
    }

    const docs: HackDoc[] = vectorResults.map((doc: any) => ({
      id: String(doc._id),
      type: doc.type,
      title: doc.title,
      text: doc.text,
      url: doc.url ?? undefined,
    }));

    // Hydrate event docs from the live `events` collection so the answer
    // always reflects the current schedule (times/locations), even if the
    // vector index was seeded earlier.
    const eventsCollection = db.collection('events');
    await Promise.all(
      docs.map(async (d) => {
        if (d.type !== 'event') return;

        const suffix = d.id.startsWith('event-')
          ? d.id.slice('event-'.length)
          : '';
        let event: any | null = null;

        if (suffix && ObjectId.isValid(suffix)) {
          event = await eventsCollection.findOne({ _id: new ObjectId(suffix) });
        }

        if (!event && d.title) {
          event = await eventsCollection.findOne({ name: d.title });
        }

        if (!event) return;

        const live = formatLiveEventDoc(event);
        d.title = live.title;
        d.text = live.text;
        d.url = live.url;

        // Attach sortable timestamps for server-side ordering.
        (d as any).startISO = live.startISO;
        (d as any).endISO = live.endISO;
      })
    );

    console.log('[hackbot][retrieve][vector]', {
      query: trimmed,
      docIds: docs.map((d) => d.id),
      titles: docs.map((d) => d.title),
    });

    return { docs, usage: embeddingResult.usage };
  } catch (err) {
    console.error(
      '[hackbot][retrieve] Vector search failed (no fallback).',
      err
    );
    throw err;
  }
}
