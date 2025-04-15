import { getDatabase } from "@utils/mongodb/mongoClient.mjs";
import { ObjectId } from "mongodb";
import isBodyEmpty from "@utils/request/isBodyEmpty";
import parseAndReplace from "@utils/request/parseAndReplace";
import {
  NoContentError,
  NotFoundError,
  HttpError,
} from "@utils/response/Errors";

export const UpdatePanel = async (id: string, body: object) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();

    const updateStatus = await db
      .collection("panels")
      .updateOne({ _id: new ObjectId(id) }, parsedBody);

    if (updateStatus.matchedCount === 0) {
      throw new NotFoundError(`Panel with id: ${id} not found.`);
    }

    return { ok: true, body: "Panel updated.", error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
