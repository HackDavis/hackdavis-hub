import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(
  process.cwd(),
  'app/_data/db_validation_data.json'
);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const domains = [...new Set(data.domains)];
const tracks = [...new Set(data.tracks)];

export const up = async (db) => {
  await db.command({
    collMod: 'panels',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Panels Object Validation',
        required: ['track', 'domain', 'user_ids'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          track: {
            enum: tracks,
            description: 'track must be a a valid track string',
          },
          domain: {
            enum: domains,
            description: `domain must be one of: ${domains.join(', ')}`,
          },
          user_ids: {
            bsonType: 'array',
            description: 'user_ids must be an array of object IDs',
            maxItems: 5,
            items: {
              bsonType: 'objectId',
              description: 'user_ids must be an array of object IDs',
            },
          },
        },
        additionalProperties: false,
      },
    },
  });
};

export const down = async (db) => {
  await db.command({
    collMod: 'panels',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Panels Object Validation',
        required: ['track', 'domain', 'user_ids'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          track: {
            enum: tracks,
            description: 'track must be a a valid track string',
          },
          domain: {
            enum: domains,
            description: `domain must be one of: ${domains.join(', ')}`,
          },
          user_ids: {
            bsonType: 'array',
            description: 'user_ids must be an array of object IDs',
            maxItems: 5,
            items: {
              bsonType: 'objectId',
              description: 'user_ids must be an array of object IDs',
            },
          },
        },
        additionalProperties: false,
      },
    },
  });
};
