import tracks from '../app/(api)/_data/tracks.json' assert { type: 'json' };

export async function up(db) {
  await db.createCollection('teams', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Teams Object Validation',
        required: ['number', 'name', 'tracks', 'hacker_ids', 'created_at'],
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
            maxItems: 6,
            items: {
              enum: tracks.map((track) => track.name),
              description: 'track must be one of the valid tracks',
            },
            description: 'tracks must be an array of strings',
          },
          hacker_ids: {
            //specificy the type of element
            bsonType: 'array',
            description: 'hacker_ids must be an array of ids',
          },
          created_at: {
            bsonType: 'date',
            description: 'created_at must be a date',
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
