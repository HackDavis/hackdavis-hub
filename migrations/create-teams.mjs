import fs from 'fs';
import path from 'path';

const tracksPath = path.resolve(process.cwd(), 'app/(api)/_data/tracks.json');
const tracks = JSON.parse(fs.readFileSync(tracksPath, 'utf8'));

export async function up(db) {
  await db.createCollection('teams', {
    validator: {
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
            maxItems: 6,
            items: {
              enum: tracks.map((track) => track.name),
              description: 'track must be one of the valid tracks',
            },
            description: 'tracks must be an array of strings',
          },
          active: {
            bsonType: 'bool',
            description: 'active must be a boolean',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('teams').drop();
}
