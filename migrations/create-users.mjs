export async function up(db) {
  await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Users Object Validation',
        required: ['name', 'email', 'password', 'role'],
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
          role: {
            enum: ['hacker', 'judge', 'admin'],
            description: 'role must be either hacker, judge, or admin',
          },
          specialties: {
            bsonType: 'array',
            description: 'specialties must be an array of valid string values',
            items: {
              enum: ['tech', 'business', 'design'],
              description: 'specialty must be either tech, business, or design',
            },
          },
          position: {
            enum: ['developer', 'designer', 'pm', 'other'],
            description:
              'position must be either developer, designer, pm, or other',
          },
          is_beginner: {
            bsonType: 'boolean',
            description: 'is_beginner must be a boolean',
          },
          starter_kit_stage: {
            bsonType: 'int',
            maximum: 4,
            minimum: 1,
            description: 'start_kit_stage must be an integer',
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
