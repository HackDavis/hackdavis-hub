export async function up(db) {
  await db.createCollection('helpTimers', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Help Timer Object Validation',
        required: ['time'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          time: {
            bsonType: 'string',
            description: 'time must be a string',
            pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$',
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection('helpTimers').drop();
}
