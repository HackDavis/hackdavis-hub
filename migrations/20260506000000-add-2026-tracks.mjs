import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(
  process.cwd(),
  'app/_data/db_validation_data.json'
);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const tracks = [...new Set(data.tracks)];

// Track list as of commit 52684b55 (2025 tracks)
const previousTracks = [
  'Best Hack for Social Good',
  'Best Beginner Hack',
  'Best Interdisciplinary Hack',
  'Most Creative Hack',
  'Best Hack for Social Justice',
  'Best Hardware Hack',
  'Most Technically Challenging Hack',
  'Best Open Data Hack',
  'Best AI/ML Hack',
  'Best UI/UX Design',
  'Best User Research',
  'Best Statistical Model',
  'Best Medical Hack',
  'Best Entrepreneurship Hack',
  "Hacker's Choice Award",
  'Best Hack for California GovOps Agency',
  'Best Hack for NAMI Yolo',
  'Best Hack for Fourth and Hope',
  'Best Use of Cerebras API',
  'Best Use of Vectara',
  'Best Use of Gemini API',
  'Best Use of MongoDB Atlas',
  'Best .Tech Domain Name',
  'Best Use of Auth0',
  'Best Use of Snowflake API',
  'Best Assistive Technology',
];

const teamsSchema = (trackList) => ({
  $jsonSchema: {
    bsonType: 'object',
    title: 'Teams Object Validation',
    required: ['teamNumber', 'tableNumber', 'name', 'tracks', 'active'],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: '_id must be an ObjectId',
      },
      teamNumber: {
        bsonType: 'int',
        description: 'teamNumber must be an integer',
      },
      tableNumber: {
        bsonType: 'int',
        description: 'tableNumber must be an integer',
      },
      name: {
        bsonType: 'string',
        description: 'name must be a string',
      },
      tracks: {
        bsonType: 'array',
        items: {
          enum: trackList,
          description: 'track must be one of the valid tracks',
        },
        description: 'tracks must be an array of strings',
      },
      reports: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['timestamp', 'judge_id'],
          properties: {
            timestamp: {
              bsonType: 'number',
              description: 'Timestamp in milliseconds since epoch',
            },
            judge_id: {
              bsonType: 'string',
              description: 'ID of the judge',
            },
          },
        },
      },
      active: {
        bsonType: 'bool',
        description: 'active must be a boolean',
      },
    },
    additionalProperties: false,
  },
});

export const up = async (db) => {
  await db.command({
    collMod: 'teams',
    validator: teamsSchema(tracks),
  });
};

export const down = async (db) => {
  await db.command({
    collMod: 'teams',
    validator: teamsSchema(previousTracks),
  });
};
