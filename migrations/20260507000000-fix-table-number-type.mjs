import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(
  process.cwd(),
  'app/_data/db_validation_data.json'
);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const tracks = [...new Set(data.tracks)];

const teamsSchema = {
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
        bsonType: 'string',
        description: 'tableNumber must be an string',
      },
      name: {
        bsonType: 'string',
        description: 'name must be a string',
      },
      tracks: {
        bsonType: 'array',
        items: {
          enum: tracks,
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
};

const applySchema = (db) =>
  db.command({
    collMod: 'teams',
    validator: teamsSchema,
    validationLevel: 'strict',
    validationAction: 'error',
  });

export const up = (db) => applySchema(db);
export const down = (db) => applySchema(db);
