// import tracks from '../app/(api)/_data/tracks.json' assert { type: 'json' };

export async function up(db) {
  await db.createCollection('scores', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Scores Object Validation',
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
            //change to JSON?
            //add the comments here
            bsonType: 'array',
            description: 'scores must be an array of integers',
            minItems: 5,
            maxItems: 5,
            items: {
              bsonType: 'int',
              minimum: 1,
              maximum: 5,
              description: 'score must be an integer',
            },
          },
          is_scored: {
            bsonType: 'boolean',
            description: 'is_scored must be boolean',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('scores').drop();
}
