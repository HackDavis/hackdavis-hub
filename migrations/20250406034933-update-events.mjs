export async function up(db) {
  if (await db.listCollections({ name: 'events' }).hasNext())
    await db.command({
      collMod: 'events',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Events Object Validation',
          required: ['name', 'type', 'start_time'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: '_id must be an ObjectId',
            },
            name: {
              bsonType: 'string',
              description: 'name must be a string',
            },
            host: {
              bsonType: 'string',
              description: 'host must be a string',
            },
            type: {
              enum: ['WORKSHOPS', 'MEALS', 'GENERAL', 'ACTIVITIES'],
              description:
                'type must be a valid event type: workshop, meal, general, activity',
            },
            location: {
              bsonType: 'string',
              description: 'location must be a string',
            },
            start_time: {
              bsonType: 'date',
              description: 'start_time must be a date',
            },
            end_time: {
              bsonType: 'date',
              description: 'end_time must be a date',
            },
            tags: {
              bsonType: 'array',
              description: 'tags must be an array of strings',
              items: {
                enum: ['developer', 'designer', 'pm', 'other', 'beginner'],
                description:
                  'tags must be an array of valid hacker positions: developer, designer, pm, other, beginner',
              },
              uniqueItems: true,
            },
          },
          additionalProperties: false,
        },
      },
    });
}

export async function down(db) {
  if (await db.listCollections({ name: 'events' }).hasNext())
    await db.command({
      collMod: 'events',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Events Object Validation',
          required: ['name', 'type', 'start_time'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: '_id must be an ObjectId',
            },
            name: {
              bsonType: 'string',
              description: 'name must be a string',
            },
            host: {
              bsonType: 'string',
              description: 'host must be a string',
            },
            type: {
              enum: ['WORKSHOPS', 'MEALS', 'GENERAL', 'ACTIVITIES'],
              description:
                'type must be a valid event type: workshop, meal, general, activity',
            },
            location: {
              bsonType: 'string',
              description: 'location must be a string',
            },
            start_time: {
              bsonType: 'date',
              description: 'start_time must be a date',
            },
            end_time: {
              bsonType: 'date',
              description: 'end_time must be a date',
            },
            tags: {
              bsonType: 'array',
              description: 'tags must be an array of strings',
              items: {
                enum: ['developer', 'designer', 'pm', 'other', 'beginner'],
                description:
                  'tags must be an array of valid hacker positions: developer, designer, pm, other, beginner',
              },
            },
          },
          additionalProperties: false,
        },
      },
    });
}
