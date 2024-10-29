export async function up(db) {
  await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Users Object Validation',
        required: ['name', 'email', 'password', 'team_id', 'specialty', 'role'],
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
          team_id: {
            bsonType: 'objectId',
            description: 'team_id must be an ObjectId',
          },
          specialty: {
            enum: ['tech', 'business', 'design'],
            description: 'specialty must be either tech, business, or design',
          },
          role: {
            enum: ['hacker', 'judge', 'admin'],
            description: 'role must be either hacker, judge, or admin',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('users').drop();
}
