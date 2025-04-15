"use server";
import { UpdateSubmission } from "@datalib/submissions/updateSubmission";
import Submission from "@typeDefs/submission";

export default async function updateSubmission(
  judge_id: string,
  team_id: string,
  body: Submission,
) {
  const { _id: _, judge_id: __, team_id: ___, ...rest } = body;

  const updateRes = await UpdateSubmission(judge_id, team_id, {
    $set: rest,
  });

  return updateRes;
}
