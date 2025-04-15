/**
 * Serializes MongoDB data to ensure it's safe to pass to client components
 * Converts ObjectIds to strings and handles other non-serializable objects
 */
export function serializeMongoData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeMongoData(item));
  }

  if (typeof data === 'object') {
    // Check if it's a MongoDB ObjectId
    if (
      data._bsontype === 'ObjectID' ||
      (data.toJSON &&
        typeof data.toJSON === 'function' &&
        data.toString &&
        typeof data.toString === 'function')
    ) {
      return data.toString();
    }

    // Handle Buffer objects
    if (data.buffer && data.buffer instanceof Uint8Array) {
      return data.toString();
    }

    // Regular object, recursively serialize its properties
    const serialized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeMongoData(value);
    }
    return serialized;
  }

  // Primitive values
  return data;
}
