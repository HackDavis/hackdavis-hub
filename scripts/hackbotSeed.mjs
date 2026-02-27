import { getClient } from '../app/(api)/_utils/mongodb/mongoClient.mjs';
import readline from 'readline';

const HACKBOT_COLLECTION = 'hackbot_docs';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

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

async function seedHackbotDocs({ wipe }) {
  if (!OPENAI_API_KEY) {
    console.error(
      'OPENAI_API_KEY is not set. Run with: node --env-file=".env" scripts/hackbotSeed.mjs'
    );
    return;
  }

  const client = await getClient();
  try {
    await client.connect();
  } catch (err) {
    console.error(
      'MongoDB connection failed. Check MONGODB_URI.\n' + `Details: ${err.message}`
    );
    return;
  }

  const db = client.db();
  const collection = db.collection(HACKBOT_COLLECTION);

  if (wipe === 'y') {
    // Only wipe knowledge docs — event docs are served live via tool calls
    await collection.deleteMany({ _id: { $regex: '^knowledge-' } });
    console.log(`Wiped knowledge docs from: ${HACKBOT_COLLECTION}`);
  }

  // Load knowledge docs from hackbot_knowledge collection
  let knowledgeDocs = [];
  try {
    knowledgeDocs = await db.collection('hackbot_knowledge').find({}).toArray();
    console.log(`Loaded ${knowledgeDocs.length} knowledge docs from database`);
  } catch (err) {
    console.warn('Failed to load knowledge docs:', err.message);
  }

  if (knowledgeDocs.length === 0) {
    console.warn(
      'No knowledge docs found. Add docs via the admin panel at /admin/hackbot first.'
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

  console.log(`Preparing to embed and upsert ${docs.length} knowledge docs...`);
  console.log(`Using OpenAI model: ${OPENAI_EMBEDDING_MODEL}`);

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
      console.log(`Upserted doc ${doc._id}`);
    } catch (err) {
      console.error(`Failed to upsert doc ${doc._id}:`, err.message);
    }
  }

  console.log(
    `Done. Successfully upserted ${successCount}/${docs.length} docs.`
  );

  await client.close();
}

async function gatherInputAndRun() {
  try {
    let wipe = '';
    while (wipe !== 'y' && wipe !== 'n') {
      // eslint-disable-next-line no-await-in-loop
      wipe = (
        await askQuestion(
          `Seed "${HACKBOT_COLLECTION}" from hackbot_knowledge collection. Wipe existing knowledge docs first? (y/n): `
        )
      ).toLowerCase();
      if (wipe !== 'y' && wipe !== 'n') {
        console.log('Please enter either "y" or "n".');
      }
    }

    rl.close();

    await seedHackbotDocs({ wipe });
  } catch (err) {
    console.error('Error while seeding hackbot docs:', err);
    rl.close();
  }
}

// Run when invoked via `node --env-file=".env" scripts/hackbotSeed.mjs`
await gatherInputAndRun();
