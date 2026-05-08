import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(
  process.cwd(),
  'app/_data/db_validation_data.json'
);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const panelTracks = [...new Set(data.panelTracks)];
const domains = [...new Set(data.domains)];

const panelsSchema = (trackList) => ({
  $jsonSchema: {
    bsonType: 'object',
    title: 'Panels Object Validation',
    required: ['track', 'user_ids'],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: '_id must be an ObjectId',
      },
      track: {
        enum: trackList,
        description: 'track must be a valid track string',
      },
      domain: {
        anyOf: [{ enum: domains }, { type: 'string', maxLength: 0 }],
        description: `domain must be one of: ${domains.join(
          ', '
        )} or empty string`,
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
});

export const up = async (db) => {
  await db.command({
    collMod: 'panels',
    validator: panelsSchema(panelTracks),
    validationLevel: 'strict',
    validationAction: 'error',
  });
};

export const down = async (db) => {
  await db.command({
    collMod: 'panels',
    validator: panelsSchema(panelTracks),
    validationLevel: 'strict',
    validationAction: 'error',
  });
};
