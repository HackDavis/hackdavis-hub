// import tracks from '../app/(api)/_data/tracks.json' assert { type: 'json' };

//DO I RENAME TO SCORES?
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
          // correlations: {
          //   bsonType: 'array',
          //   description: 'correlations must be an array of correlations',
          //   minItems: 1,
          //   maxItems: 5,
          //   items: {
          //     bsonType: 'object',
          //     required: ['track', 'score'],
          //     properties: {
          //       track: {
          //         enum: tracks.map((track) => track.name),
          //         description: 'track must be one of the valid tracks',
          //       },
          //       score: {
          //         bsonType: 'int',
          //         minimum: 1,
          //         maximum: 5,
          //         description: 'score must be an integer between 1 and 5',
          //       },
          //     },
          //   },
          // },
          is_scored: {
            bsonType: 'boolean',
            description: 'is_scored must be boolean',
          },
          comments: {
            //comments a part of scores??
            bsonType: 'string',
            description: 'comments must be a string',
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
