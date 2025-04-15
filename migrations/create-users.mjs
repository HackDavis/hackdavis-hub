import fs from "fs";
import path from "path";

const dataPath = path.resolve(
  process.cwd(),
  "app/_data/db_validation_data.json",
);
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const domains = [...new Set(data.domains)];

export async function up(db) {
  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "Users Object Validation",
        required: ["name", "email", "password", "role", "has_checked_in"],
        properties: {
          _id: {
            bsonType: "objectId",
            description: "_id must be an ObjectId",
          },
          name: {
            bsonType: "string",
            description: "name must be a string",
          },
          email: {
            bsonType: "string",
            pattern: "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$",
            description: "email must be a string and have a valid format",
          },
          password: {
            bsonType: "string",
            description: "encrypted password must be a string",
          },
          role: {
            enum: ["hacker", "judge", "admin"],
            description: "role must be either hacker, judge, or admin",
          },
          specialties: {
            bsonType: "array",
            description: "specialties must be an array of valid string values",
            maxItems: domains.length,
            minItems: domains.length,
            items: {
              enum: domains,
              description: `specialty must be one of: ${domains.join(", ")}`,
            },
            uniqueItems: true,
          },
          position: {
            enum: ["developer", "designer", "pm", "other"],
            description:
              "position must be either developer, designer, pm, or other",
          },
          is_beginner: {
            bsonType: "bool",
            description: "is_beginner must be a boolean",
          },
          has_checked_in: {
            bsonType: "bool",
            description: "has_checked_in must be a boolean",
          },
        },
        additionalProperties: false,
      },
    },
  });
}

export async function down(db) {
  await db.collection("users").drop();
}
