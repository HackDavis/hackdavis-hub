export async function up(db) {
  await db.createCollection('panels', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Panels Object Validation',
        required: ['track', 'type', 'users'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          track: {
            bsonType: 'string',
            description: 'track must be a string',
          },
          type: {
            enum: ['business', 'tech', 'design'],
            description: 'type must be one of: business, tech, design',
          },
          users: {
            bsonType: 'array',
            description: 'users must be an array of user objects',
            maxItems: 5,
            items: {
              bsonType: 'object',
              required: ['_id', 'name', 'email', 'role'],
              properties: {
                _id: {
                  bsonType: 'objectId',
                  description: 'user _id must be an ObjectId',
                },
                name: {
                  bsonType: 'string',
                  description: 'name must be a string',
                },
                email: {
                  bsonType: 'string',
                  description: 'email must be a string',
                },
                specialties: {
                  bsonType: 'array',
                  description: 'specialties must be an array of strings',
                  items: {
                    bsonType: 'string',
                  },
                },
                role: {
                  bsonType: 'string',
                  description: 'role must be a string',
                },
                has_checked_in: {
                  bsonType: 'bool',
                  description: 'has_checked_in must be a boolean',
                },
              },
            },
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('panels').drop();
}
