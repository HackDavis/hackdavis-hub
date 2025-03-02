export async function up(db) {
  await db.createCollection('submissions', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Submissions Object Validation',
        required: [
          'judge_id',
          'team_id',
          'scores',
          'social_good',
          'creativity',
          'presentation',
          'scores',
          'is_scored',
          'queuePosition',
        ],
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
          scores: {
            bsonType: 'array',
            description: 'scores must be an array',
            items: {
              bsonType: 'object',
              required: ['trackName', 'rawScores', 'finalTrackScore'],
              properties: {
                trackName: {
                  bsonType: 'string',
                  description: 'trackName must be a string',
                },
                rawScores: {
                  bsonType: 'array',
                  description: 'rawScores must be an array',
                  items: {
                    bsonType: 'int',
                    description: 'rawScores must be an array of integers',
                  },
                },
                finalTrackScore: {
                  bsonType: 'int' || null,
                  description: 'finalTrackScore must be an integer or null',
                },
              },
            },
            comments: {
              bsonType: 'string',
              description: 'comments must be a string',
            },
            additionalProperties: false,
          },
          is_scored: {
            bsonType: 'bool',
            description: 'is_scored must be boolean',
          },
          queuePosition: {
            bsonType: 'int',
            description: 'queuePosition must be an integer',
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
