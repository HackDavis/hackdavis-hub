import tracks from '../app/(api)/_data/tracks.json' assert { type: 'json' };

export async function up(db) {
  await db.createCollection('teams', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Team Object Validation',
        required: ['number', 'name', 'tracks'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          number: {
            bsonType: 'int',
            description: 'number must be an integer',
          },
          name: {
            bsonType: 'string',
            description: 'name must be a string',
          },
          tracks: {
            bsonType: 'array',
            maxItems: 5,
            items: {
              enum: tracks.map((track) => track.name),
              description: 'track must be one of the valid tracks',
            },
            description: 'tracks must be an array of strings',
          },
          hacker_ids: {
            bsonType: 'array',
            maxItems: 4,
            minItems: 1,
            description: 'hacker_ids must be an array of ids',
            items: {
              bsonType: 'objectId',
              description: 'hacker_id must be an objectId',
            },
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
