export async function up(db) {
  await db.createCollection('judgeGroupToTeams', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'JudgeGroupToTeam Object Validation',
        required: ['judge_group_id', 'team_id', 'round'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          judge_group_id: {
            bsonType: 'objectId',
            description: 'judge_group_id must be an ObjectId',
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
  await db.collection('judgeGroupToTeams').drop();
}
