export async function up(db) {
  await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Users Object Validation',
        required: ['name', 'email', 'password', 'role', 'created_at'],
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
          specialties: {
            //optional for hackers
            //is this correct to have both array and enum?
            bsonType: 'array',
            enum: ['tech', 'business', 'design'],
            description: 'specialties must be either tech, business, or design',
          },
          position: {
            //optional
            //is this right? or just need enum is ok
            bsonType: 'string',
            enum: ['devloper', 'designer', 'pm', 'other'],
            description:
              'position must be either developer, designer, pm, or other',
          },
          role: {
            enum: ['hacker', 'judge', 'admin'],
            description: 'role must be either hacker, judge, or admin',
          },
          starter_kit_stage: {
            //optional
            enum: 'int',
            description: 'start_kit_stage must be an integer',
          },
          is_beginner: {
            //optional
            bsonType: 'boolean',
            description: 'is_beginner must be a boolean',
          },
          created_at: {
            bsonType: 'date',
            description: 'created_at must be a date',
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
