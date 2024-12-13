// import tracks from '../app/(api)/_data/tracks.json' assert { type: 'json' };

export async function up(db) {
  await db.createCollection('submissions', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Submissions Object Validation',
        required: ['judge_id', 'team_id', 'scores', 'is_scored'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          judge_id: {
            bsonType: 'objectId',
            description: 'judge_id must be an ObjectId',
          },
          team_id: {
            bsonType: 'objectId',
            description: 'team_id must be an ObjectId',
          },
          scores: {
            bsonType: 'object',
            description: 'scores must be a JSON object',
            required: ['social_good', 'creativity', 'presentation', 'comments'],
            properties: {
              social_good: {
                bsonType: 'int',
                minimum: 1,
                maximum: 5,
                description: 'social_good score must be an integer',
              },
              creativity: {
                bsonType: 'int',
                minimum: 1,
                maximum: 5,
                description: 'creativity score must be an integer',
              },
              presentation: {
                bsonType: 'int',
                minimum: 1,
                maximum: 5,
                description: 'presentation score must be an integer',
              },
              comments: {
                bsonType: 'string',
                description: 'comments must be a string',
              },
            },
            additionalProperties: true,
          },
          is_scored: {
            bsonType: 'bool',
            description: 'is_scored must be boolean',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('submissions').drop();
}
