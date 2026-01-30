import { getClient } from '../app/(api)/_utils/mongodb/mongoClient.mjs';
import fs from 'fs';
import path from 'path';

const HACKBOT_COLLECTION = 'hackbot_docs';

// Load from environment or use Google AI by default in CI
const EMBEDDING_MODE = process.env.HACKBOT_MODE || 'google';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_EMBEDDING_MODEL =
  process.env.GOOGLE_EMBEDDING_MODEL || 'text-embedding-004';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

function loadEventsFallbackFromKnowledge() {
  const knowledgePath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    '..',
    'app',
    '_data',
    'hackbot_knowledge.json'
  );

  const raw = fs.readFileSync(knowledgePath, 'utf8');
  const knowledge = JSON.parse(raw);
  return Array.isArray(knowledge?.events?.raw) ? knowledge.events.raw : [];
}

async function embedTextGoogle(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_EMBEDDING_MODEL}:embedContent?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          parts: [{ text }],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Google AI embeddings error: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  return data.embedding.values;
}

async function embedTextOpenAI(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI embeddings error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function embedTextOllama(text) {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama embeddings error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.embedding)) {
    throw new Error('Invalid embeddings response from Ollama');
  }

  return data.embedding;
}

async function embedText(text) {
  if (EMBEDDING_MODE === 'google') {
    return embedTextGoogle(text);
  } else if (EMBEDDING_MODE === 'openai') {
    return embedTextOpenAI(text);
  } else {
    return embedTextOllama(text);
  }
}

function formatEventDateTime(raw) {
  const iso =
    typeof raw === 'string' ? raw : raw && raw.$date ? raw.$date : undefined;

  if (!iso) return null;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function buildDocsFromEvents(events) {
  if (!Array.isArray(events)) return [];

  return events.map((ev) => {
    const id = String(ev._id?.$oid || ev._id || ev.name);
    const title = String(ev.name || 'Event');

    const start = formatEventDateTime(ev.start_time);
    const end = formatEventDateTime(ev.end_time);
    const location = ev.location || '';
    const host = ev.host || '';
    const type = ev.type || '';

    const parts = [
      `Event: ${title}`,
      type ? `Type: ${type}` : '',
      start ? `Starts (Pacific Time): ${start}` : '',
      end ? `Ends (Pacific Time): ${end}` : '',
      location ? `Location: ${location}` : '',
      host ? `Host: ${host}` : '',
      Array.isArray(ev.tags) && ev.tags.length
        ? `Tags: ${ev.tags.join(', ')}`
        : '',
    ].filter(Boolean);

    return {
      _id: `event-${id}`,
      type: 'event',
      title,
      text: parts.join('\n'),
      url: '/hackers/hub/schedule',
    };
  });
}

function buildStaticDocs() {
  const judging = {
    _id: 'judging-overview',
    type: 'judging',
    title: 'Judging Process Overview',
    text:
      'Judging day timeline (Pacific Time):\n' +
      '- 11:00 AM: submissions due on Devpost\n' +
      '- 12:00–2:00 PM: demo time with judges\n' +
      '- 2:00–3:00 PM: break\n' +
      '- 3:00–4:00 PM: closing ceremony\n\n' +
      'Rubric: 60% track-specific, 20% social good, 10% creativity, 10% presentation.',
    url: '/hackers/hub/project-info#judging',
  };

  const submission = {
    _id: 'submission-overview',
    type: 'submission',
    title: 'Submission Process Overview',
    text: 'Submission steps: (1) Log in or sign up on Devpost and join the HackDavis hackathon. (2) Register for the event. (3) Create a project (only one teammate needs to create it). (4) Invite teammates. (5) Fill out project details. (6) Submit the project on Devpost before the deadline.',
    url: '/hackers/hub/project-info#submission',
  };

  return [judging, submission];
}

async function seedHackbotDocs() {
  console.log('[hackbotSeedCI] Starting seeding process...');
  console.log(`[hackbotSeedCI] Embedding mode: ${EMBEDDING_MODE}`);

  const client = await getClient();

  try {
    await client.connect();
    console.log('[hackbotSeedCI] Connected to MongoDB');
  } catch (err) {
    console.error('[hackbotSeedCI] MongoDB connection failed:', err.message);
    process.exit(1);
  }

  const db = client.db();
  const collection = db.collection(HACKBOT_COLLECTION);

  // Always wipe in CI to ensure clean state
  await collection.deleteMany({});
  console.log(`[hackbotSeedCI] Wiped collection: ${HACKBOT_COLLECTION}`);

  // Load events from live collection
  let events = [];
  try {
    events = await db.collection('events').find({}).toArray();
    console.log(`[hackbotSeedCI] Loaded ${events.length} events from database`);
  } catch (err) {
    console.warn(
      '[hackbotSeedCI] Failed to load events, using fallback:',
      err.message
    );
    events = loadEventsFallbackFromKnowledge();
  }

  if (!Array.isArray(events) || events.length === 0) {
    events = loadEventsFallbackFromKnowledge();
    console.log(
      `[hackbotSeedCI] Using ${events.length} events from fallback`
    );
  }

  const docs = [...buildDocsFromEvents(events), ...buildStaticDocs()];
  console.log(
    `[hackbotSeedCI] Preparing to embed and upsert ${docs.length} docs`
  );

  let successCount = 0;
  for (const doc of docs) {
    try {
      const embedding = await embedText(doc.text);

      await collection.updateOne(
        { _id: doc._id },
        {
          $set: {
            type: doc.type,
            title: doc.title,
            text: doc.text,
            url: doc.url || null,
            embedding,
          },
        },
        { upsert: true }
      );

      successCount += 1;
      console.log(`[hackbotSeedCI] Upserted doc ${doc._id}`);
    } catch (err) {
      console.error(
        `[hackbotSeedCI] Failed to upsert doc ${doc._id}:`,
        err.message
      );
      // Don't exit on individual doc failure
    }
  }

  console.log(
    `[hackbotSeedCI] Done. Successfully upserted ${successCount}/${docs.length} docs.`
  );

  await client.close();

  if (successCount < docs.length) {
    console.error(
      `[hackbotSeedCI] Some docs failed. Success: ${successCount}/${docs.length}`
    );
    process.exit(1);
  }
}

// Run
seedHackbotDocs().catch((err) => {
  console.error('[hackbotSeedCI] Fatal error:', err);
  process.exit(1);
});
