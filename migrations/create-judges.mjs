export async function up(db) {
  await db.createCollection('judges', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Judge Object Validation',
        required: ['name', 'email', 'password', 'specialty', 'role'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          name: {
            bsonType: 'string',
            description: 'name must be a string',
          },
          email: {
            bsonType: 'string',
            pattern: '^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$',
            description: 'email must be a string and have a valid format',
          },
          password: {
            bsonType: 'string',
            description: 'encrypted password must be a string',
          },
          specialty: {
            enum: ['tech', 'business', 'design'],
            description: 'specialty must be either tech, business, or design',
          },
          judge_group_id: {
            bsonType: 'objectId',
            description: 'judge_group_id must be an ObjectId',
          },
          role: {
            enum: ['judge', 'admin'],
            description: 'role must be either judge or admin',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('judges').drop();
}
