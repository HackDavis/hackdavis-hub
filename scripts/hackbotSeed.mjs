import { getClient } from '../app/(api)/_utils/mongodb/mongoClient.mjs';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const HACKBOT_COLLECTION = 'hackbot';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

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

async function embedText(text) {
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

async function seedHackbotDocs({ wipe }) {
  const client = await getClient();
  try {
    await client.connect();
  } catch (err) {
    console.error(
      'MongoDB connection failed. Check MONGODB_URI and make sure your Mongo/Atlas Local deployment is running.\n' +
        `Details: ${err.message}`
    );
    return;
  }

  const db = client.db();
  const collection = db.collection(HACKBOT_COLLECTION);

  if (wipe === 'y') {
    await collection.deleteMany({});
    console.log(`Wiped collection: ${HACKBOT_COLLECTION}`);
  }

  let events = [];
  try {
    events = await db.collection('events').find({}).toArray();
  } catch (err) {
    console.warn(
      'Failed to load events from MongoDB; falling back to hackbot_knowledge.json:',
      err.message
    );
  }

  if (!Array.isArray(events) || events.length === 0) {
    events = loadEventsFallbackFromKnowledge();
  }

  const docs = [...buildDocsFromEvents(events), ...buildStaticDocs()];

  console.log(`Preparing to embed and upsert ${docs.length} hackbot docs...`);

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
          `Seed collection "${HACKBOT_COLLECTION}" from app/_data (events + judging/submission docs). Wipe existing docs first? (y/n): `
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
