export const up = async (db) => {
  // Import validation data for domains
  const fs = await import('fs');
  const path = await import('path');

  const dataPath = path.resolve(
    process.cwd(),
    'app/_data/db_validation_data.json'
  );
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const domains = [...new Set(data.domains)];

  // Update users collection validator to include opted_into_panels
  await db.command({
    collMod: 'users',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Users Object Validation',
        required: ['name', 'email', 'password', 'role', 'has_checked_in'],
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
          role: {
            enum: ['hacker', 'judge', 'admin'],
            description: 'role must be either hacker, judge, or admin',
          },
          specialties: {
            bsonType: 'array',
            description: 'specialties must be an array of valid string values',
            maxItems: domains.length,
            minItems: domains.length,
            items: {
              enum: domains,
              description: `specialty must be one of: ${domains.join(', ')}`,
            },
            uniqueItems: true,
          },
          position: {
            enum: ['developer', 'designer', 'pm', 'other'],
            description:
              'position must be either developer, designer, pm, or other',
          },
          is_beginner: {
            bsonType: 'bool',
            description: 'is_beginner must be a boolean',
          },
          has_checked_in: {
            bsonType: 'bool',
            description: 'has_checked_in must be a boolean',
          },
          opted_into_panels: {
            bsonType: 'bool',
            description:
              'opted_into_panels must be a boolean indicating if judge wants to be on panels',
          },
        },
        additionalProperties: false,
      },
    },
    validationLevel: 'strict',
    validationAction: 'error',
  });

  // Add opted_into_panels field to all existing users
  // Default to false for existing users, so they need to explicitly opt-in
  await db
    .collection('users')
    .updateMany(
      { opted_into_panels: { $exists: false } },
      { $set: { opted_into_panels: false } }
    );

  console.log(
    'Updated users validator and added opted_into_panels field to existing users'
  );
};

export const down = async (db) => {
  // Import validation data for domains (needed to restore original validator)
  const fs = await import('fs');
  const path = await import('path');

  const dataPath = path.resolve(
    process.cwd(),
    'app/_data/db_validation_data.json'
  );
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const domains = [...new Set(data.domains)];

  // Restore original users collection validator (without opted_into_panels)
  await db.command({
    collMod: 'users',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Users Object Validation',
        required: ['name', 'email', 'password', 'role', 'has_checked_in'],
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
          role: {
            enum: ['hacker', 'judge', 'admin'],
            description: 'role must be either hacker, judge, or admin',
          },
          specialties: {
            bsonType: 'array',
            description: 'specialties must be an array of valid string values',
            maxItems: domains.length,
            minItems: domains.length,
            items: {
              enum: domains,
              description: `specialty must be one of: ${domains.join(', ')}`,
            },
            uniqueItems: true,
          },
          position: {
            enum: ['developer', 'designer', 'pm', 'other'],
            description:
              'position must be either developer, designer, pm, or other',
          },
          is_beginner: {
            bsonType: 'bool',
            description: 'is_beginner must be a boolean',
          },
          has_checked_in: {
            bsonType: 'bool',
            description: 'has_checked_in must be a boolean',
          },
        },
        additionalProperties: false,
      },
    },
    validationLevel: 'strict',
    validationAction: 'error',
  });

  // Remove opted_into_panels field from all users
  await db
    .collection('users')
    .updateMany({}, { $unset: { opted_into_panels: 1 } });

  console.log(
    'Restored original users validator and removed opted_into_panels field from users'
  );
};
