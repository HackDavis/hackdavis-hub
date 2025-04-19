export const up = async (db) => {
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

export const down = async (db) => {
  await db.collection('announcements').drop();
};
