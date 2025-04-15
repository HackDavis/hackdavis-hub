import { getDatabase } from "@utils/mongodb/mongoClient.mjs";
import isBodyEmpty from "@utils/request/isBodyEmpty";
import {
  NoContentError,
  NotFoundError,
  DuplicateError,
  HttpError,
  BadRequestError,
} from "@utils/response/Errors";
import parseAndReplace from "@utils/request/parseAndReplace";

export const LinkUserToEvent = async (body: {
  user_id: object;
  event_id: object;
}) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const db = await getDatabase();
    const parsedBody = await parseAndReplace(body);

    const user = await db.collection("users").findOne({
      _id: parsedBody.user_id,
    });
    if (user === null) {
      throw new NotFoundError(
        `user with id: ${parsedBody.user_id.toString()} not found.`,
      );
    }
    if (user.role !== "hacker") {
      throw new BadRequestError(
        "Unauthorized: only hackers can be linked to events.",
      );
    }

    const event = await db.collection("events").findOne({
      _id: parsedBody.event_id,
    });
    if (event === null) {
      throw new NotFoundError(
        `event with id: ${parsedBody.event_id.toString()} not found.`,
      );
    }

    const existingUserToEvent = await db
      .collection("userToEvents")
      .findOne(parsedBody);
    if (existingUserToEvent) {
      throw new DuplicateError("UserToEvent already exists");
    }

    const creationStatus = await db
      .collection("userToEvents")
      .insertOne(parsedBody);
    const userToEvent = await db.collection("userToEvents").findOne({
      _id: creationStatus.insertedId,
    });

    return { ok: true, body: userToEvent, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
