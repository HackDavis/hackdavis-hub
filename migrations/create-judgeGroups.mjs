export async function up(db) {
  await db.createCollection('judgeGroups', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'JudgeGroup Object Validation',
        required: ['type'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          type: {
            enum: ['tech', 'business', 'design'],
            description: 'type must be either tech, business, or design.',
          },
          judge_ids: {
            bsonType: 'array',
            description: 'judge_ids must be an array of ObjectIds',
            items: {
              bsonType: 'objectId',
              description: 'judge_id must be an ObjectId',
            },
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('judgeGroups').drop();
}
