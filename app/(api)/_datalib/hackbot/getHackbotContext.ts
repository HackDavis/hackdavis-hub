import { HackDoc, HackDocType } from '@typeDefs/hackbot';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { embedText } from '@utils/hackbot/embedText';
import { retryWithBackoff } from '@utils/hackbot/retryWithBackoff';

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

  try {
    const embedding = await retryWithBackoff(() => embedText(trimmed), {
      maxAttempts: 3,
      delayMs: 1000,
      backoffMultiplier: 2,
    });

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

    console.log('[hackbot][retrieve][vector]', {
      query: trimmed,
      docIds: docs.map((d) => d.id),
      titles: docs.map((d) => d.title),
    });

    return { docs };
  } catch (err) {
    console.error(
      '[hackbot][retrieve] Vector search failed (no fallback).',
      err
    );
    throw err;
  }
}
