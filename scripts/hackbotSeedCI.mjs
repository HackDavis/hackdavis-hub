import { getClient } from '../app/(api)/_utils/mongodb/mongoClient.mjs';

const HACKBOT_COLLECTION = 'hackbot_docs';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

async function embedText(text) {
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

async function seedHackbotDocs() {
  if (!OPENAI_API_KEY) {
    console.error('[hackbotSeedCI] OPENAI_API_KEY is not set');
    process.exit(1);
  }

  console.log('[hackbotSeedCI] Starting seeding process...');
  console.log(`[hackbotSeedCI] Using OpenAI model: ${OPENAI_EMBEDDING_MODEL}`);

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
      '[hackbotSeedCI] Failed to load events:',
      err.message
    );
  }

  // Load static knowledge docs from hackbot_knowledge collection
  let knowledgeDocs = [];
  try {
    knowledgeDocs = await db.collection('hackbot_knowledge').find({}).toArray();
    console.log(
      `[hackbotSeedCI] Loaded ${knowledgeDocs.length} knowledge docs from database`
    );
  } catch (err) {
    console.warn(
      '[hackbotSeedCI] Failed to load knowledge docs:',
      err.message
    );
  }

  const eventDocs = buildDocsFromEvents(events);

  // Convert knowledge docs to hackbot_docs format
  const staticDocs = knowledgeDocs.map((doc) => ({
    _id: `knowledge-${String(doc._id)}`,
    type: doc.type,
    title: doc.title,
    text: doc.content,
    url: doc.url || null,
  }));

  const docs = [...eventDocs, ...staticDocs];

  if (docs.length === 0) {
    console.warn('[hackbotSeedCI] No docs to seed. Exiting.');
    await client.close();
    return;
  }

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
