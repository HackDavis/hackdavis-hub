import { getDatabase } from "@utils/mongodb/mongoClient.mjs";
import { ObjectId } from "mongodb";
import isBodyEmpty from "@utils/request/isBodyEmpty";
import parseAndReplace from "@utils/request/parseAndReplace";
import {
  HttpError,
  NoContentError,
  NotFoundError,
  BadRequestError,
} from "@utils/response/Errors";

export async function UpdateEvent(id: string, body: object) {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const db = await getDatabase();
    const objectId = ObjectId.createFromHexString(id);
    const parsedBody = await parseAndReplace(body);

    // Validate the time fields before updating
    const existingEvent = await db
      .collection("events")
      .findOne({ _id: objectId });
    if (!existingEvent) {
      throw new NotFoundError(
        `Could not update event with ID: '${id}'. Event does not exist or ID is incorrect.`,
      );
    }

    const updatedStartTime = new Date(
      parsedBody.$set.start_time || existingEvent.start_time,
    );
    if (existingEvent.end_time || parsedBody.$set.end_time) {
      const updatedEndTime = new Date(
        parsedBody.$set.end_time || existingEvent.end_time,
      );

      if (updatedStartTime.getTime() > updatedEndTime.getTime()) {
        throw new BadRequestError(
          "Failed to update event: end_time must be after start_time",
        );
      }
    }

    // check for duplicate name
    if (parsedBody.$set.name) {
      const existingEventWithName = await db
        .collection("events")
        .findOne({ name: parsedBody.$set.name });
      if (existingEventWithName) {
        throw new BadRequestError(
          `Duplicate: event name ${parsedBody.$set.name} already in use by another event.`,
        );
      }
    }

    // update if validation passes
    const event = await db
      .collection("events")
      .updateOne({ _id: objectId }, parsedBody);

    return {
      ok: true,
      body: event,
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message || "Internal Server Error",
    };
  }
}
