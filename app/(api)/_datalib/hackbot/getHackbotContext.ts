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

interface QueryComplexity {
  type: 'simple' | 'moderate' | 'complex';
  docLimit: number;
  reason: string;
}

interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxAttempts,
    delayMs,
    backoffMultiplier,
    retryableErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'],
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;

      const isRetryable =
        retryableErrors.some((code) => err.message?.includes(code)) ||
        err.status === 429 || // Rate limit
        err.status === 500 || // Server error
        err.status === 502 || // Bad gateway
        err.status === 503 || // Service unavailable
        err.status === 504; // Gateway timeout

      if (!isRetryable || attempt === maxAttempts) {
        throw err;
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      console.log(
        `[hackbot][retry] Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delay}ms...`,
        err.message
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

function analyzeQueryComplexity(query: string): QueryComplexity {
  const trimmed = query.trim().toLowerCase();
  const words = trimmed.split(/\s+/);

  // Simple greeting or single fact
  if (words.length <= 5) {
    if (/^(hi|hello|hey|thanks|thank you|ok|okay)/.test(trimmed)) {
      return { type: 'simple', docLimit: 5, reason: 'greeting' };
    }
    if (/^(what|when|where|who)\s+(is|are)/.test(trimmed)) {
      return { type: 'simple', docLimit: 10, reason: 'single fact question' };
    }
  }

  // Timeline/schedule queries (need more docs)
  if (
    /\b(schedule|timeline|agenda|itinerary|all events|list)\b/.test(trimmed) ||
    (words.length >= 3 && /\b(what|show|tell)\b/.test(trimmed))
  ) {
    return { type: 'complex', docLimit: 30, reason: 'schedule/list query' };
  }

  // Multiple questions or comparisons
  if (
    /\b(and|or|versus|vs|compare)\b/.test(trimmed) ||
    (trimmed.match(/\?/g) || []).length > 1
  ) {
    return { type: 'complex', docLimit: 25, reason: 'multi-part query' };
  }

  // Moderate: specific event or detail
  return { type: 'moderate', docLimit: 15, reason: 'specific detail query' };
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

async function getGoogleEmbedding(query: string): Promise<{
  embedding: number[];
  usage?: {
    promptTokens?: number;
    totalTokens?: number;
  };
} | null> {
  try {
    const { embed } = await import('ai');
    const { google } = await import('@ai-sdk/google');

    const startedAt = Date.now();
    const model = process.env.GOOGLE_EMBEDDING_MODEL || 'text-embedding-004';

    const { embedding, usage } = await embed({
      model: google.textEmbeddingModel(model),
      value: query,
    });

    console.log('[hackbot][google][embeddings]', {
      model,
      tokens: usage.tokens,
      ms: Date.now() - startedAt,
    });

    return {
      embedding,
      usage: {
        promptTokens: usage.tokens,
        totalTokens: usage.tokens,
      },
    };
  } catch (err) {
    console.error('[hackbot][embeddings][google] Failed', err);
    return null;
  }
}

async function getOpenAIEmbedding(query: string): Promise<{
  embedding: number[];
  usage?: {
    promptTokens?: number;
    totalTokens?: number;
  };
} | null> {
  try {
    const { embed } = await import('ai');
    const { openai } = await import('@ai-sdk/openai');

    const startedAt = Date.now();
    const model =
      process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

    const { embedding, usage } = await embed({
      model: openai.embedding(model),
      value: query,
    });

    console.log('[hackbot][openai][embeddings]', {
      model,
      tokens: usage.tokens,
      ms: Date.now() - startedAt,
    });

    return {
      embedding,
      usage: {
        promptTokens: usage.tokens,
        totalTokens: usage.tokens,
      },
    };
  } catch (err) {
    console.error('[hackbot][embeddings][openai] Failed', err);
    return null;
  }
}

async function getOllamaEmbedding(query: string): Promise<{
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
    console.error('[hackbot][embeddings][ollama] Failed', err);
    return null;
  }
}

async function getQueryEmbedding(query: string): Promise<{
  embedding: number[];
  usage?: {
    promptTokens?: number;
    totalTokens?: number;
  };
} | null> {
  const mode = process.env.HACKBOT_MODE || 'google';

  if (mode === 'google') {
    return getGoogleEmbedding(query);
  } else if (mode === 'openai') {
    return getOpenAIEmbedding(query);
  } else {
    return getOllamaEmbedding(query);
  }
}

export async function retrieveContext(
  query: string,
  opts?: { limit?: number; preferredTypes?: HackDocType[] }
): Promise<RetrievedContext> {
  const trimmed = query.trim();

  // Analyze query complexity if no explicit limit provided
  let limit = opts?.limit;
  if (!limit) {
    const complexity = analyzeQueryComplexity(trimmed);
    limit = complexity.docLimit;
    console.log('[hackbot][retrieve][adaptive]', {
      query: trimmed,
      complexity: complexity.type,
      docLimit: limit,
      reason: complexity.reason,
    });
  }

  // Vector-only search over hackbot_docs in MongoDB.
  try {
    const embeddingResult = await retryWithBackoff(
      () => getQueryEmbedding(trimmed),
      {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
      }
    );

    if (!embeddingResult) {
      console.error(
        '[hackbot][retrieve] No embedding available for query; vector search required.'
      );
      throw new Error('Embedding unavailable after retries');
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
