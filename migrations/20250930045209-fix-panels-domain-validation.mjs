export const up = async (db) => {
  // Import validation data for domains and tracks
  const fs = await import('fs');
  const path = await import('path');

  const dataPath = path.resolve(
    process.cwd(),
    'app/_data/db_validation_data.json'
  );
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const domains = [...new Set(data.domains)];
  const tracks = [...new Set(data.tracks)];

  // Update panels collection validator to make domain optional
  await db.command({
    collMod: 'panels',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Panels Object Validation',
        required: ['track', 'user_ids'], // removed 'domain' from required fields
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          track: {
            enum: tracks,
            description: 'track must be a valid track string',
          },
          domain: {
            anyOf: [
              { enum: domains },
              { type: 'string', maxLength: 0 }, // allow empty string
            ],
            description: `domain must be one of: ${domains.join(
              ', '
            )} or empty string`,
          },
          user_ids: {
            bsonType: 'array',
            description: 'user_ids must be an array of object IDs',
            maxItems: 5,
            items: {
              bsonType: 'objectId',
              description: 'user_ids must be an array of object IDs',
            },
          },
        },
        additionalProperties: false,
      },
    },
    validationLevel: 'strict',
    validationAction: 'error',
  });

  console.log('Updated panels validator to make domain field optional');
};

export const down = async (db) => {
  // Import validation data for domains and tracks
  const fs = await import('fs');
  const path = await import('path');

  const dataPath = path.resolve(
    process.cwd(),
    'app/_data/db_validation_data.json'
  );
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const domains = [...new Set(data.domains)];
  const tracks = [...new Set(data.tracks)];

  // Restore original panels collection validator (domain required)
  await db.command({
    collMod: 'panels',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Panels Object Validation',
        required: ['track', 'domain', 'user_ids'], // domain is required again
        properties: {
          _id: {
            bsonType: 'objectId',
            description: '_id must be an ObjectId',
          },
          track: {
            enum: tracks,
            description: 'track must be a a valid track string',
          },
          domain: {
            enum: domains,
            description: `domain must be one of: ${domains.join(', ')}`,
          },
          user_ids: {
            bsonType: 'array',
            description: 'user_ids must be an array of object IDs',
            maxItems: 5,
            items: {
              bsonType: 'objectId',
              description: 'user_ids must be an array of object IDs',
            },
          },
        },
        additionalProperties: false,
      },
    },
    validationLevel: 'strict',
    validationAction: 'error',
  });

  console.log('Restored original panels validator with required domain field');
};
