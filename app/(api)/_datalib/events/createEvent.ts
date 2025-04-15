import { getDatabase } from "@utils/mongodb/mongoClient.mjs";
import parseAndReplace from "@utils/request/parseAndReplace";
import {
  DuplicateError,
  HttpError,
  NoContentError,
} from "@utils/response/Errors";
import isBodyEmpty from "@utils/request/isBodyEmpty";

export async function CreateEvent(body: object) {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }
    const parsedBody = await parseAndReplace(body);
    const db = await getDatabase();

    if (
      parsedBody.end_time &&
      parsedBody.start_time &&
      parsedBody.end_time.getTime() < parsedBody.start_time.getTime()
    ) {
      throw new HttpError(
        "Failed to create event: end_time must be after start_time",
      );
    }

    //duplicate event
    const existingEvent = await db.collection("events").findOne({
      name: parsedBody.name,
    });
    if (existingEvent) {
      throw new DuplicateError("Duplicate: event already exists.");
    }

    const creationStatus = await db.collection("events").insertOne(parsedBody);
    const createdEvent = await db.collection("events").findOne({
      _id: creationStatus.insertedId,
    });

    if (!createdEvent) {
      throw new HttpError("Failed to fetch the created event");
    }

    return { ok: true, body: createdEvent, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message || "Internal Server Error",
    };
  }
}
