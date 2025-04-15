import { getDatabase } from "@utils/mongodb/mongoClient.mjs";
import { ObjectId } from "mongodb";
import parseAndReplace from "@utils/request/parseAndReplace";
import { HttpError, NotFoundError } from "@utils/response/Errors";

export const GetManyPanels = async (query: object = {}) => {
  try {
    const db = await getDatabase();
    const parsedQuery = await parseAndReplace(query);
    const panels = await db
      .collection("panels")
      .aggregate([
        { $match: parsedQuery },
        {
          $lookup: {
            from: "users",
            localField: "user_ids",
            foreignField: "_id",
            as: "users",
          },
        },
      ])
      .toArray();

    return { ok: true, body: panels, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetPanel = async (id: string) => {
  try {
    const db = await getDatabase();
    const object_id = new ObjectId(id);
    const panel = await db.collection("panels").findOne({ _id: object_id });

    if (panel === null) {
      throw new NotFoundError(`Panel with id: ${id} not found.`);
    }

    return { ok: true, body: panel, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
