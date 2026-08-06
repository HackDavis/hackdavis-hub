export const up = async (db) => {
  const collectionExists = await db
    .listCollections({ name: "announcements" }, { nameOnly: true })
    .hasNext();

  if (collectionExists) {
    await db.collection('announcements').drop();
  }
};

export const down = async (db) => {
  await db.createCollection('announcements', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Announcements Object Validation',
        required: ['title', 'description', 'time'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          title: {
            bsonType: 'string',
            description: 'title must be a string',
          },
          description: {
            bsonType: 'string',
            description: 'description must be a string',
          },
          time: {
            bsonType: 'date',
            description: 'time must be a date.',
          },
        },
        additionalProperties: false,
      },
    },
  });
};
