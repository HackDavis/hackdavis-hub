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
          specialties: {
            //optional for hackers - how do i have it so that they can choose multiple?
            enum: ['tech', 'business', 'design'],
            description: 'specialties must be either tech, business, or design',
          },
          position: {
            //optional
            bsonType: 'string',
            description: 'position must be an string',
          },
          role: {
            enum: ['hacker', 'judge', 'admin'],
            description: 'role must be either hacker, judge, or admin',
          },
          starter_kit_stage: {
            enum: 'integer',
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
