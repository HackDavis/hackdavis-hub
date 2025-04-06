export async function up(db) {
  if (!(await db.listCollections({ name: 'userToEvents' }).hasNext()))
    await db.createCollection('userToEvents', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'userToEvents Object Validation',
          required: ['user_id', 'event_id'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: '_id must be an ObjectId',
            },
            user_id: {
              bsonType: 'objectId',
              description: 'user_id must be an ObjectId',
            },
            event_id: {
              bsonType: 'objectId',
              description: 'event_id must be an ObjectId',
            },
          },
          additionalProperties: false,
        },
      },
    });
}

export async function down(db) {
  if (await db.listCollections({ name: 'userToEvents' }).hasNext())
    await db.collection('userToEvents').drop();
}
