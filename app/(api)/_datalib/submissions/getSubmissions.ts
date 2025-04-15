import { getDatabase } from "@utils/mongodb/mongoClient.mjs";
import parseAndReplace from "@utils/request/parseAndReplace";
import { HttpError } from "@utils/response/Errors";
import { ObjectId } from "mongodb";

export const GetManySubmissions = async (query: object = {}) => {
  try {
    const parsedQuery = await parseAndReplace(query);
    const db = await getDatabase();
    const submissions = await db
      .collection("submissions")
      .find(parsedQuery)
      .toArray();

    return { ok: true, body: submissions, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetSubmission = async (judge_id: string, team_id: string) => {
  try {
    const judge_object_id = new ObjectId(judge_id);
    const team_object_id = new ObjectId(team_id);

    const db = await getDatabase();
    const submission = await db.collection("submissions").findOne({
      judge_id: judge_object_id,
      team_id: team_object_id,
    });

    if (submission === null) {
      throw Error(
        `Submission with judge id: ${judge_id} and team id: ${team_id} not found.`,
      );
    }

    return { ok: true, body: submission, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetJudgeSubmissions = async (judge_id: string) => {
  try {
    const judge_object_id = new ObjectId(judge_id);

    const db = await getDatabase();
    const submissions = await db
      .collection("submissions")
      .find({
        judge_id: judge_object_id,
      })
      .toArray();

    return { ok: true, body: submissions, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
