export async function up(db) {
  await db.createCollection('events', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Events Object Validation',
        required: ['name', 'type', 'location', 'time'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          name: {
            bsonType: 'string',
            description: 'name must be a string',
          },
          type: {
            enum: ['workshop', 'meal', 'mixer'],
            description: 'type must be a valid event type',
          },
          description: {
            bsonType: 'string',
            description: 'description must be a string',
          },
          location: {
            bsonType: 'string',
            description: 'location must be a string',
          },
          time: {
            bsonType: 'date',
            description: 'time must be a date',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('events').drop();
}
