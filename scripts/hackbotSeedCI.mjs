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

  // Wipe only knowledge docs (not event docs — events are served live via tool calls)
  await collection.deleteMany({ _id: { $regex: '^knowledge-' } });
  console.log(`[hackbotSeedCI] Wiped knowledge docs from: ${HACKBOT_COLLECTION}`);

  // Load knowledge docs from hackbot_knowledge collection
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

  if (knowledgeDocs.length === 0) {
    console.warn(
      '[hackbotSeedCI] No knowledge docs to seed. Add docs via the admin panel at /admin/hackbot.'
    );
    await client.close();
    return;
  }

  const docs = knowledgeDocs.map((doc) => ({
    _id: `knowledge-${String(doc._id)}`,
    type: doc.type,
    title: doc.title,
    text: doc.content,
    url: doc.url || null,
  }));

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
