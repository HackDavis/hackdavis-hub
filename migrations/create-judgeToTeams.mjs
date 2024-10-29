export async function up(db) {
  await db.createCollection('judgeToTeams', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'JudgeToTeams Object Validation',
        required: ['judge_id', 'team_id', 'round'],
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
          round: {
            bsonType: 'int',
            minimum: 1,
            description: 'round must be an integer',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('judgeToTeams').drop();
}
